import { api } from '@services/api/api';
import type { StreamKey } from '@models/stream';

export const ChannelService = {
    /** Текущий ключ. 404 — ключ ещё ни разу не создавали. */
    getStreamKey: async (): Promise<StreamKey> =>
        (await api.get<StreamKey>('/channel/stream-key')).data,

    /** Выдаёт новый ключ; прежний сразу перестаёт работать. */
    resetStreamKey: async (): Promise<StreamKey> =>
        (await api.post<StreamKey>('/channel/stream-key/reset')).data,
};
