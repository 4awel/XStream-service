import Link from 'next/link';
import { formatCount, plural } from '@/lib/format/format';
import type { CategoryStats, TagGroup } from '@models/tag';
import type { ReactNode } from 'react';

/** Свой градиент на каждую группу: обложек категорий нет, а одинаковые плитки сливаются. */
const GROUP_GRADIENT: Record<TagGroup, string> = {
    GAME: 'linear-gradient(135deg, #e11d2e 0%, #4a0a12 100%)',
    TALK: 'linear-gradient(135deg, #f97316 0%, #4a1d06 100%)',
    IRL: 'linear-gradient(135deg, #eab308 0%, #3f3005 100%)',
    MUSIC: 'linear-gradient(135deg, #a855f7 0%, #2a0d45 100%)',
    CREATIVE: 'linear-gradient(135deg, #ec4899 0%, #470b26 100%)',
    EDUCATION: 'linear-gradient(135deg, #3b82f6 0%, #0b1f45 100%)',
    ESPORTS: 'linear-gradient(135deg, #ef4444 0%, #1f0a0a 100%)',
    SPORTS: 'linear-gradient(135deg, #22c55e 0%, #072e16 100%)',
    OTHER: 'linear-gradient(135deg, #64748b 0%, #111827 100%)',
};

export const CategoryCard = ({ category }: { category: CategoryStats }): ReactNode => (
    <Link href={`/category/${category.slug}`} className='group flex flex-col gap-2'>
        <div
            className='relative flex aspect-[3/4] items-end overflow-hidden rounded-lg p-3 ring-accent transition-all group-hover:-translate-y-1 group-hover:ring-2'
            style={{ background: GROUP_GRADIENT[category.group ?? 'OTHER'] }}
        >
            <span className='text-lg leading-tight font-extrabold text-[#fff] drop-shadow'>
                {category.title}
            </span>
            {category.isInterest && (
                <span className='absolute top-2 right-2 rounded-full bg-overlay px-2 py-0.5 text-[11px] font-semibold text-[#fff]'>
                    Ваше
                </span>
            )}
        </div>
        <div>
            <p className='truncate text-sm font-semibold group-hover:text-accent'>
                {category.title}
            </p>
            <p className='text-xs text-muted'>
                {category.liveChannels > 0
                    ? `${formatCount(category.liveViewers)} ${plural(category.liveViewers, ['зритель', 'зрителя', 'зрителей'])}`
                    : 'Нет эфиров'}
            </p>
        </div>
    </Link>
);
