/** Соответствует ChannelResponse на сервере. */
export interface Channel {
    id: string;
    streamTitle: string | null;
    streamDescription: string | null;
    thumbnailUrl: string | null;
    primaryCategoryId: string | null;
    isLive: boolean;
    createdAt: string;
    updatedAt: string;
}
