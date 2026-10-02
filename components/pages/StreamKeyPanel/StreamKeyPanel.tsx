'use client';

import { useState } from 'react';
import { Button } from '@ui/Button';
import { useStreamKey } from '@composables/useStreamKey';
import type { ReactNode } from 'react';

const HIDDEN_PLACEHOLDER = '•'.repeat(32);

interface FieldProps {
    label: string;
    value: string;
    isSecret?: boolean;
}

const Field = ({ label, value, isSecret = false }: FieldProps): ReactNode => {
    const [isRevealed, setIsRevealed] = useState(false);
    const isHidden = isSecret && !isRevealed;

    return (
        <div className='flex flex-col gap-2'>
            <span className='text-sm text-gray-light'>{label}</span>
            <div className='flex items-center gap-2'>
                <code className='flex-1 truncate rounded-main border border-gray bg-gray-dark px-4 py-3 text-sm'>
                    {isHidden ? HIDDEN_PLACEHOLDER : value}
                </code>
                {isSecret && (
                    <Button variant='ghost' onClick={() => setIsRevealed(!isRevealed)}>
                        {isRevealed ? 'Скрыть' : 'Показать'}
                    </Button>
                )}
                <Button
                    variant='secondary'
                    onClick={() => void navigator.clipboard.writeText(value).catch(() => undefined)}
                >
                    Копировать
                </Button>
            </div>
        </div>
    );
};

/** Панель стримера: что вписать в OBS, чтобы начать вещание. */
export const StreamKeyPanel = (): ReactNode => {
    const { streamKey, isLoading, error, isMissing, reset } = useStreamKey();

    return (
        <section className='flex flex-col gap-4 rounded-main bg-gray-dark p-6'>
            <div className='flex items-center justify-between gap-4'>
                <h2 className='text-lg font-semibold'>Ключ для OBS</h2>
                <Button variant='secondary' isLoading={isLoading} onClick={reset}>
                    {isMissing ? 'Создать' : 'Сбросить'}
                </Button>
            </div>

            {error !== null && <p className='text-sm text-red'>{error}</p>}

            {isMissing && (
                <p className='text-sm text-gray-light'>
                    Ключа пока нет. Нажмите «Создать» — он появится сразу.
                </p>
            )}

            {streamKey !== null && (
                <>
                    <Field label='Сервер' value={streamKey.server} />
                    <Field label='Ключ потока' value={streamKey.streamKey} isSecret />
                    <p className='text-sm text-gray'>
                        OBS → Настройки → Вещание → Сервис «Настраиваемый...», затем вставьте эти
                        два поля и нажмите «Начать трансляцию». Сброс ключа немедленно отключает
                        того, кто вещает по старому.
                    </p>
                </>
            )}
        </section>
    );
};
