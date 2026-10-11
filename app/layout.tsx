import { AppShell } from '@layout/AppShell';
import { Providers } from '@/app/providers';
import { THEME_BOOT_SCRIPT } from '@/lib/theme/theme';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
    title: 'XStream',
    description: 'Стримы, чат и сообщество',
};

interface RootLayoutProps {
    children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps): ReactNode => {
    return (
        // suppressHydrationWarning: data-theme меняет inline-скрипт до гидрации.
        <html lang='ru' data-theme='dark' suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
            </head>
            <body className='min-h-screen'>
                <Providers>
                    <AppShell>{children}</AppShell>
                </Providers>
            </body>
        </html>
    );
};

export default RootLayout;
