'use client';

import { useMemo, useState } from 'react';
import { CATEGORY_GRID } from '@page-ui/Home/Home';
import { CategoryCard } from '@/components/stream/CategoryCard';
import { SearchIcon } from '@ui/Icons';
import { useFetch } from '@composables/useFetch';
import { BrowseService } from '@services/browse.service';
import { useAppSelector } from '@store/hooks';
import type { ReactNode } from 'react';

export const Categories = (): ReactNode => {
    const userId = useAppSelector((state) => state.user.user?.id ?? null);
    const isInitialized = useAppSelector((state) => state.user.isInitialized);
    const { data } = useFetch(isInitialized ? `categories:${userId ?? 'guest'}` : null, () =>
        BrowseService.categories(),
    );
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        return (data ?? []).filter(
            (category) => query.length === 0 || category.title.toLowerCase().includes(query),
        );
    }, [data, search]);

    return (
        <div className='mx-auto flex max-w-[1800px] flex-col gap-6 px-4 py-6 sm:px-6'>
            <div className='flex flex-wrap items-end justify-between gap-4'>
                <h1 className='text-3xl font-extrabold tracking-tight'>Категории</h1>
                <label className='flex w-full items-center gap-2 rounded-full border border-line bg-surface-2 px-4 focus-within:border-accent sm:w-72'>
                    <SearchIcon className='text-subtle' />
                    <input
                        value={search}
                        placeholder='Найти категорию'
                        className='h-10 w-full bg-transparent text-sm outline-none placeholder:text-subtle'
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </label>
            </div>

            <div className={CATEGORY_GRID}>
                {data === null
                    ? Array.from({ length: 12 }, (_, index) => (
                          <div
                              key={index}
                              className='aspect-[3/4] animate-pulse rounded-lg bg-surface'
                          />
                      ))
                    : filtered.map((category) => (
                          <CategoryCard key={category.id} category={category} />
                      ))}
            </div>
            {data !== null && filtered.length === 0 && (
                <p className='text-muted'>Ничего не нашлось.</p>
            )}
        </div>
    );
};
