'use client';

import { useEffect } from 'react';
import { joinChannel, leaveChannel } from '@socket/socket.client';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { channelChanged } from '@store/slices/channel.slice';

interface UseChangeChannel {
    currentChannelId: string | null;
    changeChannel: (channelId: string) => void;
}

/**
 * Переключает открытый канал: сбрасывает live-состояние и чат
 * и переводит сокет в комнату нового канала.
 * По умолчанию открывается свой канал.
 */
export const useChangeChannel = (): UseChangeChannel => {
    const dispatch = useAppDispatch();
    const currentChannelId = useAppSelector((state) => state.channel.currentChannelId);
    const ownChannelId = useAppSelector((state) => state.user.user?.channel.id ?? null);

    const changeChannel = (channelId: string): void => {
        const trimmed = channelId.trim();
        if (trimmed.length === 0 || trimmed === currentChannelId) {
            return;
        }
        dispatch(channelChanged(trimmed));
        joinChannel(trimmed);
    };

    useEffect(() => {
        if (currentChannelId === null && ownChannelId !== null) {
            dispatch(channelChanged(ownChannelId));
            joinChannel(ownChannelId);
        }
    }, [currentChannelId, ownChannelId, dispatch]);

    useEffect(() => leaveChannel, []);

    return { currentChannelId, changeChannel };
};
