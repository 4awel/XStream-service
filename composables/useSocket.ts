'use client';

import { useEffect } from 'react';
import { socket } from '@socket/socket.client';
import { useAppDispatch } from '@store/hooks';
import { registerSocketListeners } from '@store/socket/registerSocketListeners';

/** Подключает websocket один раз на приложение и прокидывает события в store. */
export const useSocket = (): void => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubscribe = registerSocketListeners(dispatch);
        socket.connect();

        return () => {
            unsubscribe();
            socket.disconnect();
        };
    }, [dispatch]);
};
