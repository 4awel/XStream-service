'use client';

import { useCallback, useEffect } from 'react';
import { ChannelService } from '@services/channel.service';
import { useAppDispatch, useAppSelector, useAppStore } from '@store/hooks';
import { historyFailed, historyLoaded, historyLoading } from '@store/slices/chat.slice';

interface UseChatHistory {
    hasMore: boolean;
    isLoading: boolean;
    loadOlder: () => void;
}

/**
 * Подгружает чат текущего эфира: первую страницу при смене канала,
 * дальше — по кнопке «показать ещё». Курсор — id самого старого сообщения в сторе.
 */
export const useChatHistory = (): UseChatHistory => {
    const dispatch = useAppDispatch();
    const store = useAppStore();
    const channelId = useAppSelector((state) => state.channel.currentChannelId);
    const hasMore = useAppSelector((state) => state.chat.hasMore);
    const isLoading = useAppSelector((state) => state.chat.isLoadingHistory);

    const load = useCallback(
        async (targetChannelId: string, before?: string): Promise<void> => {
            dispatch(historyLoading());
            try {
                const history = await ChannelService.getChat(targetChannelId, before);
                // за время запроса могли открыть другой канал — ответ уже не нужен
                if (store.getState().channel.currentChannelId !== targetChannelId) {
                    return;
                }
                dispatch(historyLoaded({ ...history, channelId: targetChannelId }));
            } catch {
                dispatch(historyFailed());
            }
        },
        [dispatch, store],
    );

    useEffect(() => {
        if (channelId !== null) {
            void load(channelId);
        }
    }, [channelId, load]);

    const loadOlder = useCallback((): void => {
        const { channel, chat } = store.getState();
        if (channel.currentChannelId === null || chat.isLoadingHistory || !chat.hasMore) {
            return;
        }
        void load(channel.currentChannelId, chat.messages[0]?.id);
    }, [load, store]);

    return { hasMore, isLoading, loadOlder };
};
