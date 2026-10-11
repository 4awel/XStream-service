import { api } from '@services/api/api';
import { asFile } from '@services/user.service';
import type { Channel, FollowState, PublicChannel, UpdateChannelPayload } from '@models/channel';
import type { ChatHistory } from '@models/realtime';
import type { StreamKey } from '@models/stream';

export const ChannelService = {
    getStreamKey: async (): Promise<StreamKey> =>
        (await api.get<StreamKey>('/channel/stream-key')).data,

    resetStreamKey: async (): Promise<StreamKey> =>
        (await api.post<StreamKey>('/channel/stream-key/reset')).data,

    update: async (payload: UpdateChannelPayload): Promise<Channel> =>
        (await api.patch<Channel>('/channel', payload)).data,

    uploadBanner: async (file: File): Promise<Channel> =>
        (await api.post<Channel>('/channel/banner', asFile(file))).data,

    removeBanner: async (): Promise<Channel> => (await api.delete<Channel>('/channel/banner')).data,

    getByUsername: async (username: string): Promise<PublicChannel> =>
        (await api.get<PublicChannel>(`/channel/by-username/${encodeURIComponent(username)}`)).data,

    getById: async (channelId: string): Promise<PublicChannel> =>
        (await api.get<PublicChannel>(`/channel/id/${channelId}`)).data,

    follow: async (channelId: string): Promise<FollowState> =>
        (await api.post<FollowState>(`/channel/${channelId}/follow`)).data,

    unfollow: async (channelId: string): Promise<FollowState> =>
        (await api.delete<FollowState>(`/channel/${channelId}/follow`)).data,

    /** История чата текущего эфира; before — id самого старого загруженного сообщения. */
    getChat: async (channelId: string, before?: string): Promise<ChatHistory> =>
        (await api.get<ChatHistory>(`/channel/${channelId}/chat`, { params: { before } })).data,
};
