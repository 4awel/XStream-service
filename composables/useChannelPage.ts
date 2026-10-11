'use client';

import { useState } from 'react';
import { useFetch } from '@composables/useFetch';
import { useWatchChannel } from '@composables/useWatchChannel';
import { ChannelService } from '@services/channel.service';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchFollows } from '@store/slices/follows.slice';
import { getErrorMessage } from '@store/utils';
import type { FollowState, PublicChannel } from '@models/channel';

interface UseChannelPage {
    channel: PublicChannel | null;
    isNotFound: boolean;
    /** Живой счётчик зрителей из сокета, пока его нет — из REST. */
    viewersCount: number;
    followError: string | null;
    isFollowBusy: boolean;
    toggleFollow: () => void;
}

export const useChannelPage = (username: string): UseChannelPage => {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.user.user?.id ?? null);
    const isInitialized = useAppSelector((state) => state.user.isInitialized);
    const live = useAppSelector((state) => state.channel);

    // userId в ключе: после входа сервер скажет, подписан ли уже.
    const { data, error } = useFetch(
        isInitialized ? `channel:${username}:${userId ?? 'guest'}` : null,
        () => ChannelService.getByUsername(username),
    );
    // Результат кнопки подписки поверх загруженного: привязан к id, чтобы не утечь на другой канал.
    const [followOverride, setFollowOverride] = useState<(FollowState & { id: string }) | null>(
        null,
    );
    const [followError, setFollowError] = useState<string | null>(null);
    const [isFollowBusy, setIsFollowBusy] = useState(false);

    useWatchChannel(data?.id ?? null);

    const isLiveRoom = data !== null && live.currentChannelId === data.id;
    const override = data !== null && followOverride?.id === data.id ? followOverride : null;
    const channel =
        data === null
            ? null
            : {
                  ...data,
                  isFollowing: override?.isFollowing ?? data.isFollowing,
                  // Фоловы прилетают и по сокету (кто-то другой подписался).
                  followersCount: Math.max(
                      override?.followersCount ?? data.followersCount,
                      isLiveRoom ? live.followersCount : 0,
                  ),
              };

    const toggleFollow = (): void => {
        if (channel === null || isFollowBusy) {
            return;
        }
        setIsFollowBusy(true);
        setFollowError(null);
        const request = channel.isFollowing
            ? ChannelService.unfollow(channel.id)
            : ChannelService.follow(channel.id);
        request
            .then((state) => {
                setFollowOverride({ ...state, id: channel.id });
                // Сайдбар «Подписки» должен обновиться сразу.
                void dispatch(fetchFollows());
            })
            .catch((caught: unknown) => setFollowError(getErrorMessage(caught)))
            .finally(() => setIsFollowBusy(false));
    };

    return {
        channel,
        isNotFound: error !== null,
        viewersCount:
            isLiveRoom && live.viewersCount > 0 ? live.viewersCount : (data?.viewersCount ?? 0),
        followError,
        isFollowBusy,
        toggleFollow,
    };
};
