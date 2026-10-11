'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Spinner } from '@ui/Button';
import { ChatIcon } from '@ui/Icons';
import { ChannelAbout } from '@page-ui/Channel/ChannelAbout';
import { ChannelHeader } from '@page-ui/Channel/ChannelHeader';
import { ChannelPlayer } from '@page-ui/Channel/ChannelPlayer';
import { ChannelEvents } from '@page-ui/ChannelEvents/ChannelEvents';
import { Chat } from '@page-ui/Chat/Chat';
import { useChannelPage } from '@composables/useChannelPage';
import type { ReactNode } from 'react';

export const ChannelPage = ({ username }: { username: string }): ReactNode => {
    const { channel, isNotFound, viewersCount, followError, isFollowBusy, toggleFollow } =
        useChannelPage(username);
    const [isChatHidden, setIsChatHidden] = useState(false);

    if (isNotFound) {
        return (
            <div className='flex flex-col items-center gap-4 px-4 py-24 text-center'>
                <h1 className='text-2xl font-extrabold'>Канал не найден</h1>
                <p className='text-muted'>Возможно, стример сменил имя или канал удалён.</p>
                <Link href='/' className='font-semibold text-accent hover:underline'>
                    На главную
                </Link>
            </div>
        );
    }

    if (channel === null) {
        return (
            <div className='flex min-h-[60vh] items-center justify-center text-muted'>
                <Spinner className='size-6' />
            </div>
        );
    }

    return (
        <div className='flex'>
            <div className='flex min-w-0 flex-1 flex-col gap-5 pb-10 lg:p-4'>
                <ChannelPlayer channel={channel} />
                <ChannelHeader
                    channel={channel}
                    viewersCount={viewersCount}
                    isFollowBusy={isFollowBusy}
                    followError={followError}
                    onToggleFollow={toggleFollow}
                />

                {/* На мобильном чат идёт сразу под плеером, как в приложениях. */}
                <div className='h-[60vh] px-4 lg:hidden'>
                    <Chat isLive={channel.isLive} />
                </div>

                <div className='px-4 lg:px-0'>
                    <ChannelEvents />
                </div>
                <ChannelAbout channel={channel} />
            </div>

            {isChatHidden ? (
                <button
                    type='button'
                    onClick={() => setIsChatHidden(false)}
                    className='fixed right-4 bottom-4 z-30 hidden h-11 items-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-on-accent shadow-xl hover:bg-accent-hover lg:flex'
                >
                    <ChatIcon className='size-4' />
                    Показать чат
                </button>
            ) : (
                <aside className='sticky top-14 hidden h-[calc(100vh-56px)] w-[360px] shrink-0 py-4 pr-4 lg:block'>
                    <Chat isLive={channel.isLive} onCollapse={() => setIsChatHidden(true)} />
                </aside>
            )}
        </div>
    );
};
