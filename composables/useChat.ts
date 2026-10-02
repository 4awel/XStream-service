'use client';

import { useState } from 'react';
import { socket } from '@socket/socket.client';
import { SocketEvent } from '@socket/socket.events';
import { useAppSelector } from '@store/hooks';
import type { FormEvent } from 'react';
import type { ChatMessage } from '@models/realtime';

const MAX_LENGTH = 500;

interface UseChat {
    messages: ChatMessage[];
    text: string;
    setText: (value: string) => void;
    canSend: boolean;
    sendMessage: (event: FormEvent<HTMLFormElement>) => void;
}

/**
 * Отправка идёт напрямую в сокет: сервер рассылает `chat_message` всем в комнате,
 * включая отправителя — так сообщение попадает в store у всех одинаково.
 */
export const useChat = (): UseChat => {
    const messages = useAppSelector((state) => state.chat.messages);
    const channelId = useAppSelector((state) => state.channel.currentChannelId);
    const isLoggedIn = useAppSelector((state) => state.user.user !== null);
    const [text, setText] = useState('');

    const trimmed = text.trim();
    const canSend = isLoggedIn && channelId !== null && trimmed.length > 0;

    const sendMessage = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (!canSend || channelId === null) {
            return;
        }
        socket.emit(SocketEvent.ChatSend, { channelId, text: trimmed.slice(0, MAX_LENGTH) });
        setText('');
    };

    return { messages, text, setText, canSend, sendMessage };
};
