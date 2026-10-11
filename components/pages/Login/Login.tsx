'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Button } from '@ui/Button';
import { ArrowLeftIcon, LiveIcon } from '@ui/Icons';
import { Input } from '@ui/Input';
import { Notice } from '@ui/Notice';
import { useLogin } from '@composables/useLogin';
import { useAppSelector } from '@store/hooks';
import type { AuthMode } from '@composables/useLogin';
import type { ReactNode } from 'react';

interface LoginProps {
    initialMode: AuthMode;
}

const Shell = ({ children }: { children: ReactNode }): ReactNode => (
    <div className='flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-10'>
        <div className='w-full max-w-md rounded-xl border border-line bg-surface p-8 shadow-2xl shadow-black/30'>
            <div className='mb-6 flex justify-center'>
                <span className='flex size-12 items-center justify-center rounded-lg bg-accent text-on-accent'>
                    <LiveIcon className='size-7' />
                </span>
            </div>
            {children}
        </div>
    </div>
);

export const Login = ({ initialMode }: LoginProps): ReactNode => {
    const router = useRouter();
    const auth = useLogin(initialMode);
    const { user, isInitialized } = useAppSelector((state) => state.user);
    const isRegister = auth.mode === 'register';

    const checkedOnArrival = useRef(false);

    // Единственное место навигации. После входа/регистрации — куда сказал хук.
    // «Уже внутри → на главную» проверяем один раз при открытии страницы: иначе
    // эта ветка сработает и в момент успешного входа и перебьёт /onboarding.
    useEffect(() => {
        if (auth.redirectTo !== null) {
            router.replace(auth.redirectTo);
            return;
        }
        if (isInitialized && !checkedOnArrival.current) {
            checkedOnArrival.current = true;
            if (user !== null) {
                router.replace('/');
            }
        }
    }, [auth.redirectTo, isInitialized, user, router]);

    if (auth.step === 'verify') {
        return (
            <Shell>
                <form
                    className='flex flex-col gap-5'
                    onSubmit={(event) => void auth.submitCode(event)}
                >
                    <div className='text-center'>
                        <h1 className='text-2xl font-bold'>Проверьте почту</h1>
                        <p className='mt-2 text-sm text-muted'>
                            Мы отправили 6-значный код на{' '}
                            <span className='font-medium text-fg'>{auth.pendingEmail}</span>
                        </p>
                    </div>

                    <Input
                        id='code'
                        placeholder='000000'
                        inputMode='numeric'
                        maxLength={6}
                        autoComplete='one-time-code'
                        autoFocus
                        className='text-center text-2xl font-semibold tracking-[0.5em]'
                        value={auth.code}
                        onChange={(value) => auth.setCode(value.replace(/\D/g, ''))}
                    />

                    {auth.error !== null && <Notice tone='error'>{auth.error}</Notice>}

                    <Button
                        type='submit'
                        size='lg'
                        isLoading={auth.isLoading}
                        disabled={auth.code.length !== 6}
                    >
                        Подтвердить
                    </Button>
                    <Button variant='ghost' onClick={auth.backToCredentials}>
                        <ArrowLeftIcon className='size-4' />
                        Изменить почту
                    </Button>
                </form>
            </Shell>
        );
    }

    return (
        <Shell>
            <h1 className='text-center text-2xl font-bold'>
                {isRegister ? 'Создать аккаунт' : 'С возвращением'}
            </h1>
            <p className='mt-2 mb-6 text-center text-sm text-muted'>
                {isRegister
                    ? 'Смотрите стримы, общайтесь и начните вещать сами'
                    : 'Войдите, чтобы писать в чат и следить за каналами'}
            </p>

            <div className='mb-6 grid grid-cols-2 gap-1 rounded-full bg-surface-2 p-1'>
                {(['login', 'register'] as const).map((mode) => (
                    <button
                        key={mode}
                        type='button'
                        onClick={() => auth.setMode(mode)}
                        className={`h-9 rounded-full text-sm font-semibold transition-colors ${
                            auth.mode === mode ? 'bg-surface-3 text-fg' : 'text-muted hover:text-fg'
                        }`}
                    >
                        {mode === 'login' ? 'Вход' : 'Регистрация'}
                    </button>
                ))}
            </div>

            <form
                className='flex flex-col gap-4'
                onSubmit={(event) => void auth.submitCredentials(event)}
            >
                <Input
                    id='email'
                    type='email'
                    label='Почта'
                    placeholder='you@mail.com'
                    autoComplete='email'
                    required
                    value={auth.email}
                    onChange={auth.setEmail}
                />
                <Input
                    id='password'
                    type='password'
                    label='Пароль'
                    placeholder={isRegister ? 'Минимум 8 символов' : 'Ваш пароль'}
                    hint={isRegister ? 'Хотя бы одна буква и одна цифра' : undefined}
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    required
                    minLength={isRegister ? 8 : undefined}
                    value={auth.password}
                    onChange={auth.setPassword}
                />

                {auth.error !== null && <Notice tone='error'>{auth.error}</Notice>}

                <Button type='submit' size='lg' isLoading={auth.isLoading} className='mt-2'>
                    {isRegister ? 'Получить код' : 'Войти'}
                </Button>
            </form>

            <p className='mt-6 text-center text-xs text-subtle'>
                <Link href='/' className='hover:text-fg'>
                    Вернуться на главную
                </Link>
            </p>
        </Shell>
    );
};
