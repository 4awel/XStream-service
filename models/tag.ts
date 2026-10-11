export type TagKind = 'CATEGORY' | 'GAME_MODE' | 'FORMAT' | 'MOOD' | 'LANGUAGE' | 'CONTENT';

export type TagGroup =
    'GAME' | 'IRL' | 'TALK' | 'MUSIC' | 'CREATIVE' | 'EDUCATION' | 'ESPORTS' | 'SPORTS' | 'OTHER';

export interface Tag {
    id: string;
    slug: string;
    title: string;
    kind: TagKind;
    group: TagGroup | null;
    isMature: boolean;
    viewersCount: number;
}

/** Категория в каталоге со статистикой эфиров. */
export interface CategoryStats extends Tag {
    liveChannels: number;
    liveViewers: number;
    isInterest: boolean;
}
