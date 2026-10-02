'use client';

import Link from 'next/link';
import { ChangeChannel } from '@page-ui/ChangeChannel/ChangeChannel';
import { ChannelEvents } from '@page-ui/ChannelEvents/ChannelEvents';
import { Chat } from '@page-ui/Chat/Chat';
import { StreamKeyPanel } from '@page-ui/StreamKeyPanel/StreamKeyPanel';
import { StreamPlayer } from '@page-ui/StreamPlayer/StreamPlayer';
import { useAppSelector } from '@store/hooks';
import type { ReactNode } from 'react';

const HomePage = (): ReactNode => {
    const { user, isInitialized } = useAppSelector((state) => state.user);
    const currentChannelId = useAppSelector((state) => state.channel.currentChannelId);

    if (!isInitialized) {
        return <p className='text-gray'>Загрузка...</p>;
    }

    if (user === null) {
        return (
            <div className='flex flex-col items-start gap-4'>
                <p className='text-gray-light'>Войдите, чтобы открыть свой канал и чат.</p>
                <Link href='/login' className='rounded-main bg-red px-5 py-3 font-semibold'>
                    Войти
                </Link>
            </div>
        );
    }

    return (
        <div className='grid gap-6 lg:grid-cols-[1fr_360px]'>
            <div className='flex flex-col gap-6'>
                <ChangeChannel />
                <StreamPlayer channelId={currentChannelId} />
                <StreamKeyPanel />
                <ChannelEvents />
            </div>
            <Chat />
        </div>
    );
};

export default HomePage;
