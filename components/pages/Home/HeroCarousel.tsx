'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Avatar } from '@ui/Avatar';
import { ChevronLeftIcon, ChevronRightIcon } from '@ui/Icons';
import { LiveBadge } from '@/components/stream/LiveBadge';
import { StreamThumb } from '@/components/stream/StreamCard';
import { useHlsPlayer } from '@composables/useHlsPlayer';
import { formatCount, plural } from '@/lib/format/format';
import type { PublicChannel } from '@models/channel';
import type { ReactNode } from 'react';

const AUTOPLAY_MS = 10_000;

/** Активный слайд: настоящий поток без звука, пока не начал играть — обложка. */
const LivePreview = ({ channel }: { channel: PublicChannel }): ReactNode => {
    const { videoRef, status } = useHlsPlayer(channel.id);

    return (
        <div className='relative aspect-video overflow-hidden rounded-xl bg-[#000]'>
            <video
                ref={videoRef}
                className={`h-full w-full object-cover transition-opacity duration-500 ${
                    status === 'playing' ? 'opacity-100' : 'opacity-0'
                }`}
                playsInline
                muted
            />
            {status !== 'playing' && (
                <div className='absolute inset-0'>
                    <StreamThumb channel={channel} />
                </div>
            )}
            <LiveBadge className='absolute top-3 left-3' />
        </div>
    );
};

export const HeroCarousel = ({ channels }: { channels: PublicChannel[] }): ReactNode => {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const count = channels.length;
    const active = channels[index % count];

    useEffect(() => {
        if (isPaused || count < 2) {
            return undefined;
        }
        const timer = setInterval(() => setIndex((current) => (current + 1) % count), AUTOPLAY_MS);
        return () => clearInterval(timer);
    }, [isPaused, count]);

    if (active === undefined) {
        return null;
    }

    const go = (step: number): void => setIndex((current) => (current + step + count) % count);

    return (
        <section
            aria-roledescription='карусель'
            className='relative'
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className='grid gap-5 rounded-xl border border-line bg-surface p-3 sm:p-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'>
                <Link href={`/${active.streamer.username}`} className='block'>
                    {/* key: при смене слайда плеер пересоздаётся под новый канал. */}
                    <LivePreview key={active.id} channel={active} />
                </Link>

                <div className='flex min-w-0 flex-col gap-4 p-1 sm:p-2'>
                    <Link href={`/${active.streamer.username}`} className='flex items-center gap-3'>
                        <Avatar
                            src={active.streamer.avatarUrl}
                            name={active.streamer.displayName}
                            size='lg'
                            isLive
                        />
                        <div className='min-w-0'>
                            <p className='truncate text-xl font-extrabold hover:text-accent'>
                                {active.streamer.displayName}
                            </p>
                            <p className='text-sm text-accent'>
                                {formatCount(active.viewersCount)}{' '}
                                {plural(active.viewersCount, ['зритель', 'зрителя', 'зрителей'])}
                            </p>
                        </div>
                    </Link>
                    {active.category !== null && (
                        <Link
                            href={`/category/${active.category.slug}`}
                            className='self-start rounded-full bg-surface-2 px-3 py-1 text-sm font-medium text-muted hover:text-fg'
                        >
                            {active.category.title}
                        </Link>
                    )}
                    <p className='line-clamp-3 text-lg font-semibold'>
                        {active.streamTitle ?? 'Без названия'}
                    </p>
                    {active.streamer.bio !== null && (
                        <p className='line-clamp-3 text-sm text-muted'>{active.streamer.bio}</p>
                    )}

                    {count > 1 && (
                        <div className='mt-auto flex items-center justify-between gap-3'>
                            <div className='flex gap-1.5'>
                                {channels.map((channel, dot) => (
                                    <button
                                        key={channel.id}
                                        type='button'
                                        aria-label={`Слайд ${dot + 1}`}
                                        aria-current={dot === index % count}
                                        onClick={() => setIndex(dot)}
                                        className={`h-1.5 rounded-full transition-all ${
                                            dot === index % count
                                                ? 'w-8 bg-accent'
                                                : 'w-3 bg-surface-3 hover:bg-subtle'
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className='flex gap-2'>
                                <button
                                    type='button'
                                    aria-label='Предыдущий'
                                    onClick={() => go(-1)}
                                    className='flex size-9 items-center justify-center rounded-full bg-surface-2 hover:bg-surface-3'
                                >
                                    <ChevronLeftIcon />
                                </button>
                                <button
                                    type='button'
                                    aria-label='Следующий'
                                    onClick={() => go(1)}
                                    className='flex size-9 items-center justify-center rounded-full bg-surface-2 hover:bg-surface-3'
                                >
                                    <ChevronRightIcon />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
