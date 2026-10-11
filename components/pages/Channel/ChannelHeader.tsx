'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { HeartIcon, SettingsIcon, ShareIcon, UserIcon } from '@ui/Icons';
import { Notice } from '@ui/Notice';
import { LiveBadge } from '@/components/stream/LiveBadge';
import { Uptime } from '@/components/stream/Uptime';
import { useAppSelector } from '@store/hooks';
import { formatCount, plural } from '@/lib/format/format';
import type { PublicChannel } from '@models/channel';
import type { ReactNode } from 'react';

interface ChannelHeaderProps {
    channel: PublicChannel;
    viewersCount: number;
    isFollowBusy: boolean;
    followError: string | null;
    onToggleFollow: () => void;
}

export const ChannelHeader = ({
    channel,
    viewersCount,
    isFollowBusy,
    followError,
    onToggleFollow,
}: ChannelHeaderProps): ReactNode => {
    const userId = useAppSelector((state) => state.user.user?.id ?? null);
    const [isCopied, setIsCopied] = useState(false);
    const isOwn = channel.streamer.id === userId;

    const share = (): void => {
        navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 1500);
            })
            .catch(() => undefined);
    };

    return (
        <section className='flex flex-col gap-3 px-4 lg:px-0'>
            <div className='flex flex-wrap items-start gap-4'>
                <Avatar
                    src={channel.streamer.avatarUrl}
                    name={channel.streamer.displayName}
                    size='lg'
                    isLive={channel.isLive}
                />
                <div className='min-w-0 flex-1'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <h1 className='truncate text-xl font-extrabold'>
                            {channel.streamer.displayName}
                        </h1>
                        {channel.isLive && <LiveBadge />}
                    </div>
                    <p className='mt-0.5 line-clamp-2 font-medium'>
                        {channel.streamTitle ?? 'Без названия'}
                    </p>
                    <div className='mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted'>
                        {channel.category !== null && (
                            <Link
                                href={`/category/${channel.category.slug}`}
                                className='font-semibold text-accent hover:underline'
                            >
                                {channel.category.title}
                            </Link>
                        )}
                        {channel.isLive && (
                            <span className='flex items-center gap-1 font-semibold text-accent'>
                                <UserIcon className='size-4' />
                                {formatCount(viewersCount)}
                            </span>
                        )}
                        {channel.isLive && channel.liveStartedAt !== null && (
                            <Uptime startedAt={channel.liveStartedAt} />
                        )}
                        <span>
                            {formatCount(channel.followersCount)}{' '}
                            {plural(channel.followersCount, ['фоловер', 'фоловера', 'фоловеров'])}
                        </span>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <Button variant='secondary' onClick={share} aria-label='Скопировать ссылку'>
                        <ShareIcon className='size-4' />
                        <span className='hidden sm:inline'>
                            {isCopied ? 'Скопировано' : 'Поделиться'}
                        </span>
                    </Button>
                    {isOwn ? (
                        <Link
                            href='/settings?tab=channel'
                            className='flex h-10 items-center gap-2 rounded-full bg-surface-2 px-4 text-sm font-semibold hover:bg-surface-3'
                        >
                            <SettingsIcon className='size-4' />
                            Настроить
                        </Link>
                    ) : userId === null ? (
                        <Link
                            href='/login'
                            className='flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-on-accent hover:bg-accent-hover'
                        >
                            <HeartIcon className='size-4' />
                            Подписаться
                        </Link>
                    ) : (
                        <Button
                            variant={channel.isFollowing ? 'secondary' : 'primary'}
                            isLoading={isFollowBusy}
                            onClick={onToggleFollow}
                        >
                            <HeartIcon
                                className={`size-4 ${channel.isFollowing ? 'fill-accent text-accent' : ''}`}
                            />
                            {channel.isFollowing ? 'Вы подписаны' : 'Подписаться'}
                        </Button>
                    )}
                </div>
            </div>
            {followError !== null && <Notice tone='error'>{followError}</Notice>}
        </section>
    );
};
