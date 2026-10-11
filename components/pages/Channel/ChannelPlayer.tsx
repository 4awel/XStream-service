'use client';

import { Avatar } from '@ui/Avatar';
import { LiveIcon } from '@ui/Icons';
import { useHlsPlayer } from '@composables/useHlsPlayer';
import type { PublicChannel } from '@models/channel';
import type { ReactNode } from 'react';

/**
 * Плеер канала. Пока поток не играет — заставка поверх: шапка канала и статус.
 * Плеер при этом продолжает опрашивать сервер и сам подхватит эфир, когда он начнётся.
 */
export const ChannelPlayer = ({ channel }: { channel: PublicChannel }): ReactNode => {
    const { videoRef, status } = useHlsPlayer(channel.id);
    const isPlaying = status === 'playing';

    return (
        <div className='relative aspect-video w-full overflow-hidden bg-[#000] lg:rounded-xl'>
            {/* muted обязателен: без него браузер не даст автозапуск. */}
            <video ref={videoRef} className='h-full w-full' controls playsInline muted />

            {!isPlaying && (
                <div className='absolute inset-0 overflow-hidden'>
                    {channel.bannerUrl !== null ? (
                        // eslint-disable-next-line @next/next/no-img-element -- файл из MinIO
                        <img
                            src={channel.bannerUrl}
                            alt=''
                            className='h-full w-full scale-110 object-cover opacity-40 blur-sm'
                        />
                    ) : (
                        <div className='h-full w-full bg-gradient-to-br from-accent-soft via-surface to-bg' />
                    )}
                    <div className='absolute inset-0 flex flex-col items-center justify-center gap-4 bg-overlay p-6 text-center text-[#fff]'>
                        {status === 'loading' || status === 'idle' ? (
                            <span className='flex size-14 animate-pulse items-center justify-center rounded-full bg-accent'>
                                <LiveIcon className='size-7' />
                            </span>
                        ) : (
                            <Avatar
                                src={channel.streamer.avatarUrl}
                                name={channel.streamer.displayName}
                                size='xl'
                            />
                        )}
                        <div>
                            <p className='text-xl font-extrabold'>
                                {status === 'loading' || status === 'idle'
                                    ? 'Подключаемся к трансляции...'
                                    : status === 'error'
                                      ? 'Медиасервер недоступен'
                                      : `${channel.streamer.displayName} сейчас не в сети`}
                            </p>
                            {status === 'offline' && (
                                <p className='mt-1 text-sm opacity-80'>
                                    Подпишитесь, чтобы не пропустить следующий эфир
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
