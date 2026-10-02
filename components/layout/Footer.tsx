import type { ReactNode } from 'react';

export const Footer = (): ReactNode => {
    return (
        <footer className='border-t border-gray-dark'>
            <div className='mx-auto max-w-6xl px-6 py-4 text-sm text-gray'>
                © {new Date().getFullYear()} Stream Service
            </div>
        </footer>
    );
};
