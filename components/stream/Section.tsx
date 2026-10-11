import Link from 'next/link';
import type { ReactNode } from 'react';

interface SectionProps {
    title: ReactNode;
    moreHref?: string;
    children: ReactNode;
}

export const Section = ({ title, moreHref, children }: SectionProps): ReactNode => (
    <section className='flex flex-col gap-4'>
        <div className='flex items-end justify-between gap-4'>
            <h2 className='text-xl font-extrabold tracking-tight'>{title}</h2>
            {moreHref !== undefined && (
                <Link href={moreHref} className='text-sm font-semibold text-accent hover:underline'>
                    Показать все
                </Link>
            )}
        </div>
        {children}
    </section>
);
