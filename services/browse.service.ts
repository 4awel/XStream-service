import { api } from '@services/api/api';
import type { PublicChannel } from '@models/channel';
import type { CategoryStats } from '@models/tag';

export interface CategoryPage {
    category: CategoryStats;
    channels: PublicChannel[];
}

export const BrowseService = {
    recommended: async (limit = 24): Promise<PublicChannel[]> =>
        (await api.get<PublicChannel[]>('/browse/recommended', { params: { limit } })).data,

    categories: async (): Promise<CategoryStats[]> =>
        (await api.get<CategoryStats[]>('/browse/categories')).data,

    category: async (slug: string): Promise<CategoryPage> =>
        (await api.get<CategoryPage>(`/browse/categories/${encodeURIComponent(slug)}`)).data,
};
