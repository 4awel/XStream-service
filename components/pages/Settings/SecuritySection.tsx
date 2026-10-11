'use client';

import { useState } from 'react';
import { Button } from '@ui/Button';
import { Card } from '@ui/Card';
import { Input } from '@ui/Input';
import { Notice } from '@ui/Notice';
import { useSaveAction } from '@composables/useSaveAction';
import { UserService } from '@services/user.service';
import type { FormEvent, ReactNode } from 'react';

const PASSWORD_RE = /(?=.*\p{L})(?=.*\d)/u;

export const SecuritySection = ({ email }: { email: string }): ReactNode => {
    const { isSaving, error, success, run } = useSaveAction();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const newError =
        newPassword.length > 0 && (newPassword.length < 8 || !PASSWORD_RE.test(newPassword))
            ? 'Минимум 8 символов, хотя бы одна буква и одна цифра'
            : null;
    const confirmError =
        confirm.length > 0 && confirm !== newPassword ? 'Пароли не совпадают' : null;
    const canSubmit =
        oldPassword.length > 0 &&
        newPassword.length > 0 &&
        newError === null &&
        confirm === newPassword;

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        void run(async () => {
            await UserService.changePassword({ oldPassword, newPassword });
            setOldPassword('');
            setNewPassword('');
            setConfirm('');
        }, 'Пароль изменён');
    };

    return (
        <div className='flex flex-col gap-6'>
            <Card title='Почта' description='Используется для входа и восстановления доступа'>
                <p className='rounded-md bg-surface-2 px-3.5 py-2.5 text-sm'>{email}</p>
            </Card>

            <Card title='Пароль'>
                <form className='flex flex-col gap-4' onSubmit={submit}>
                    {/* username-поле для менеджеров паролей: так они понимают, к какому аккаунту пароль. */}
                    <input type='email' value={email} autoComplete='username' readOnly hidden />
                    <Input
                        id='oldPassword'
                        type='password'
                        label='Текущий пароль'
                        autoComplete='current-password'
                        value={oldPassword}
                        onChange={setOldPassword}
                    />
                    <Input
                        id='newPassword'
                        type='password'
                        label='Новый пароль'
                        autoComplete='new-password'
                        error={newError}
                        value={newPassword}
                        onChange={setNewPassword}
                    />
                    <Input
                        id='confirmPassword'
                        type='password'
                        label='Повторите новый пароль'
                        autoComplete='new-password'
                        error={confirmError}
                        value={confirm}
                        onChange={setConfirm}
                    />
                    {error !== null && <Notice tone='error'>{error}</Notice>}
                    {success !== null && <Notice tone='success'>{success}</Notice>}
                    <div className='flex justify-end'>
                        <Button type='submit' isLoading={isSaving} disabled={!canSubmit}>
                            Сменить пароль
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
