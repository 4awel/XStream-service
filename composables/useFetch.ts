'use client';

import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '@store/utils';

interface UseFetch<T> {
    data: T | null;
    error: string | null;
    isLoading: boolean;
    reload: () => void;
}

/**
 * Загрузка данных для страницы. key — когда он меняется, данные перезапрашиваются,
 * а ответы на старый key отбрасываются (быстро перешли в другую категорию —
 * медленный ответ от прошлой не перетрёт новую).
 */
export const useFetch = <T>(key: string | null, loader: () => Promise<T>): UseFetch<T> => {
    const [result, setResult] = useState<{ key: string; data: T | null; error: string | null }>({
        key: '',
        data: null,
        error: null,
    });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (key === null) {
            return undefined;
        }
        let isCancelled = false;
        loader()
            .then((data) => {
                if (!isCancelled) {
                    setResult({ key, data, error: null });
                }
            })
            .catch((caught: unknown) => {
                if (!isCancelled) {
                    setResult({ key, data: null, error: getErrorMessage(caught) });
                }
            });
        return () => {
            isCancelled = true;
        };
        // loader намеренно не в зависимостях: он пересоздаётся на каждый рендер,
        // а перезапрос определяет key.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, attempt]);

    const reload = useCallback(() => setAttempt((value) => value + 1), []);
    const isCurrent = key !== null && result.key === key;

    return {
        data: isCurrent ? result.data : null,
        error: isCurrent ? result.error : null,
        isLoading: key !== null && !isCurrent,
        reload,
    };
};
