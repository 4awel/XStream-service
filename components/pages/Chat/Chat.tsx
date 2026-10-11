'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Button } from '@ui/Button';
import { ChevronRightIcon } from '@ui/Icons';
import { useChat } from '@composables/useChat';
import { useChatHistory } from '@composables/useChatHistory';
import { useAppSelector } from '@store/hooks';
import type { ReactNode } from 'react';

/** Стабильный цвет ника по имени: один человек — всегда один цвет. */
const nameColor = (name: string): string => {
    let hash = 0;
    for (const char of name) {
        hash = (hash * 31 + char.charCodeAt(0)) % 360;
    }
    return `hsl(${hash} 75% 62%)`;
};

const formatTime = (iso: string): string =>
    new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

interface ChatProps {
    /** Вне эфира сервер сообщения не принимает — и поле ввода не показываем. */
    isLive: boolean;
    /** Есть — в шапке чата появляется кнопка «скрыть». */
    onCollapse?: () => void;
}

export const Chat = ({ isLive, onCollapse }: ChatProps): ReactNode => {
    const { messages, text, setText, canSend, sendMessage } = useChat();
    const { hasMore, isLoading, loadOlder } = useChatHistory();
    const isLoggedIn = useAppSelector((state) => state.user.user !== null);
    const listRef = useRef<HTMLUListElement>(null);
    const lastId = messages.at(-1)?.id;

    // Прокручиваем вниз только когда изменился последний id: подгрузка старых
    // сообщений добавляет их в начало и не должна сбрасывать позицию.
    // scrollTop, а не scrollIntoView: тот заодно прокручивает всю страницу.
    useEffect(() => {
        const list = listRef.current;
        if (list !== null) {
            list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
        }
    }, [lastId]);

    return (
        <section className='flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-line bg-surface'>
            <div className='relative flex items-center justify-center border-b border-line px-4 py-3'>
                {onCollapse !== undefined && (
                    <button
                        type='button'
                        aria-label='Скрыть чат'
                        onClick={onCollapse}
                        className='absolute left-2 flex size-8 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg'
                    >
                        <ChevronRightIcon className='size-4' />
                    </button>
                )}
                <h2 className='text-sm font-bold tracking-wide uppercase'>Чат трансляции</h2>
            </div>

            <ul ref={listRef} className='flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-3'>
                {hasMore && (
                    <li className='flex justify-center pb-2'>
                        <Button variant='ghost' size='sm' isLoading={isLoading} onClick={loadOlder}>
                            Показать ещё
                        </Button>
                    </li>
                )}
                {messages.length === 0 && !isLoading && (
                    <li className='m-auto text-center text-sm text-subtle'>
                        Здесь пока тихо.
                        <br />
                        Напишите первым!
                    </li>
                )}
                {messages.map((message) => (
                    <li
                        key={message.id}
                        className='rounded-md px-2 py-1 text-sm leading-relaxed break-words hover:bg-surface-2'
                    >
                        <span className='mr-2 text-xs text-subtle'>
                            {formatTime(message.createdAt)}
                        </span>
                        <span
                            className='font-semibold'
                            style={{ color: nameColor(message.username) }}
                        >
                            {message.username}
                        </span>
                        <span className='text-muted'>: </span>
                        <span>{message.text}</span>
                    </li>
                ))}
            </ul>

            {!isLive ? (
                <p className='border-t border-line p-4 text-center text-sm text-subtle'>
                    Чат открывается во время эфира
                </p>
            ) : isLoggedIn ? (
                <form className='flex gap-2 border-t border-line p-3' onSubmit={sendMessage}>
                    <input
                        id='chat-message'
                        aria-label='Сообщение'
                        placeholder='Написать сообщение'
                        autoComplete='off'
                        maxLength={500}
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        className='h-10 min-w-0 flex-1 rounded-full border border-line bg-surface-2 px-4 text-sm outline-none placeholder:text-subtle focus:border-accent'
                    />
                    <Button type='submit' disabled={!canSend}>
                        Чат
                    </Button>
                </form>
            ) : (
                <div className='border-t border-line p-3'>
                    <Link
                        href='/login'
                        className='flex h-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-on-accent hover:bg-accent-hover'
                    >
                        Войдите, чтобы писать в чат
                    </Link>
                </div>
            )}
        </section>
    );
};
