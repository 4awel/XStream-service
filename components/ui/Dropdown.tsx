'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface DropdownProps {
    /** Кнопка-триггер; получает текущее состояние, чтобы повернуть стрелку и т.п. */
    trigger: (isOpen: boolean) => ReactNode;
    /** Содержимое; close — закрыть после выбора пункта. */
    children: (close: () => void) => ReactNode;
}

/** Меню по клику: закрывается по клику снаружи и по Escape. */
export const Dropdown = ({ trigger, children }: DropdownProps): ReactNode => {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }
        const onPointer = (event: PointerEvent): void => {
            if (rootRef.current?.contains(event.target as Node) !== true) {
                setIsOpen(false);
            }
        };
        const onKey = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };
        document.addEventListener('pointerdown', onPointer);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('pointerdown', onPointer);
            document.removeEventListener('keydown', onKey);
        };
    }, [isOpen]);

    return (
        <div ref={rootRef} className='relative'>
            <button
                type='button'
                aria-haspopup='menu'
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center rounded-md'
            >
                {trigger(isOpen)}
            </button>
            {isOpen && (
                <div
                    role='menu'
                    className='absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-lg border border-line bg-surface py-1.5 shadow-2xl shadow-black/40'
                >
                    {children(() => setIsOpen(false))}
                </div>
            )}
        </div>
    );
};

interface MenuItemProps {
    icon?: ReactNode;
    onClick: () => void;
    children: ReactNode;
    tone?: 'default' | 'danger';
}

export const MenuItem = ({
    icon,
    onClick,
    children,
    tone = 'default',
}: MenuItemProps): ReactNode => (
    <button
        type='button'
        role='menuitem'
        onClick={onClick}
        className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-surface-2 ${
            tone === 'danger' ? 'text-accent' : 'text-fg'
        }`}
    >
        <span className='text-muted'>{icon}</span>
        {children}
    </button>
);
