'use client';

import { Card } from '@ui/Card';
import { CheckIcon } from '@ui/Icons';
import { useTheme } from '@composables/useTheme';
import type { Theme } from '@/lib/theme/theme';
import type { ReactNode } from 'react';

const THEMES: { value: Theme; title: string; preview: string; dark: boolean }[] = [
    { value: 'DARK', title: 'Тёмная', preview: '#0b0b0d', dark: true },
    { value: 'LIGHT', title: 'Светлая', preview: '#f4f4f6', dark: false },
];

export const AppearanceSection = (): ReactNode => {
    const { theme, setTheme } = useTheme();

    return (
        <Card
            title='Тема оформления'
            description='Сохраняется в аккаунте и одинакова на всех устройствах'
        >
            <div className='grid gap-4 sm:grid-cols-2'>
                {THEMES.map((option) => {
                    const isActive = option.value === theme;
                    return (
                        <button
                            key={option.value}
                            type='button'
                            aria-pressed={isActive}
                            onClick={() => setTheme(option.value)}
                            className={`overflow-hidden rounded-lg border-2 text-left transition-colors ${
                                isActive ? 'border-accent' : 'border-line hover:border-surface-3'
                            }`}
                        >
                            {/* Мини-превью интерфейса в цветах темы. */}
                            <div
                                className='flex h-28 gap-2 p-3'
                                style={{ background: option.preview }}
                            >
                                <div
                                    className='w-1/4 rounded-md'
                                    style={{ background: option.dark ? '#1b1b20' : '#ffffff' }}
                                />
                                <div className='flex flex-1 flex-col gap-2'>
                                    <div
                                        className='h-12 rounded-md'
                                        style={{ background: option.dark ? '#1b1b20' : '#ffffff' }}
                                    />
                                    <div className='h-3 w-1/2 rounded-full bg-accent' />
                                </div>
                            </div>
                            <div className='flex items-center justify-between bg-surface-2 px-4 py-3'>
                                <span className='font-semibold'>{option.title}</span>
                                {isActive && (
                                    <span className='flex size-6 items-center justify-center rounded-full bg-accent text-on-accent'>
                                        <CheckIcon className='size-4' />
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
};
