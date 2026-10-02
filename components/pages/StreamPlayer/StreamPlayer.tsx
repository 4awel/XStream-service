'use client';

import { useHlsPlayer } from '@composables/useHlsPlayer';
import type { PlayerStatus } from '@composables/useHlsPlayer';
import type { ReactNode } from 'react';

interface StreamPlayerProps {
    channelId: string | null;
}

/** null — показывать нечего, видео само себя объясняет. */
const overlayText: Record<PlayerStatus, string | null> = {
    idle: 'Канал не выбран',
    loading: 'Подключаемся к трансляции...',
    playing: null,
    offline: 'Стример не в эфире',
    error: 'Медиасервер недоступен. Подробности в консоли браузера',
};

export const StreamPlayer = ({ channelId }: StreamPlayerProps): ReactNode => {
    const { videoRef, status } = useHlsPlayer(channelId);
    const overlay = overlayText[status];

    return (
        <div className='relative aspect-video overflow-hidden rounded-main bg-gray-dark'>
            {/* muted обязателен: без него браузер не даст автозапуск. */}
            <video ref={videoRef} className='h-full w-full' controls playsInline muted />

            {overlay !== null && (
                <div className='absolute inset-0 flex items-center justify-center bg-gray-dark text-gray'>
                    {overlay}
                </div>
            )}
        </div>
    );
};
