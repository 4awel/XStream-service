'use client';

import { useEffect, useState } from 'react';
import { formatUptime } from '@/lib/format/format';
import type { ReactNode } from 'react';

/** Тикающая длительность эфира. До монтирования — пусто, чтобы не было рассинхрона с SSR. */
export const Uptime = ({ startedAt }: { startedAt: string }): ReactNode => {
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        const tick = (): void => setNow(Date.now());
        const first = setTimeout(tick, 0);
        const timer = setInterval(tick, 1000);
        return () => {
            clearTimeout(first);
            clearInterval(timer);
        };
    }, []);

    return <span className='tabular-nums'>{now === null ? '' : formatUptime(startedAt, now)}</span>;
};
