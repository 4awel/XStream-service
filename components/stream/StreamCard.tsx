import Link from 'next/link';
import { Avatar } from '@ui/Avatar';
import { LiveBadge } from '@/components/stream/LiveBadge';
import { formatCount, plural } from '@/lib/format/format';
import type { PublicChannel } from '@models/channel';
import type { ReactNode } from 'react';

/**
 * Превью эфира. Кадров из потока у нас пока нет, поэтому обложка — шапка канала,
 * а без неё фирменный градиент с аватаром стримера.
 */
export const StreamThumb = ({ channel }: { channel: PublicChannel }): ReactNode => (
    <div className='relative aspect-video overflow-hidden rounded-lg bg-surface-2'>
        {channel.bannerUrl !== null ? (
            // eslint-disable-next-line @next/next/no-img-element -- файл из MinIO
            <img
                src={channel.bannerUrl}
                alt=''
                loading='lazy'
                className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
            />
        ) : (
            <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-soft via-surface-2 to-surface-3 transition-transform duration-300 group-hover:scale-105'>
                <Avatar
                    src={channel.streamer.avatarUrl}
                    name={channel.streamer.displayName}
                    size='lg'
                />
            </div>
        )}
        {channel.isLive && <LiveBadge className='absolute top-2 left-2' />}
        {channel.isLive && (
            <span className='absolute bottom-2 left-2 rounded-sm bg-overlay px-1.5 py-0.5 text-xs font-semibold text-[#fff] backdrop-blur'>
                {formatCount(channel.viewersCount)}{' '}
                {plural(channel.viewersCount, ['зритель', 'зрителя', 'зрителей'])}
            </span>
        )}
    </div>
);

export const StreamCard = ({ channel }: { channel: PublicChannel }): ReactNode => (
    <article className='group flex min-w-0 flex-col gap-3'>
        <Link
            href={`/${channel.streamer.username}`}
            className='block rounded-lg ring-accent transition-shadow hover:ring-2'
        >
            <StreamThumb channel={channel} />
        </Link>
        <div className='flex gap-3'>
            <Link href={`/${channel.streamer.username}`} className='shrink-0'>
                <Avatar
                    src={channel.streamer.avatarUrl}
                    name={channel.streamer.displayName}
                    size='md'
                />
            </Link>
            <div className='min-w-0'>
                <Link
                    href={`/${channel.streamer.username}`}
                    className='line-clamp-1 font-semibold hover:text-accent'
                    title={channel.streamTitle ?? undefined}
                >
                    {channel.streamTitle ?? 'Без названия'}
                </Link>
                <p className='truncate text-sm text-muted'>{channel.streamer.displayName}</p>
                {channel.category !== null && (
                    <Link
                        href={`/category/${channel.category.slug}`}
                        className='mt-1 inline-block rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted hover:text-fg'
                    >
                        {channel.category.title}
                    </Link>
                )}
            </div>
        </div>
    </article>
);
