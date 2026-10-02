import type {
    ChatMessage,
    FollowEvent,
    SubscriptionEvent,
    ViewersCountEvent,
} from '@models/realtime';

/** Имена событий — должны совпадать с @SubscribeMessage / server.emit на сервере. */
export const SocketEvent = {
    // сервер → клиент
    ChatMessage: 'chat_message',
    Follow: 'follow',
    Subscription: 'subscription',
    ViewersCount: 'viewers_count',

    // клиент → сервер
    JoinChannel: 'join_channel',
    LeaveChannel: 'leave_channel',
    ChatSend: 'chat_send',
} as const;

export interface ServerToClientEvents {
    [SocketEvent.ChatMessage]: (data: ChatMessage) => void;
    [SocketEvent.Follow]: (data: FollowEvent) => void;
    [SocketEvent.Subscription]: (data: SubscriptionEvent) => void;
    [SocketEvent.ViewersCount]: (data: ViewersCountEvent) => void;
}

export interface ClientToServerEvents {
    [SocketEvent.JoinChannel]: (data: { channelId: string }) => void;
    [SocketEvent.LeaveChannel]: (data: { channelId: string }) => void;
    [SocketEvent.ChatSend]: (data: { channelId: string; text: string }) => void;
}
