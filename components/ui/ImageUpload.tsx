'use client';

import { useRef } from 'react';
import { Button } from '@ui/Button';
import { TrashIcon, UploadIcon } from '@ui/Icons';
import type { ChangeEvent, ReactNode } from 'react';

/** Совпадает с лимитом сервера: проверяем заранее, чтобы не гонять 20 МБ зря. */
const MAX_BYTES = 5 * 1024 * 1024;

interface ImageUploadProps {
    hasImage: boolean;
    isBusy: boolean;
    onUpload: (file: File) => void;
    onRemove: () => void;
    onError: (message: string) => void;
}

export const ImageUpload = ({
    hasImage,
    isBusy,
    onUpload,
    onRemove,
    onError,
}: ImageUploadProps): ReactNode => {
    const inputRef = useRef<HTMLInputElement>(null);

    const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        // Сбрасываем значение, чтобы повторный выбор того же файла снова сработал.
        event.target.value = '';
        if (file === undefined) {
            return;
        }
        if (!file.type.startsWith('image/')) {
            onError('Нужна картинка: JPG, PNG, WEBP или GIF');
            return;
        }
        if (file.size > MAX_BYTES) {
            onError('Файл больше 5 МБ');
            return;
        }
        onUpload(file);
    };

    return (
        <div className='flex flex-wrap items-center gap-2'>
            <input
                ref={inputRef}
                type='file'
                accept='image/jpeg,image/png,image/webp,image/gif'
                className='hidden'
                onChange={onChange}
            />
            <Button
                variant='secondary'
                size='sm'
                isLoading={isBusy}
                onClick={() => inputRef.current?.click()}
            >
                {!isBusy && <UploadIcon className='size-4' />}
                {hasImage ? 'Заменить' : 'Загрузить'}
            </Button>
            {hasImage && (
                <Button variant='ghost' size='sm' disabled={isBusy} onClick={onRemove}>
                    <TrashIcon className='size-4' />
                    Удалить
                </Button>
            )}
        </div>
    );
};
