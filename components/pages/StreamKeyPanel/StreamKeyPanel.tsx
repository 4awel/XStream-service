'use client';

import { useState } from 'react';
import { Button } from '@ui/Button';
import { Card } from '@ui/Card';
import { Notice } from '@ui/Notice';
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
    const [isCopied, setIsCopied] = useState(false);
    const isHidden = isSecret && !isRevealed;

    const copy = (): void => {
        navigator.clipboard
            .writeText(value)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 1500);
            })
            .catch(() => undefined);
    };

    return (
        <div className='flex flex-col gap-1.5'>
            <span className='text-sm font-medium text-muted'>{label}</span>
            <div className='flex flex-wrap items-center gap-2'>
                <code className='min-w-0 flex-1 truncate rounded-md border border-line bg-surface-2 px-3.5 py-2.5 text-sm'>
                    {isHidden ? HIDDEN_PLACEHOLDER : value}
                </code>
                {isSecret && (
                    <Button variant='ghost' size='sm' onClick={() => setIsRevealed(!isRevealed)}>
                        {isRevealed ? 'Скрыть' : 'Показать'}
                    </Button>
                )}
                <Button variant='secondary' size='sm' onClick={copy}>
                    {isCopied ? 'Скопировано' : 'Копировать'}
                </Button>
            </div>
        </div>
    );
};

/** Панель стримера: что вписать в OBS, чтобы начать вещание. */
export const StreamKeyPanel = (): ReactNode => {
    const { streamKey, isLoading, error, isMissing, reset } = useStreamKey();

    return (
        <Card
            title='Ключ трансляции'
            description='Никому не показывайте ключ: с ним можно вещать на вашем канале'
            actions={
                <Button
                    variant={isMissing ? 'primary' : 'danger'}
                    size='sm'
                    isLoading={isLoading}
                    onClick={reset}
                >
                    {isMissing ? 'Создать ключ' : 'Сбросить'}
                </Button>
            }
        >
            <div className='flex flex-col gap-4'>
                {error !== null && <Notice tone='error'>{error}</Notice>}

                {isMissing && (
                    <p className='text-sm text-muted'>
                        Ключа пока нет. Нажмите «Создать ключ» — он появится сразу.
                    </p>
                )}

                {streamKey !== null && (
                    <>
                        <Field label='Сервер' value={streamKey.server} />
                        <Field label='Ключ потока' value={streamKey.streamKey} isSecret />
                        <ol className='flex list-decimal flex-col gap-1 rounded-md bg-surface-2 py-3 pr-4 pl-8 text-sm text-muted'>
                            <li>OBS → Настройки → Трансляция</li>
                            <li>Сервис: «Настраиваемый...»</li>
                            <li>Вставьте «Сервер» и «Ключ потока», нажмите «Начать трансляцию»</li>
                        </ol>
                        <p className='text-xs text-subtle'>
                            Сброс ключа сразу отключает того, кто вещает по старому.
                        </p>
                    </>
                )}
            </div>
        </Card>
    );
};
