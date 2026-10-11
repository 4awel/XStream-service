/** Соответствует ChannelResponse на сервере — свой канал внутри /user/me. */
export interface Channel {
    id: string;
    streamTitle: string | null;
    streamDescription: string | null;
    thumbnailUrl: string | null;
    primaryCategoryId: string | null;
    bannerUrl: string | null;
    isLive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Streamer {
    id: string;
    username: string;
    displayName: string;
    bio: string | null;
    avatarUrl: string | null;
}

export interface CategoryRef {
    id: string;
    slug: string;
    title: string;
}

/** PublicChannelResponse: канал глазами зрителя. */
export interface PublicChannel {
    id: string;
    isLive: boolean;
    streamTitle: string | null;
    streamDescription: string | null;
    primaryCategoryId: string | null;
    bannerUrl: string | null;
    followersCount: number;
    /** Зрителей прямо сейчас; 0, если не в эфире. */
    viewersCount: number;
    /** ISO-время начала эфира. */
    liveStartedAt: string | null;
    category: CategoryRef | null;
    isFollowing: boolean;
    streamer: Streamer;
}

export interface FollowState {
    isFollowing: boolean;
    followersCount: number;
}

export interface UpdateChannelPayload {
    streamTitle?: string;
    streamDescription?: string;
    /** Пустая строка — убрать категорию. */
    primaryCategoryId?: string;
}
