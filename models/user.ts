import type { Channel } from '@models/channel';
import type { Theme } from '@/lib/theme/theme';

export interface User {
    id: string;
    email: string;
    username: string;
    displayName: string;
    bio: string | null;
    avatarUrl: string | null;
    platform: string | null;
    language: string | null;
    isEmailVerified: boolean;
    theme: Theme;
    onboardingCompleted: boolean;
    createdAt: string;
    updatedAt: string;
    channel: Channel;
}

export interface UpdateProfilePayload {
    username?: string;
    displayName?: string;
    bio?: string;
}

export interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
}
