import type { ReactNode } from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
    src: string | null;
    name: string;
    size?: AvatarSize;
    /** Красное кольцо, как у стримера в эфире. */
    isLive?: boolean;
}

const sizeClasses: Record<AvatarSize, string> = {
    xs: 'size-6 text-[10px]',
    sm: 'size-8 text-xs',
    md: 'size-10 text-sm',
    lg: 'size-16 text-xl',
    xl: 'size-24 text-3xl',
};

export const Avatar = ({ src, name, size = 'md', isLive = false }: AvatarProps): ReactNode => {
    const ring = isLive ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : '';

    if (src !== null) {
        return (
            // eslint-disable-next-line @next/next/no-img-element -- файлы из MinIO, оптимизирует сервер
            <img
                src={src}
                alt={name}
                className={`shrink-0 rounded-full bg-surface-3 object-cover ${sizeClasses[size]} ${ring}`}
            />
        );
    }

    // Без картинки — первая буква на акцентном фоне.
    return (
        <span
            aria-label={name}
            className={`inline-flex shrink-0 items-center justify-center rounded-full bg-accent font-bold text-on-accent uppercase ${sizeClasses[size]} ${ring}`}
        >
            {name.slice(0, 1)}
        </span>
    );
};
