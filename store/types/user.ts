import type { User } from '@/models/user';

export type AuthStep = 'credentials' | 'verify';

export interface UserState {
    user: User | null;
    /** true после первой проверки сессии (GET /user/me). */
    isInitialized: boolean;
    authStep: AuthStep;
    pendingEmail: string | null;
    isLoading: boolean;
    error: string | null;
}
