import { followReceived, subscriptionReceived, viewersUpdated } from '@store/slices/channel.slice';
import { messageReceived } from '@store/slices/chat.slice';
import type { ServerToClientEvents } from '@socket/socket.events';
import type { AppDispatch } from '@store/store';

/** Для каждого серверного события обязателен обработчик — TypeScript не даст пропустить новое. */
export type EventMap = { [E in keyof ServerToClientEvents]: ServerToClientEvents[E] };

/**
 * Реестр «событие сервера → что делаем на клиенте».
 * Сервер: this.events.emitToChannel(id, SOCKET_EVENT.ChatMessage, payload)
 * Клиент: ниже chat_message → messageReceived.
 * Новое событие: добавить в socket.events.ts и сюда одной строкой.
 */
export const initEventMap = (dispatch: AppDispatch): EventMap => ({
    chat_message: (data) => dispatch(messageReceived(data)),
    follow: (data) => dispatch(followReceived(data)),
    subscription: (data) => dispatch(subscriptionReceived(data)),
    viewers_count: (data) => dispatch(viewersUpdated(data)),
});
