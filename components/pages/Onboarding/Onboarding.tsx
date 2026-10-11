'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Button, Spinner } from '@ui/Button';
import { Chip } from '@ui/Chip';
import { SearchIcon } from '@ui/Icons';
import { Notice } from '@ui/Notice';
import { ONBOARDING_STEPS, useOnboarding } from '@composables/useOnboarding';
import { useRequireAuth } from '@composables/useRequireAuth';
import type { Tag, TagGroup } from '@models/tag';
import type { ReactNode } from 'react';

const GROUP_TITLES: Record<TagGroup, string> = {
    GAME: 'Игры',
    TALK: 'Общение',
    IRL: 'IRL',
    MUSIC: 'Музыка',
    CREATIVE: 'Творчество',
    EDUCATION: 'Обучение',
    ESPORTS: 'Киберспорт',
    SPORTS: 'Спорт',
    OTHER: 'Другое',
};

interface OnboardingProps {
    /** Повторное прохождение из настроек: не выгонять уже прошедших и вернуть обратно. */
    isEditing: boolean;
}

/** Группирует категории по разделам, сохраняя порядок GROUP_TITLES. */
const groupTags = (tags: Tag[]): [string, Tag[]][] => {
    const groups = new Map<string, Tag[]>();
    for (const tag of tags) {
        const title = tag.group === null ? 'Разное' : GROUP_TITLES[tag.group];
        groups.set(title, [...(groups.get(title) ?? []), tag]);
    }
    const order = Object.values(GROUP_TITLES);
    return [...groups.entries()].sort(([a], [b]) => order.indexOf(a) - order.indexOf(b));
};

export const Onboarding = ({ isEditing }: OnboardingProps): ReactNode => {
    const router = useRouter();
    const user = useRequireAuth();
    const { tags, isLoading, isSaving, error, selected, toggle, finish } = useOnboarding();
    const [stepIndex, setStepIndex] = useState(0);
    const [search, setSearch] = useState('');

    const step = ONBOARDING_STEPS[stepIndex] ?? ONBOARDING_STEPS[0];
    const isLast = stepIndex === ONBOARDING_STEPS.length - 1;
    const exitTo = isEditing ? '/settings' : '/';

    // Уже прошёл и пришёл не из настроек — показывать нечего.
    useEffect(() => {
        if (user !== null && user.onboardingCompleted && !isEditing && !isSaving) {
            router.replace('/');
        }
    }, [user, isEditing, isSaving, router]);

    const stepTags = useMemo(() => {
        const query = search.trim().toLowerCase();
        return tags.filter(
            (tag) =>
                step.kinds.includes(tag.kind) &&
                (query.length === 0 || tag.title.toLowerCase().includes(query)),
        );
    }, [tags, step, search]);

    const complete = async (): Promise<void> => {
        if (await finish()) {
            router.replace(exitTo);
        }
    };

    const next = (): void => {
        if (isLast) {
            void complete();
            return;
        }
        setSearch('');
        setStepIndex(stepIndex + 1);
    };

    if (user === null || isLoading) {
        return (
            <div className='flex min-h-[60vh] items-center justify-center text-muted'>
                <Spinner className='size-6' />
            </div>
        );
    }

    const progress = ((stepIndex + 1) / ONBOARDING_STEPS.length) * 100;
    const isCategoryStep = step.kinds.includes('CATEGORY');

    return (
        <div className='pb-32'>
            <div className='mx-auto max-w-3xl px-4 pt-10'>
                <p className='text-sm font-semibold text-accent'>
                    Шаг {stepIndex + 1} из {ONBOARDING_STEPS.length}
                </p>
                <h1 className='mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl'>
                    {step.title}
                </h1>
                <p className='mt-3 text-muted'>{step.subtitle}</p>

                {step.hasSearch && (
                    <label className='mt-6 flex items-center gap-2 rounded-full border border-line bg-surface-2 px-4 focus-within:border-accent'>
                        <SearchIcon className='text-subtle' />
                        <input
                            value={search}
                            placeholder='Найти игру или категорию'
                            className='h-11 w-full bg-transparent text-sm outline-none placeholder:text-subtle'
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </label>
                )}

                {error !== null && (
                    <div className='mt-6'>
                        <Notice tone='error'>{error}</Notice>
                    </div>
                )}

                <div className='mt-8 flex flex-col gap-8'>
                    {stepTags.length === 0 && (
                        <p className='text-muted'>Ничего не нашлось — попробуйте другой запрос.</p>
                    )}
                    {isCategoryStep ? (
                        groupTags(stepTags).map(([groupTitle, tagsInGroup]) => (
                            <section key={groupTitle}>
                                <h2 className='mb-3 text-sm font-semibold tracking-wide text-subtle uppercase'>
                                    {groupTitle}
                                </h2>
                                <div className='flex flex-wrap gap-2'>
                                    {tagsInGroup.map((tag) => (
                                        <Chip
                                            key={tag.id}
                                            label={tag.title}
                                            isSelected={selected.has(tag.id)}
                                            onToggle={() => toggle(tag.id)}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className='flex flex-wrap gap-2'>
                            {stepTags.map((tag) => (
                                <Chip
                                    key={tag.id}
                                    label={tag.title}
                                    isSelected={selected.has(tag.id)}
                                    onToggle={() => toggle(tag.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Нижняя панель: красный прогресс + навигация по шагам. */}
            <div className='fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur'>
                <div className='h-1 w-full bg-surface-3'>
                    <div
                        className='h-full rounded-r-full bg-accent transition-[width] duration-500 ease-out'
                        style={{ width: `${progress}%` }}
                        role='progressbar'
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(progress)}
                    />
                </div>
                <div className='mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4'>
                    <Button
                        variant='ghost'
                        disabled={stepIndex === 0 || isSaving}
                        onClick={() => setStepIndex(stepIndex - 1)}
                    >
                        Назад
                    </Button>
                    <span className='hidden text-sm text-muted sm:block'>
                        Выбрано: <span className='font-semibold text-fg'>{selected.size}</span>
                    </span>
                    <div className='flex items-center gap-2'>
                        <Button
                            variant='secondary'
                            disabled={isSaving}
                            onClick={() => void complete()}
                        >
                            Пропустить
                        </Button>
                        <Button isLoading={isSaving} onClick={next}>
                            {isLast ? 'Готово' : 'Далее'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
