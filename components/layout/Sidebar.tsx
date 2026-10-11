'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Avatar } from '@ui/Avatar';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, GridIcon, HomeIcon } from '@ui/Icons';
import { useSidebar } from '@layout/SidebarContext';
import { useFetch } from '@composables/useFetch';
import { BrowseService } from '@services/browse.service';
import { useAppSelector } from '@store/hooks';
import { formatCount } from '@/lib/format/format';
import type { PublicChannel } from '@models/channel';
import type { ReactNode } from 'react';

const RECOMMENDED_IN_SIDEBAR = 8;

interface ChannelRowProps {
    channel: PublicChannel;
    isCollapsed: boolean;
}

const ChannelRow = ({ channel, isCollapsed }: ChannelRowProps): ReactNode => (
    <Link
        href={`/${channel.streamer.username}`}
        title={channel.streamer.displayName}
        className={`flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-surface-2 ${
            isCollapsed ? 'justify-center' : ''
        }`}
    >
        <span className={channel.isLive ? '' : 'opacity-50 grayscale'}>
            <Avatar
                src={channel.streamer.avatarUrl}
                name={channel.streamer.displayName}
                size='sm'
                isLive={channel.isLive && isCollapsed}
            />
        </span>
        {!isCollapsed && (
            <>
                <span className='min-w-0 flex-1'>
                    <span className='block truncate text-sm font-semibold'>
                        {channel.streamer.displayName}
                    </span>
                    <span className='block truncate text-xs text-muted'>
                        {channel.isLive
                            ? (channel.category?.title ?? channel.streamTitle ?? 'В эфире')
                            : 'Не в сети'}
                    </span>
                </span>
                {channel.isLive && (
                    <span className='flex items-center gap-1 text-xs text-muted'>
                        <span className='size-2 rounded-full bg-accent' />
                        {formatCount(channel.viewersCount)}
                    </span>
                )}
            </>
        )}
    </Link>
);

interface NavGroupProps {
    title: string;
    isCollapsed: boolean;
    children: ReactNode;
}

const NavGroup = ({ title, isCollapsed, children }: NavGroupProps): ReactNode => (
    <div className='flex flex-col gap-0.5'>
        {isCollapsed ? (
            <div className='mx-auto my-2 h-px w-8 bg-line' />
        ) : (
            <h3 className='px-2 pt-4 pb-1 text-xs font-bold tracking-wider text-subtle uppercase'>
                {title}
            </h3>
        )}
        {children}
    </div>
);

interface NavLinkProps {
    href: string;
    icon: ReactNode;
    title: string;
    isCollapsed: boolean;
}

const NavLink = ({ href, icon, title, isCollapsed }: NavLinkProps): ReactNode => {
    const isActive = usePathname() === href;
    return (
        <Link
            href={href}
            title={title}
            className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm font-semibold transition-colors ${
                isActive ? 'bg-accent-soft text-fg' : 'text-muted hover:bg-surface-2 hover:text-fg'
            } ${isCollapsed ? 'justify-center' : ''}`}
        >
            <span className={isActive ? 'text-accent' : ''}>{icon}</span>
            {!isCollapsed && title}
        </Link>
    );
};

const SidebarContent = ({ isCollapsed }: { isCollapsed: boolean }): ReactNode => {
    const user = useAppSelector((state) => state.user.user);
    const follows = useAppSelector((state) => state.follows.channels);
    const recommended = useFetch('sidebar-recommended', () =>
        BrowseService.recommended(RECOMMENDED_IN_SIDEBAR),
    );

    const followedIds = new Set(follows.map((channel) => channel.id));
    const recommendedChannels = (recommended.data ?? []).filter(
        (channel) => !followedIds.has(channel.id),
    );

    return (
        <nav aria-label='Навигация' className='flex flex-col gap-0.5 p-2'>
            <NavLink href='/' icon={<HomeIcon />} title='Главная' isCollapsed={isCollapsed} />
            <NavLink
                href='/categories'
                icon={<GridIcon />}
                title='Категории'
                isCollapsed={isCollapsed}
            />

            {user !== null && (
                <NavGroup title='Подписки' isCollapsed={isCollapsed}>
                    {follows.length === 0 && !isCollapsed && (
                        <p className='px-2 py-1 text-xs text-subtle'>
                            Подпишитесь на каналы — они появятся здесь
                        </p>
                    )}
                    {follows.map((channel) => (
                        <ChannelRow key={channel.id} channel={channel} isCollapsed={isCollapsed} />
                    ))}
                </NavGroup>
            )}

            {recommendedChannels.length > 0 && (
                <NavGroup title='Рекомендуем' isCollapsed={isCollapsed}>
                    {recommendedChannels.map((channel) => (
                        <ChannelRow key={channel.id} channel={channel} isCollapsed={isCollapsed} />
                    ))}
                </NavGroup>
            )}
        </nav>
    );
};

export const Sidebar = (): ReactNode => {
    const pathname = usePathname();
    const { isCollapsed, toggleCollapsed, isMobileOpen, setMobileOpen } = useSidebar();

    // Перешли по ссылке — мобильная панель больше не нужна.
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname, setMobileOpen]);

    return (
        <>
            <aside
                className={`sticky top-14 hidden h-[calc(100vh-56px)] shrink-0 flex-col overflow-y-auto border-r border-line bg-surface transition-[width] duration-200 lg:flex ${
                    isCollapsed ? 'w-[72px]' : 'w-64'
                }`}
            >
                <div className='flex-1'>
                    <SidebarContent isCollapsed={isCollapsed} />
                </div>
                <button
                    type='button'
                    onClick={toggleCollapsed}
                    aria-label={isCollapsed ? 'Развернуть панель' : 'Свернуть панель'}
                    className='m-2 flex h-9 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg'
                >
                    {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </button>
            </aside>

            {isMobileOpen && (
                <div className='fixed inset-0 z-50 lg:hidden'>
                    <button
                        type='button'
                        aria-label='Закрыть меню'
                        className='absolute inset-0 bg-overlay'
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className='absolute inset-y-0 left-0 w-72 overflow-y-auto rounded-r-xl bg-surface shadow-2xl'>
                        <div className='flex justify-end p-2'>
                            <button
                                type='button'
                                aria-label='Закрыть меню'
                                className='flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-2'
                                onClick={() => setMobileOpen(false)}
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <SidebarContent isCollapsed={false} />
                    </aside>
                </div>
            )}
        </>
    );
};
