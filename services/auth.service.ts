import { api } from '@services/api/api';
import type { Credentials, VerifyPayload } from '@models/auth';

export class AuthService {
    async verify(payload: VerifyPayload): Promise<void> {
        await api.post('/auth/verify', {
            email: payload.email,
            code: payload.code,
        });
    }

    async register(credentials: Credentials): Promise<void> {
        await api.post('/auth/register', {
            email: credentials.email,
            password: credentials.password,
        });
    }

    async login(credentials: Credentials): Promise<void> {
        await api.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
        });
    }
}
