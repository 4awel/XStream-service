import type { ReactNode } from 'react';

interface NoticeProps {
    tone: 'error' | 'success';
    children: ReactNode;
}

export const Notice = ({ tone, children }: NoticeProps): ReactNode => (
    <p
        role={tone === 'error' ? 'alert' : 'status'}
        className={`rounded-md px-3 py-2 text-sm ${
            tone === 'error' ? 'bg-accent-soft text-accent' : 'bg-surface-2 text-success'
        }`}
    >
        {children}
    </p>
);
