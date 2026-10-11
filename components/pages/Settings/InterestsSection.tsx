'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Spinner } from '@ui/Button';
import { Card } from '@ui/Card';
import { UserService } from '@services/user.service';
import type { Tag } from '@models/tag';
import type { ReactNode } from 'react';

export const InterestsSection = (): ReactNode => {
    const [interests, setInterests] = useState<Tag[] | null>(null);

    useEffect(() => {
        UserService.getInterests()
            .then(setInterests)
            .catch(() => setInterests([]));
    }, []);

    return (
        <Card
            title='Интересы'
            description='По ним подбираются рекомендации на главной'
            actions={
                <Link
                    href='/onboarding?edit=1'
                    className='flex h-8 items-center rounded-full bg-surface-2 px-3 text-sm font-semibold hover:bg-surface-3'
                >
                    Изменить
                </Link>
            }
        >
            {interests === null ? (
                <Spinner className='text-muted' />
            ) : interests.length === 0 ? (
                <p className='text-sm text-muted'>
                    Интересы не выбраны — рекомендации будут общими.
                </p>
            ) : (
                <div className='flex flex-wrap gap-2'>
                    {interests.map((tag) => (
                        <span
                            key={tag.id}
                            className='rounded-full bg-accent-soft px-3 py-1.5 text-sm font-medium'
                        >
                            {tag.title}
                        </span>
                    ))}
                </div>
            )}
        </Card>
    );
};
