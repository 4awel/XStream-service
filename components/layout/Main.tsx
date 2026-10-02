import type { ReactNode } from 'react';

interface MainProps {
    children: ReactNode;
}

export const Main = ({ children }: MainProps): ReactNode => {
    return <main className='mx-auto w-full max-w-6xl flex-1 px-6 py-8'>{children}</main>;
};
