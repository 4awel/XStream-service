'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@store/hooks';
import { applyTheme } from '@/lib/theme/theme';

/**
 * Тема пользователя с сервера побеждает кэш в localStorage: выбрали светлую
 * на телефоне — на ноутбуке после входа тоже станет светлой.
 */
export const useThemeSync = (): void => {
    const theme = useAppSelector((state) => state.user.user?.theme ?? null);

    useEffect(() => {
        if (theme !== null) {
            applyTheme(theme);
        }
    }, [theme]);
};
