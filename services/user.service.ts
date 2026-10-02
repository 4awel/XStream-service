import { api } from '@services/api/api';
import type { StatusResponse } from '@models/auth';
import type { User } from '@models/user';

interface ChangePasswordPayload {
    id: string;
    oldPassword: string;
    newPassword: string;
}

export const UserService = {
    me: async (): Promise<User> => (await api.get<User>('/user/me')).data,

    changePassword: async (payload: ChangePasswordPayload): Promise<StatusResponse> =>
        (await api.patch<StatusResponse>('/user/password', payload)).data,
};
