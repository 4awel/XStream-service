import { api } from '@services/api/api';
import type { StatusResponse } from '@models/auth';
import type { PublicChannel } from '@models/channel';
import type { Tag } from '@models/tag';
import type { ChangePasswordPayload, UpdateProfilePayload, User } from '@models/user';
import type { Theme } from '@/lib/theme/theme';

const asFile = (file: File): FormData => {
    const form = new FormData();
    form.append('file', file);
    return form;
};

export const UserService = {
    me: async (): Promise<User> => (await api.get<User>('/user/me')).data,

    updateProfile: async (payload: UpdateProfilePayload): Promise<User> =>
        (await api.patch<User>('/user/profile', payload)).data,

    updateTheme: async (theme: Theme): Promise<User> =>
        (await api.patch<User>('/user/settings', { theme })).data,

    changePassword: async (payload: ChangePasswordPayload): Promise<StatusResponse> =>
        (await api.patch<StatusResponse>('/user/password', payload)).data,

    uploadAvatar: async (file: File): Promise<User> =>
        (await api.post<User>('/user/avatar', asFile(file))).data,

    removeAvatar: async (): Promise<User> => (await api.delete<User>('/user/avatar')).data,

    getInterests: async (): Promise<Tag[]> => (await api.get<Tag[]>('/user/interests')).data,

    saveInterests: async (tagIds: string[]): Promise<Tag[]> =>
        (await api.put<Tag[]>('/user/interests', { tagIds })).data,

    getFollows: async (): Promise<PublicChannel[]> =>
        (await api.get<PublicChannel[]>('/user/follows')).data,
};

export { asFile };
