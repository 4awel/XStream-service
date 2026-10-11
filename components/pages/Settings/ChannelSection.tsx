'use client';

import { useEffect, useState } from 'react';
import { Button } from '@ui/Button';
import { Card } from '@ui/Card';
import { ImageUpload } from '@ui/ImageUpload';
import { Input } from '@ui/Input';
import { Notice } from '@ui/Notice';
import { Select } from '@ui/Select';
import { Textarea } from '@ui/Textarea';
import { useSaveAction } from '@composables/useSaveAction';
import { ChannelService } from '@services/channel.service';
import { TagService } from '@services/tag.service';
import { useAppDispatch } from '@store/hooks';
import { channelUpdated } from '@store/slices/user.slice';
import type { SelectOption } from '@ui/Select';
import type { User } from '@models/user';
import type { FormEvent, ReactNode } from 'react';

export const ChannelSection = ({ user }: { user: User }): ReactNode => {
    const dispatch = useAppDispatch();
    const banner = useSaveAction();
    const form = useSaveAction();
    const { channel } = user;

    const [title, setTitle] = useState(channel.streamTitle ?? '');
    const [description, setDescription] = useState(channel.streamDescription ?? '');
    const [categoryId, setCategoryId] = useState(channel.primaryCategoryId ?? '');
    const [categories, setCategories] = useState<SelectOption[]>([]);

    useEffect(() => {
        TagService.list(['CATEGORY'])
            .then((tags) =>
                setCategories(
                    [...tags]
                        .sort((a, b) => a.title.localeCompare(b.title, 'ru'))
                        .map((tag) => ({ value: tag.id, label: tag.title })),
                ),
            )
            .catch(() => setCategories([]));
    }, []);

    const isDirty =
        title.trim() !== (channel.streamTitle ?? '') ||
        description.trim() !== (channel.streamDescription ?? '') ||
        categoryId !== (channel.primaryCategoryId ?? '');

    const save = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        void form.run(async () => {
            const updated = await ChannelService.update({
                streamTitle: title.trim(),
                streamDescription: description.trim(),
                primaryCategoryId: categoryId,
            });
            dispatch(channelUpdated(updated));
        });
    };

    return (
        <div className='flex flex-col gap-6'>
            <Card
                title='Шапка канала'
                description='Широкая картинка над страницей канала, 1600×400'
            >
                <div className='relative mb-4 aspect-[4/1] overflow-hidden rounded-lg bg-surface-2'>
                    {channel.bannerUrl !== null ? (
                        // eslint-disable-next-line @next/next/no-img-element -- файл из MinIO
                        <img
                            src={channel.bannerUrl}
                            alt='Шапка канала'
                            className='h-full w-full object-cover'
                        />
                    ) : (
                        <div className='flex h-full items-center justify-center bg-gradient-to-r from-accent-soft via-surface-2 to-surface-3 text-sm text-subtle'>
                            Шапка не загружена
                        </div>
                    )}
                </div>
                <ImageUpload
                    hasImage={channel.bannerUrl !== null}
                    isBusy={banner.isSaving}
                    onUpload={(file) =>
                        void banner.run(async () => {
                            dispatch(channelUpdated(await ChannelService.uploadBanner(file)));
                        }, 'Шапка обновлена')
                    }
                    onRemove={() =>
                        void banner.run(async () => {
                            dispatch(channelUpdated(await ChannelService.removeBanner()));
                        }, 'Шапка удалена')
                    }
                    onError={(message) => void banner.run(() => Promise.reject(new Error(message)))}
                />
                {banner.error !== null && (
                    <div className='mt-4'>
                        <Notice tone='error'>{banner.error}</Notice>
                    </div>
                )}
            </Card>

            <Card
                title='Информация о стриме'
                description='Видна зрителям на странице канала и в каталоге'
            >
                <form className='flex flex-col gap-4' onSubmit={save}>
                    <Input
                        id='streamTitle'
                        label='Название стрима'
                        placeholder='Например: Апаю ранг в CS2'
                        maxLength={140}
                        value={title}
                        onChange={setTitle}
                    />
                    <Select
                        id='category'
                        label='Категория'
                        value={categoryId}
                        options={[{ value: '', label: 'Без категории' }, ...categories]}
                        onChange={setCategoryId}
                    />
                    <Textarea
                        id='streamDescription'
                        label='Описание канала'
                        placeholder='Расписание, правила чата, ссылки'
                        maxLength={1000}
                        value={description}
                        onChange={setDescription}
                    />
                    {form.error !== null && <Notice tone='error'>{form.error}</Notice>}
                    {form.success !== null && !isDirty && (
                        <Notice tone='success'>{form.success}</Notice>
                    )}
                    <div className='flex justify-end'>
                        <Button type='submit' isLoading={form.isSaving} disabled={!isDirty}>
                            Сохранить
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
