'use client';

import Link from 'next/link';
import { STREAM_GRID } from '@page-ui/Home/Home';
import { StreamCard } from '@/components/stream/StreamCard';
import { ArrowLeftIcon, LiveIcon } from '@ui/Icons';
import { useFetch } from '@composables/useFetch';
import { BrowseService } from '@services/browse.service';
import { formatCount, plural } from '@/lib/format/format';
import type { ReactNode } from 'react';

export const CategoryPage = ({ slug }: { slug: string }): ReactNode => {
    const { data, error } = useFetch(`category:${slug}`, () => BrowseService.category(slug));

    if (error !== null) {
        return (
            <div className='flex flex-col items-center gap-4 px-4 py-24 text-center'>
                <h1 className='text-2xl font-extrabold'>Категория не найдена</h1>
                <Link href='/categories' className='font-semibold text-accent hover:underline'>
                    Все категории
                </Link>
            </div>
        );
    }

    return (
        <div className='mx-auto flex max-w-[1800px] flex-col gap-6 px-4 py-6 sm:px-6'>
            <Link
                href='/categories'
                className='flex items-center gap-1 self-start text-sm font-semibold text-muted hover:text-fg'
            >
                <ArrowLeftIcon className='size-4' />
                Все категории
            </Link>

            {data === null ? (
                <div className='h-24 animate-pulse rounded-xl bg-surface' />
            ) : (
                <header className='flex flex-wrap items-center gap-5 rounded-xl border border-line bg-surface p-5'>
                    <span className='flex size-16 items-center justify-center rounded-lg bg-accent text-2xl font-extrabold text-on-accent'>
                        {data.category.title.slice(0, 1)}
                    </span>
                    <div>
                        <h1 className='text-3xl font-extrabold tracking-tight'>
                            {data.category.title}
                        </h1>
                        <p className='mt-1 text-sm text-muted'>
                            <span className='font-semibold text-accent'>
                                {formatCount(data.category.liveViewers)}
                            </span>{' '}
                            {plural(data.category.liveViewers, ['зритель', 'зрителя', 'зрителей'])}{' '}
                            · {data.category.liveChannels}{' '}
                            {plural(data.category.liveChannels, ['канал', 'канала', 'каналов'])} в
                            эфире
                        </p>
                    </div>
                </header>
            )}

            {data !== null && data.channels.length === 0 && (
                <div className='flex flex-col items-center gap-3 rounded-xl bg-surface px-6 py-14 text-center text-muted'>
                    <LiveIcon className='size-8' />В этой категории сейчас никто не стримит.
                </div>
            )}

            {data !== null && data.channels.length > 0 && (
                <div className={STREAM_GRID}>
                    {data.channels.map((channel) => (
                        <StreamCard key={channel.id} channel={channel} />
                    ))}
                </div>
            )}
        </div>
    );
};
