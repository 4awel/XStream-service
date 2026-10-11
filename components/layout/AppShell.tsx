'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@layout/Header';
import { Sidebar } from '@layout/Sidebar';
import { SidebarProvider } from '@layout/SidebarContext';
import type { ReactNode } from 'react';

/** Страницы «во весь экран»: вход и онбординг — без сайдбара. */
const BARE_ROUTES = ['/login', '/onboarding'];

export const AppShell = ({ children }: { children: ReactNode }): ReactNode => {
    const pathname = usePathname();
    const isBare = BARE_ROUTES.some((route) => pathname.startsWith(route));

    return (
        <SidebarProvider>
            <Header showMenuButton={!isBare} />
            <div className='flex'>
                {!isBare && <Sidebar />}
                <main className='min-h-[calc(100vh-56px)] min-w-0 flex-1'>{children}</main>
            </div>
        </SidebarProvider>
    );
};
