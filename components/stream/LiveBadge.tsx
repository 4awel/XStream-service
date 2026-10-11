import type { ReactNode } from 'react';

export const LiveBadge = ({ className = '' }: { className?: string }): ReactNode => (
    <span
        className={`inline-flex items-center gap-1 rounded-sm bg-accent px-1.5 py-0.5 text-[11px] font-extrabold tracking-wider text-on-accent uppercase ${className}`}
    >
        <span className='size-1.5 animate-pulse rounded-full bg-on-accent' />
        Live
    </span>
);
