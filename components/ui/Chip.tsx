import { CheckIcon } from '@ui/Icons';
import type { ReactNode } from 'react';

interface ChipProps {
    label: string;
    isSelected: boolean;
    onToggle: () => void;
}

/** Переключаемый тег: онбординг, фильтры. */
export const Chip = ({ label, isSelected, onToggle }: ChipProps): ReactNode => (
    <button
        type='button'
        aria-pressed={isSelected}
        onClick={onToggle}
        className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors ${
            isSelected
                ? 'border-accent bg-accent-soft text-fg'
                : 'border-line bg-surface-2 text-muted hover:border-surface-3 hover:text-fg'
        }`}
    >
        {isSelected && <CheckIcon className='size-4 text-accent' />}
        {label}
    </button>
);
