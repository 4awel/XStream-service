import { socket } from '@socket/socket.client';
import { SocketEvent } from '@socket/socket.events';
import { followReceived, subscriptionReceived, viewersUpdated } from '@store/slices/channel.slice';
import { messageReceived } from '@store/slices/chat.slice';
import type { ServerToClientEvents } from '@socket/socket.events';
import type { AppDispatch } from '@store/store';

/**
 * Связывает события сервера с экшенами стора.
 * Новое событие: добавить в socket.events.ts и сюда.
 * Возвращает функцию отписки.
 */
export const registerSocketListeners = (dispatch: AppDispatch): (() => void) => {
    const onChatMessage: ServerToClientEvents['chat_message'] = (data) => {
        dispatch(messageReceived(data));
    };
    const onFollow: ServerToClientEvents['follow'] = (data) => {
        dispatch(followReceived(data));
    };
    const onSubscription: ServerToClientEvents['subscription'] = (data) => {
        dispatch(subscriptionReceived(data));
    };
    const onViewersCount: ServerToClientEvents['viewers_count'] = (data) => {
        dispatch(viewersUpdated(data));
    };

    socket.on(SocketEvent.ChatMessage, onChatMessage);
    socket.on(SocketEvent.Follow, onFollow);
    socket.on(SocketEvent.Subscription, onSubscription);
    socket.on(SocketEvent.ViewersCount, onViewersCount);

    return () => {
        socket.off(SocketEvent.ChatMessage, onChatMessage);
        socket.off(SocketEvent.Follow, onFollow);
        socket.off(SocketEvent.Subscription, onSubscription);
        socket.off(SocketEvent.ViewersCount, onViewersCount);
    };
};
