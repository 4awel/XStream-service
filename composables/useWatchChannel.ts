'use client';

import { useEffect } from 'react';
import { joinChannel, leaveChannel } from '@socket/socket.client';
import { useAppDispatch } from '@store/hooks';
import { channelChanged } from '@store/slices/channel.slice';

/**
 * Пока страница канала открыта — сидим в его комнате: чат, зрители, алерты.
 * Ушли со страницы — выходим, чтобы не числиться зрителем и не получать чужой чат.
 */
export const useWatchChannel = (channelId: string | null): void => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (channelId === null) {
            return undefined;
        }
        dispatch(channelChanged(channelId));
        joinChannel(channelId);
        return () => leaveChannel();
    }, [channelId, dispatch]);
};
