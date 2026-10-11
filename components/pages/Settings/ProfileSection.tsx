'use client';

import { useState } from 'react';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { Card } from '@ui/Card';
import { ImageUpload } from '@ui/ImageUpload';
import { Input } from '@ui/Input';
import { Notice } from '@ui/Notice';
import { Textarea } from '@ui/Textarea';
import { useSaveAction } from '@composables/useSaveAction';
import { UserService } from '@services/user.service';
import { useAppDispatch } from '@store/hooks';
import { userUpdated } from '@store/slices/user.slice';
import type { User } from '@models/user';
import type { FormEvent, ReactNode } from 'react';

const USERNAME_RE = /^[a-z0-9_]{3,24}$/;

export const ProfileSection = ({ user }: { user: User }): ReactNode => {
    const dispatch = useAppDispatch();
    const avatar = useSaveAction();
    const form = useSaveAction();

    const [displayName, setDisplayName] = useState(user.displayName);
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio ?? '');

    const normalizedUsername = username.trim().toLowerCase();
    const usernameError =
        normalizedUsername.length > 0 && !USERNAME_RE.test(normalizedUsername)
            ? '3–24 символа: латиница, цифры и _'
            : null;
    const isDirty =
        displayName.trim() !== user.displayName ||
        normalizedUsername !== user.username ||
        bio.trim() !== (user.bio ?? '');

    const save = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        void form.run(async () => {
            // Шлём только изменённое: так 409 «username занят» не прилетит на смену bio.
            const updated = await UserService.updateProfile({
                displayName:
                    displayName.trim() !== user.displayName ? displayName.trim() : undefined,
                username: normalizedUsername !== user.username ? normalizedUsername : undefined,
                bio: bio.trim() !== (user.bio ?? '') ? bio.trim() : undefined,
            });
            dispatch(userUpdated(updated));
        });
    };

    return (
        <div className='flex flex-col gap-6'>
            <Card title='Аватар' description='Квадратная картинка, мы обрежем её до 256×256'>
                <div className='flex items-center gap-5'>
                    <Avatar src={user.avatarUrl} name={user.displayName} size='xl' />
                    <div className='flex flex-col gap-3'>
                        <ImageUpload
                            hasImage={user.avatarUrl !== null}
                            isBusy={avatar.isSaving}
                            onUpload={(file) =>
                                void avatar.run(async () => {
                                    dispatch(userUpdated(await UserService.uploadAvatar(file)));
                                }, 'Аватар обновлён')
                            }
                            onRemove={() =>
                                void avatar.run(async () => {
                                    dispatch(userUpdated(await UserService.removeAvatar()));
                                }, 'Аватар удалён')
                            }
                            onError={(message) =>
                                void avatar.run(() => Promise.reject(new Error(message)))
                            }
                        />
                        <p className='text-xs text-subtle'>JPG, PNG, WEBP или GIF, до 5 МБ</p>
                    </div>
                </div>
                {avatar.error !== null && (
                    <div className='mt-4'>
                        <Notice tone='error'>{avatar.error}</Notice>
                    </div>
                )}
            </Card>

            <Card title='Профиль' description='Так вас видят в чате и на странице канала'>
                <form className='flex flex-col gap-4' onSubmit={save}>
                    <Input
                        id='displayName'
                        label='Отображаемое имя'
                        maxLength={32}
                        value={displayName}
                        onChange={setDisplayName}
                    />
                    <Input
                        id='username'
                        label='Имя пользователя'
                        hint={`Адрес канала: /${normalizedUsername.length > 0 ? normalizedUsername : 'username'}`}
                        maxLength={24}
                        autoComplete='off'
                        error={usernameError}
                        value={username}
                        onChange={setUsername}
                    />
                    <Textarea
                        id='bio'
                        label='О себе'
                        placeholder='Пара слов о себе и о том, что вы стримите'
                        maxLength={300}
                        value={bio}
                        onChange={setBio}
                    />
                    {form.error !== null && <Notice tone='error'>{form.error}</Notice>}
                    {form.success !== null && !isDirty && (
                        <Notice tone='success'>{form.success}</Notice>
                    )}
                    <div className='flex justify-end'>
                        <Button
                            type='submit'
                            isLoading={form.isSaving}
                            disabled={
                                !isDirty ||
                                usernameError !== null ||
                                displayName.trim().length === 0
                            }
                        >
                            Сохранить
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
