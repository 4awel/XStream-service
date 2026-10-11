'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface SidebarState {
    /** Десктоп: узкий режим с одними аватарами. Запоминается. */
    isCollapsed: boolean;
    toggleCollapsed: () => void;
    /** Мобильный: выезжающая панель поверх контента. */
    isMobileOpen: boolean;
    setMobileOpen: (isOpen: boolean) => void;
}

const SidebarContext = createContext<SidebarState | null>(null);
const STORAGE_KEY = 'sidebar-collapsed';

export const SidebarProvider = ({ children }: { children: ReactNode }): ReactNode => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setMobileOpen] = useState(false);

    // Читаем после монтирования: на сервере localStorage нет, иначе разъедется гидрация.
    useEffect(() => {
        try {
            if (localStorage.getItem(STORAGE_KEY) === '1') {
                const timer = setTimeout(() => setIsCollapsed(true), 0);
                return () => clearTimeout(timer);
            }
        } catch {
            // хранилище недоступно — остаёмся в развёрнутом виде
        }
        return undefined;
    }, []);

    const value = useMemo<SidebarState>(
        () => ({
            isCollapsed,
            toggleCollapsed: () =>
                setIsCollapsed((current) => {
                    try {
                        localStorage.setItem(STORAGE_KEY, current ? '0' : '1');
                    } catch {
                        // не запомнится — не страшно
                    }
                    return !current;
                }),
            isMobileOpen,
            setMobileOpen,
        }),
        [isCollapsed, isMobileOpen],
    );

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebar = (): SidebarState => {
    const context = useContext(SidebarContext);
    if (context === null) {
        throw new Error('useSidebar: нет SidebarProvider выше по дереву');
    }
    return context;
};
