'use client';

import { useAppSelector } from '@store/hooks';
import type { ReactNode } from 'react';

/** Лента фоловов и сабов в реальном времени. */
export const ChannelEvents = (): ReactNode => {
    const alerts = useAppSelector((state) => state.channel.alerts);

    if (alerts.length === 0) {
        return null;
    }

    return (
        <section className='rounded-xl bg-surface p-4'>
            <h2 className='mb-3 text-sm font-semibold text-muted'>События</h2>
            <ul className='flex flex-col gap-2'>
                {alerts.map((alert, index) => (
                    <li
                        key={`${alert.type}-${alert.data.userId}-${index}`}
                        className='rounded-md bg-surface-2 px-3 py-2 text-sm'
                    >
                        <span className='font-semibold text-accent'>{alert.data.username}</span>
                        {alert.type === 'follow'
                            ? ' подписался на канал'
                            : ` оформил платную подписку (${alert.data.months} мес.)`}
                    </li>
                ))}
            </ul>
        </section>
    );
};
