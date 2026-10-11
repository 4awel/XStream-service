/** Модели realtime-событий. Сервер должен слать данные в этом формате. */

export interface ChatMessage {
    id: string;
    channelId: string;
    userId: string;
    username: string;
    text: string;
    createdAt: string;
}

/** Страница истории чата текущего эфира. */
export interface ChatHistory {
    items: ChatMessage[];
    hasMore: boolean;
}

export interface FollowEvent {
    channelId: string;
    userId: string;
    username: string;
    followersCount: number;
}

export interface SubscriptionEvent {
    channelId: string;
    userId: string;
    username: string;
    months: number;
}

export interface ViewersCountEvent {
    channelId: string;
    count: number;
}
