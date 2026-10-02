'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { hlsPlaybackUrl } from '@/lib/media/media.config';
import type { ErrorData } from 'hls.js';
import type { RefObject } from 'react';

/** offline — манифеста нет, то есть стример просто не в эфире. */
export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'offline' | 'error';

const FIRST_RETRY_DELAY_MS = 1_000;
const MAX_RETRY_DELAY_MS = 5_000;

/**
 * Первые попытки — частые, дальше реже.
 *
 * Дело в том, что MediaMTX создаёт HLS-мультиплексор только по первому запросу,
 * и этот первый запрос может вернуть 404, хотя стрим уже идёт. Ждать из-за этого
 * пять секунд обидно. А вот когда стример действительно не в эфире, долбить
 * сервер каждую секунду незачем — отсюда рост задержки.
 */
const retryDelayMs = (attempt: number): number =>
    Math.min(FIRST_RETRY_DELAY_MS * 2 ** attempt, MAX_RETRY_DELAY_MS);

interface UseHlsPlayer {
    videoRef: RefObject<HTMLVideoElement | null>;
    status: PlayerStatus;
}

/** Статус привязан к каналу: иначе при переключении видно состояние прошлого. */
interface PlayerState {
    channelId: string | null;
    status: PlayerStatus;
}

/** Код ответа у hls.js лежит в нетипизированном поле — читаем осторожно. */
const responseCode = (data: ErrorData): number | undefined => {
    const response: unknown = data.response;

    if (typeof response === 'object' && response !== null && 'code' in response) {
        const code: unknown = (response as { code: unknown }).code;
        return typeof code === 'number' ? code : undefined;
    }

    return undefined;
};

/**
 * Подключает HLS-поток канала к <video>.
 *
 * Пока стример не начал вещать, MediaMTX отдаёт на манифест 404 — это обычное
 * состояние, а не поломка, поэтому плеер молча ждёт и пробует снова. Так же он
 * сам подхватывает трансляцию, если страницу открыли раньше её начала.
 */
export const useHlsPlayer = (channelId: string | null): UseHlsPlayer => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [state, setState] = useState<PlayerState>({ channelId: null, status: 'idle' });

    useEffect(() => {
        const video = videoRef.current;

        if (channelId === null || video === null) {
            return;
        }

        const url = hlsPlaybackUrl(channelId);
        const setStatus = (status: PlayerStatus): void => setState({ channelId, status });

        let hls: Hls | null = null;
        let retryTimer: ReturnType<typeof setTimeout> | null = null;
        let retryAttempt = 0;

        const retryLater = (status: PlayerStatus, retry: () => void): void => {
            setStatus(status);
            retryTimer = setTimeout(retry, retryDelayMs(retryAttempt));
            retryAttempt += 1;
        };

        const handleNativeError = (): void => retryLater('offline', () => video.load());

        if (Hls.isSupported()) {
            hls = new Hls({ enableWorker: true });
            hls.loadSource(url);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                void video.play().catch(() => undefined);
            });

            hls.on(Hls.Events.ERROR, (_event, data) => {
                if (!data.fatal) {
                    return;
                }

                const code = responseCode(data);

                if (code !== 404) {
                    // Не 404 — значит что-то настоящее: CORS, недоступный медиасервер,
                    // битый поток. Показываем иначе и пишем причину в консоль.
                    console.warn('HLS error', data.details, code);
                }

                // startLoad вместо пересоздания Hls: это штатный способ
                // восстановиться после фатальной сетевой ошибки.
                retryLater(code === 404 ? 'offline' : 'error', () => hls?.startLoad());
            });
        } else {
            // Safari играет HLS нативно, и hls.js там только мешает.
            video.src = url;
            void video.play().catch(() => undefined);
            video.addEventListener('error', handleNativeError);
        }

        const handlePlaying = (): void => {
            // Заиграло — следующий обрыв снова начнём переподключать часто.
            retryAttempt = 0;
            setStatus('playing');
        };
        video.addEventListener('playing', handlePlaying);

        return () => {
            if (retryTimer !== null) {
                clearTimeout(retryTimer);
            }

            video.removeEventListener('playing', handlePlaying);
            video.removeEventListener('error', handleNativeError);
            hls?.destroy();
            video.removeAttribute('src');
        };
    }, [channelId]);

    if (channelId === null) {
        return { videoRef, status: 'idle' };
    }

    // Состояние ещё от прошлого канала — показываем загрузку, а не чужой статус.
    return { videoRef, status: state.channelId === channelId ? state.status : 'loading' };
};
