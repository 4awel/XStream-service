'use client';

import Link from 'next/link';
import { HeroCarousel } from '@page-ui/Home/HeroCarousel';
import { CategoryCard } from '@/components/stream/CategoryCard';
import { Section } from '@/components/stream/Section';
import { StreamCard } from '@/components/stream/StreamCard';
import { LiveIcon } from '@ui/Icons';
import { useFetch } from '@composables/useFetch';
import { BrowseService } from '@services/browse.service';
import { useAppSelector } from '@store/hooks';
import type { ReactNode } from 'react';

const CAROUSEL_SIZE = 5;
const HOME_CATEGORIES = 12;

export const STREAM_GRID = 'grid gap-x-4 gap-y-7 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';
export const CATEGORY_GRID =
    'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6';

const SkeletonGrid = (): ReactNode => (
    <div className={STREAM_GRID}>
        {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className='flex flex-col gap-3'>
                <div className='aspect-video animate-pulse rounded-lg bg-surface' />
                <div className='h-4 w-2/3 animate-pulse rounded-full bg-surface' />
            </div>
        ))}
    </div>
);

export const Home = (): ReactNode => {
    const userId = useAppSelector((state) => state.user.user?.id ?? null);
    const isInitialized = useAppSelector((state) => state.user.isInitialized);
    const follows = useAppSelector((state) => state.follows.channels);

    // userId в ключе: после входа рекомендации пересчитываются под интересы.
    const recommended = useFetch(isInitialized ? `rec:${userId ?? 'guest'}` : null, () =>
        BrowseService.recommended(48),
    );
    const categories = useFetch(isInitialized ? `cat:${userId ?? 'guest'}` : null, () =>
        BrowseService.categories(),
    );

    const liveFollows = follows.filter((channel) => channel.isLive);
    const channels = recommended.data ?? [];
    const hasNoLive = recommended.data !== null && channels.length === 0;

    return (
        <div className='mx-auto flex max-w-[1800px] flex-col gap-10 px-4 py-6 sm:px-6'>
            {channels.length > 0 && <HeroCarousel channels={channels.slice(0, CAROUSEL_SIZE)} />}

            {hasNoLive && (
                <section className='flex flex-col items-center gap-3 rounded-xl border border-line bg-surface px-6 py-14 text-center'>
                    <span className='flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent'>
                        <LiveIcon className='size-7' />
                    </span>
                    <h1 className='text-2xl font-extrabold'>Сейчас никто не в эфире</h1>
                    <p className='max-w-md text-muted'>
                        Самое время начать свой стрим: ключ для OBS — в настройках.
                    </p>
                    <Link
                        href='/settings?tab=stream-key'
                        className='mt-2 flex h-10 items-center rounded-full bg-accent px-5 text-sm font-semibold text-on-accent hover:bg-accent-hover'
                    >
                        Начать стрим
                    </Link>
                </section>
            )}

            {liveFollows.length > 0 && (
                <Section title='Подписки в эфире'>
                    <div className={STREAM_GRID}>
                        {liveFollows.map((channel) => (
                            <StreamCard key={channel.id} channel={channel} />
                        ))}
                    </div>
                </Section>
            )}

            {recommended.data === null && recommended.error === null && (
                <Section title='Рекомендуем'>
                    <SkeletonGrid />
                </Section>
            )}
            {channels.length > 0 && (
                <Section
                    title={
                        userId === null ? (
                            'Популярно сейчас'
                        ) : (
                            <>
                                Рекомендуем <span className='text-accent'>для вас</span>
                            </>
                        )
                    }
                >
                    <div className={STREAM_GRID}>
                        {channels.map((channel) => (
                            <StreamCard key={channel.id} channel={channel} />
                        ))}
                    </div>
                </Section>
            )}

            {categories.data !== null && categories.data.length > 0 && (
                <Section title='Категории' moreHref='/categories'>
                    <div className={CATEGORY_GRID}>
                        {categories.data.slice(0, HOME_CATEGORIES).map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
};
