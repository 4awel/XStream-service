'use client';

import { Button } from '@ui/Button';
import { Input } from '@ui/Input';
import { useLogin } from '@composables/useLogin';
import type { ReactNode } from 'react';

const formClass = 'mx-auto flex w-full max-w-md flex-col gap-5 rounded-main bg-gray-dark p-8';

export const Login = (): ReactNode => {
    const auth = useLogin();

    if (auth.step === 'verify') {
        return (
            <form className={formClass} onSubmit={(event) => void auth.submitCode(event)}>
                <h1 className='text-2xl font-bold'>Подтверждение почты</h1>
                <p className='text-gray-light'>
                    Код отправлен на <span className='text-white'>{auth.pendingEmail}</span>
                </p>

                <Input
                    id='code'
                    label='Код из письма'
                    placeholder='123456'
                    inputMode='numeric'
                    maxLength={6}
                    autoComplete='one-time-code'
                    value={auth.code}
                    error={auth.error}
                    onChange={auth.setCode}
                />

                <Button type='submit' isLoading={auth.isLoading}>
                    Подтвердить
                </Button>
                <Button variant='ghost' onClick={auth.backToCredentials}>
                    Назад
                </Button>
            </form>
        );
    }

    const isRegister = auth.mode === 'register';

    return (
        <form className={formClass} onSubmit={(event) => void auth.submitCredentials(event)}>
            <div className='flex gap-2 rounded-main bg-black p-1'>
                <Button
                    variant={isRegister ? 'ghost' : 'primary'}
                    className='flex-1'
                    onClick={() => auth.setMode('login')}
                >
                    Вход
                </Button>
                <Button
                    variant={isRegister ? 'primary' : 'ghost'}
                    className='flex-1'
                    onClick={() => auth.setMode('register')}
                >
                    Регистрация
                </Button>
            </div>

            <Input
                id='email'
                type='email'
                label='Почта'
                placeholder='you@mail.com'
                autoComplete='email'
                value={auth.email}
                onChange={auth.setEmail}
            />
            <Input
                id='password'
                type='password'
                label='Пароль'
                placeholder='минимум 8 символов, буква и цифра'
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={auth.password}
                error={auth.error}
                onChange={auth.setPassword}
            />

            <Button type='submit' isLoading={auth.isLoading}>
                {isRegister ? 'Получить код' : 'Войти'}
            </Button>
        </form>
    );
};
