import type { Channel } from '@models/channel';

/** Соответствует UserResponse на сервере (GET /user/me). */
export interface User {
    id: string;
    email: string;
    username: string;
    displayName: string;
    bio: string | null;
    avatar: string | null;
    platform: string | null;
    language: string | null;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    channel: Channel;
}
