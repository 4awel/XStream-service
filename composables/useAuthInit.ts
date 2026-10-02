'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@store/hooks';
import { fetchMe } from '@store/slices/user.slice';

/** При старте приложения проверяет session-cookie через GET /user/me. */
export const useAuthInit = (): void => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        void dispatch(fetchMe());
    }, [dispatch]);
};
