'use client';

import { useEffect, useMemo, useState } from 'react';
import { TagService } from '@services/tag.service';
import { UserService } from '@services/user.service';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { userUpdated } from '@store/slices/user.slice';
import { getErrorMessage } from '@store/utils';
import type { Tag, TagKind } from '@models/tag';

export interface OnboardingStep {
    title: string;
    subtitle: string;
    kinds: TagKind[];
    /** Поиск нужен только там, где тегов много. */
    hasSearch: boolean;
}

/** Кортеж «хотя бы один шаг»: ONBOARDING_STEPS[0] гарантированно есть. */
export const ONBOARDING_STEPS: [OnboardingStep, ...OnboardingStep[]] = [
    {
        title: 'Что вы любите смотреть?',
        subtitle: 'Выберите игры и категории — по ним соберём рекомендации на главной',
        kinds: ['CATEGORY'],
        hasSearch: true,
    },
    {
        title: 'Какой формат вам ближе?',
        subtitle: 'Спокойный вечер с чатом или хардкорные катки — подскажите настроение',
        kinds: ['FORMAT', 'GAME_MODE', 'MOOD'],
        hasSearch: false,
    },
    {
        title: 'На каком языке смотреть?',
        subtitle: 'Покажем стримы на понятном вам языке',
        kinds: ['LANGUAGE'],
        hasSearch: false,
    },
];

interface UseOnboarding {
    tags: Tag[];
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    selected: Set<string>;
    toggle: (tagId: string) => void;
    /** Сохраняет выбор и закрывает онбординг; true — успешно. */
    finish: () => Promise<boolean>;
}

export const useOnboarding = (): UseOnboarding => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;
        const kinds = ONBOARDING_STEPS.flatMap((step) => step.kinds);

        // Справочник и текущие интересы параллельно: при повторном прохождении
        // уже выбранное должно быть отмечено.
        Promise.all([TagService.list(kinds), UserService.getInterests()])
            .then(([allTags, interests]) => {
                if (isCancelled) {
                    return;
                }
                setTags(allTags);
                setSelectedIds(interests.map((tag) => tag.id));
            })
            .catch((caught: unknown) => {
                if (!isCancelled) {
                    setError(getErrorMessage(caught));
                }
            })
            .finally(() => {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            isCancelled = true;
        };
    }, []);

    const selected = useMemo(() => new Set(selectedIds), [selectedIds]);

    const toggle = (tagId: string): void => {
        setSelectedIds((current) =>
            current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId],
        );
    };

    const finish = async (): Promise<boolean> => {
        setIsSaving(true);
        setError(null);
        try {
            await UserService.saveInterests(selectedIds);
            if (user !== null) {
                dispatch(userUpdated({ ...user, onboardingCompleted: true }));
            }
            return true;
        } catch (caught) {
            setError(getErrorMessage(caught));
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return { tags, isLoading, isSaving, error, selected, toggle, finish };
};
