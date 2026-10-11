'use client';

import { useEffect, useRef } from 'react';
import { socket } from '@socket/socket.client';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { registerSocketListeners } from '@store/socket/registerSocketListeners';

/** Подключает websocket один раз на приложение и прокидывает события в store. */
export const useSocket = (): void => {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.user.user?.id ?? null);
    const connectedAs = useRef<string | null>(null);

    useEffect(() => {
        const unsubscribe = registerSocketListeners(dispatch);
        socket.connect();

        return () => {
            unsubscribe();
            socket.disconnect();
        };
    }, [dispatch]);

    // Сервер узнаёт пользователя по сессии один раз — в рукопожатии. Вошли или вышли
    // уже после подключения — переподключаемся, иначе чат шлёт от анонима и сервер молчит.
    // Комната канала восстановится сама: socket.client.ts заходит в неё на 'connect'.
    useEffect(() => {
        if (connectedAs.current !== userId && socket.connected) {
            socket.disconnect().connect();
        }
        connectedAs.current = userId;
    }, [userId]);
};
