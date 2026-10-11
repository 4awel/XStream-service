import { Login } from '@page-ui/Login/Login';
import type { ReactNode } from 'react';

interface LoginPageProps {
    searchParams: Promise<{ mode?: string }>;
}

/** /login и /login?mode=register — одна страница с вкладками. */
const LoginPage = async ({ searchParams }: LoginPageProps): Promise<ReactNode> => {
    const { mode } = await searchParams;
    const initialMode = mode === 'register' ? 'register' : 'login';
    // key: переход /login → /login?mode=register должен переключить вкладку.
    return <Login key={initialMode} initialMode={initialMode} />;
};

export default LoginPage;
