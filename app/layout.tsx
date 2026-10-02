import { Footer } from '@layout/Footer';
import { Header } from '@layout/Header';
import { Main } from '@layout/Main';
import { Providers } from '@/app/providers';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
    title: 'Stream Service',
    description: 'Stream Service',
};

interface RootLayoutProps {
    children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps): ReactNode => {
    return (
        <html lang='ru'>
            <body className='flex min-h-screen flex-col'>
                <Providers>
                    <Header />
                    <Main>{children}</Main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
};

export default RootLayout;
