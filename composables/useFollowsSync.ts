'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchFollows, followsCleared } from '@store/slices/follows.slice';

/** Список подписок живёт столько же, сколько сессия: вошёл — загрузили, вышел — очистили. */
export const useFollowsSync = (): void => {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.user.user?.id ?? null);

    useEffect(() => {
        if (userId === null) {
            dispatch(followsCleared());
            return undefined;
        }
        void dispatch(fetchFollows());
        // Эфиры начинаются и заканчиваются — обновляем статусы в сайдбаре раз в минуту.
        const timer = setInterval(() => void dispatch(fetchFollows()), 60_000);
        return () => clearInterval(timer);
    }, [userId, dispatch]);
};
