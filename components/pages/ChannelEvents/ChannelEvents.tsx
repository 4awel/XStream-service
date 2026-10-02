'use client';

import { UserIcon } from '@ui/Icons';
import { useAppSelector } from '@store/hooks';
import type { ReactNode } from 'react';

/** Счётчики и лента фоловов/сабов в реальном времени. */
export const ChannelEvents = (): ReactNode => {
    const { viewersCount, followersCount, alerts } = useAppSelector((state) => state.channel);

    return (
        <section className='flex flex-col gap-4 rounded-main bg-gray-dark p-6'>
            <div className='flex gap-6'>
                <span className='flex items-center gap-2'>
                    <UserIcon className='text-red' />
                    {viewersCount} зрителей
                </span>
                <span className='text-gray-light'>{followersCount} фоловеров</span>
            </div>

            <ul className='flex flex-col gap-2'>
                {alerts.length === 0 && <li className='text-gray'>Событий пока нет</li>}
                {alerts.map((alert, index) => (
                    <li
                        key={`${alert.type}-${alert.data.userId}-${index}`}
                        className='rounded-main bg-black px-4 py-2'
                    >
                        <span className='font-semibold text-red'>{alert.data.username}</span>
                        {alert.type === 'follow'
                            ? ' подписался на канал'
                            : ` оформил платную подписку (${alert.data.months} мес.)`}
                    </li>
                ))}
            </ul>
        </section>
    );
};
