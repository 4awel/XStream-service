'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { loginUser, registerUser, resetAuthStep, verifyEmail } from '@store/slices/user.slice';
import type { FormEvent } from 'react';

export type AuthMode = 'login' | 'register';

interface UseLogin {
    mode: AuthMode;
    setMode: (mode: AuthMode) => void;
    step: 'credentials' | 'verify';
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    code: string;
    setCode: (value: string) => void;
    pendingEmail: string | null;
    isLoading: boolean;
    error: string | null;
    submitCredentials: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    submitCode: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    backToCredentials: () => void;
    /** Куда уйти после успеха; null — остаёмся. Навигацию делает страница. */
    redirectTo: string | null;
}

/** Регистрация: email+пароль → код на почту → /auth/verify → сессия → онбординг. */
export const useLogin = (initialMode: AuthMode): UseLogin => {
    const dispatch = useAppDispatch();
    const { authStep, pendingEmail, isLoading, error } = useAppSelector((state) => state.user);
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [redirectTo, setRedirectTo] = useState<string | null>(null);

    const submitCredentials = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        const credentials = { email: email.trim(), password };

        if (mode === 'register') {
            await dispatch(registerUser(credentials));
            return;
        }

        const result = await dispatch(loginUser(credentials));
        if (loginUser.fulfilled.match(result)) {
            setRedirectTo('/');
        }
    };

    const submitCode = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (pendingEmail === null) {
            return;
        }
        const result = await dispatch(verifyEmail({ email: pendingEmail, code: code.trim() }));
        if (verifyEmail.fulfilled.match(result)) {
            // Новый аккаунт — сразу на выбор интересов.
            setRedirectTo('/onboarding');
        }
    };

    const backToCredentials = (): void => {
        setCode('');
        dispatch(resetAuthStep());
    };

    return {
        mode,
        setMode,
        step: authStep,
        email,
        setEmail,
        password,
        setPassword,
        code,
        setCode,
        pendingEmail,
        isLoading,
        error,
        submitCredentials,
        submitCode,
        backToCredentials,
        redirectTo,
    };
};
