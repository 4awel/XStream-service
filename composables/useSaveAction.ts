'use client';

import { useCallback, useState } from 'react';
import { getErrorMessage } from '@store/utils';

interface UseSaveAction {
    isSaving: boolean;
    error: string | null;
    success: string | null;
    /** Выполняет действие, показывает ошибку или сообщение об успехе. */
    run: (action: () => Promise<void>, successText?: string) => Promise<boolean>;
}

/** Одно состояние «сохраняю / ошибка / сохранено» на форму настроек. */
export const useSaveAction = (): UseSaveAction => {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const run = useCallback(
        async (action: () => Promise<void>, successText = 'Сохранено'): Promise<boolean> => {
            setIsSaving(true);
            setError(null);
            setSuccess(null);
            try {
                await action();
                setSuccess(successText);
                return true;
            } catch (caught) {
                setError(getErrorMessage(caught));
                return false;
            } finally {
                setIsSaving(false);
            }
        },
        [],
    );

    return { isSaving, error, success, run };
};
