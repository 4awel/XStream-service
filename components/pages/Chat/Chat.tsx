'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@ui/Button';
import { Input } from '@ui/Input';
import { useChat } from '@composables/useChat';
import type { ReactNode } from 'react';

export const Chat = (): ReactNode => {
    const { messages, text, setText, canSend, sendMessage } = useChat();
    const bottomRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    return (
        <section className='flex h-[600px] flex-col rounded-main bg-gray-dark'>
            <h2 className='border-b border-black px-5 py-4 font-bold'>Чат</h2>

            <ul className='flex flex-1 flex-col gap-2 overflow-y-auto px-5 py-4'>
                {messages.length === 0 && <li className='text-gray'>Сообщений пока нет</li>}
                {messages.map((message) => (
                    <li key={message.id} className='break-words'>
                        <span className='font-semibold text-red'>{message.username}: </span>
                        <span>{message.text}</span>
                    </li>
                ))}
                <li ref={bottomRef} aria-hidden />
            </ul>

            <form className='flex gap-2 border-t border-black p-4' onSubmit={sendMessage}>
                <div className='flex-1'>
                    <Input
                        id='chat-message'
                        placeholder='Написать сообщение'
                        autoComplete='off'
                        maxLength={500}
                        value={text}
                        onChange={setText}
                    />
                </div>
                <Button type='submit' disabled={!canSend}>
                    Отпр.
                </Button>
            </form>
        </section>
    );
};
