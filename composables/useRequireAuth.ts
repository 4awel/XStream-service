'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '@store/hooks';
import type { User } from '@models/user';

/**
 * Для страниц только для своих: гостя отправляет на /login.
 * Возвращает пользователя или null, пока /user/me ещё не ответил.
 */
export const useRequireAuth = (): User | null => {
    const router = useRouter();
    const { user, isInitialized } = useAppSelector((state) => state.user);

    useEffect(() => {
        if (isInitialized && user === null) {
            router.replace('/login');
        }
    }, [isInitialized, user, router]);

    return user;
};
