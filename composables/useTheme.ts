'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { userUpdated } from '@store/slices/user.slice';
import { UserService } from '@services/user.service';
import { applyTheme } from '@/lib/theme/theme';
import type { Theme } from '@/lib/theme/theme';

interface UseTheme {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const readDomTheme = (): Theme =>
    typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-theme') === 'light'
        ? 'LIGHT'
        : 'DARK';

/**
 * Применяем тему сразу (оптимистично), а вошедшему ещё и сохраняем на сервере.
 * Гостю тема живёт только в localStorage.
 */
export const useTheme = (): UseTheme => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);
    // Гостю тему с сервера не получить — держим её локально, чтобы иконка перерисовалась.
    const [guestTheme, setGuestTheme] = useState<Theme>(readDomTheme);
    const theme = user?.theme ?? guestTheme;

    const setTheme = (next: Theme): void => {
        applyTheme(next);
        setGuestTheme(next);
        if (user === null) {
            return;
        }
        dispatch(userUpdated({ ...user, theme: next }));
        UserService.updateTheme(next)
            .then((updated) => dispatch(userUpdated(updated)))
            // не сохранилось — откатываем, чтобы интерфейс не врал
            .catch(() => {
                applyTheme(user.theme);
                dispatch(userUpdated(user));
            });
    };

    return { theme, setTheme };
};
