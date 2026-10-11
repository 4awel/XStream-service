import { api } from '@services/api/api';
import type { Tag, TagKind } from '@models/tag';

export const TagService = {
    list: async (kinds: TagKind[]): Promise<Tag[]> =>
        (await api.get<Tag[]>('/tags', { params: { kind: kinds.join(','), limit: 200 } })).data,
};
