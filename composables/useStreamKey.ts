'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@services/api/api';
import { ChannelService } from '@services/channel.service';
import { getErrorMessage } from '@store/utils';
import type { StreamKey } from '@models/stream';

interface UseStreamKey {
    streamKey: StreamKey | null;
    isLoading: boolean;
    error: string | null;
    /** Ключа ещё нет (или он нечитаем) — нужно нажать «Создать». */
    isMissing: boolean;
    reset: () => void;
}

/**
 * 404 — ключ ещё ни разу не создавали, 409 — сменился STREAM_KEY_SECRET и старый
 * ключ больше не расшифровывается. И то и другое лечится сбросом, так что это
 * не ошибка, а повод показать кнопку.
 */
const isMissingKeyError = (error: unknown): boolean =>
    error instanceof ApiError && (error.status === 404 || error.status === 409);

/** Ключ потока для OBS: показать текущий и выдать новый. */
export const useStreamKey = (): UseStreamKey => {
    const [streamKey, setStreamKey] = useState<StreamKey | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMissing, setIsMissing] = useState(false);

    useEffect(() => {
        let isCancelled = false;

        void (async (): Promise<void> => {
            try {
                const loaded = await ChannelService.getStreamKey();

                if (!isCancelled) {
                    setStreamKey(loaded);
                    setIsMissing(false);
                }
            } catch (caught) {
                if (isCancelled) {
                    return;
                }

                if (isMissingKeyError(caught)) {
                    setIsMissing(true);
                } else {
                    setError(getErrorMessage(caught));
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            isCancelled = true;
        };
    }, []);

    const reset = useCallback((): void => {
        void (async (): Promise<void> => {
            setIsLoading(true);
            setError(null);

            try {
                setStreamKey(await ChannelService.resetStreamKey());
                setIsMissing(false);
            } catch (caught) {
                setError(getErrorMessage(caught));
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return { streamKey, isLoading, error, isMissing, reset };
};
