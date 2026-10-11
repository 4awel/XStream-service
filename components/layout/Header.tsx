'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar } from '@ui/Avatar';
import { Dropdown, MenuItem } from '@ui/Dropdown';
import {
    ChevronDownIcon,
    LogoutIcon,
    MenuIcon,
    MoonIcon,
    SettingsIcon,
    SunIcon,
    UserIcon,
} from '@ui/Icons';
import { useTheme } from '@composables/useTheme';
import { useSidebar } from '@layout/SidebarContext';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout } from '@store/slices/user.slice';
import type { ReactNode } from 'react';

interface HeaderProps {
    /** Кнопка сайдбара на мобильном; на входе и онбординге сайдбара нет. */
    showMenuButton: boolean;
}

export const Header = ({ showMenuButton }: HeaderProps): ReactNode => {
    const { setMobileOpen } = useSidebar();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user, isInitialized } = useAppSelector((state) => state.user);
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'DARK';

    return (
        <header className='sticky top-0 z-40 h-14 border-b border-line bg-surface/90 backdrop-blur'>
            <div className='flex h-full items-center justify-between gap-4 px-4'>
                <div className='flex items-center gap-2'>
                    {showMenuButton && (
                        <button
                            type='button'
                            aria-label='Открыть меню'
                            onClick={() => setMobileOpen(true)}
                            className='flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg lg:hidden'
                        >
                            <MenuIcon />
                        </button>
                    )}
                    <Link
                        href='/'
                        className='flex items-center gap-1 justify-center text-lg font-extrabold tracking-tight'
                    >
                        X<span className='text-accent'>Stream</span>
                    </Link>
                </div>

                {/* Пока /user/me не ответил, не показываем ни «Войти», ни меню: иначе мигнёт. */}
                {!isInitialized ? null : user === null ? (
                    <div className='flex items-center gap-2'>
                        <button
                            type='button'
                            aria-label='Сменить тему'
                            onClick={() => setTheme(isDark ? 'LIGHT' : 'DARK')}
                            className='flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg'
                        >
                            {isDark ? <SunIcon /> : <MoonIcon />}
                        </button>
                        <Link
                            href='/login'
                            className='flex h-9 items-center rounded-full bg-surface-2 px-4 text-sm font-semibold hover:bg-surface-3'
                        >
                            Войти
                        </Link>
                        <Link
                            href='/login?mode=register'
                            className='flex h-9 items-center rounded-full bg-accent px-4 text-sm font-semibold text-on-accent hover:bg-accent-hover'
                        >
                            Регистрация
                        </Link>
                    </div>
                ) : (
                    <Dropdown
                        trigger={(isOpen) => (
                            <span className='flex items-center gap-1.5 rounded-full p-1 pr-2 hover:bg-surface-2'>
                                <Avatar src={user.avatarUrl} name={user.displayName} size='sm' />
                                <ChevronDownIcon
                                    className={`size-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                />
                            </span>
                        )}
                    >
                        {(close) => (
                            <>
                                <div className='flex items-center gap-3 border-b border-line px-4 pt-2 pb-3'>
                                    <Avatar src={user.avatarUrl} name={user.displayName} />
                                    <div className='min-w-0'>
                                        <p className='truncate font-semibold'>{user.displayName}</p>
                                        <p className='truncate text-xs text-muted'>
                                            @{user.username}
                                        </p>
                                    </div>
                                </div>
                                <div className='py-1'>
                                    <MenuItem
                                        icon={<UserIcon />}
                                        onClick={() => {
                                            close();
                                            router.push(`/${user.username}`);
                                        }}
                                    >
                                        Мой канал
                                    </MenuItem>
                                    <MenuItem
                                        icon={<SettingsIcon />}
                                        onClick={() => {
                                            close();
                                            router.push('/settings');
                                        }}
                                    >
                                        Настройки
                                    </MenuItem>
                                    <MenuItem
                                        icon={isDark ? <SunIcon /> : <MoonIcon />}
                                        onClick={() => setTheme(isDark ? 'LIGHT' : 'DARK')}
                                    >
                                        {isDark ? 'Светлая тема' : 'Тёмная тема'}
                                    </MenuItem>
                                </div>
                                <div className='border-t border-line pt-1'>
                                    <MenuItem
                                        icon={<LogoutIcon />}
                                        tone='danger'
                                        onClick={() => {
                                            close();
                                            void dispatch(logout()).then(() => router.push('/'));
                                        }}
                                    >
                                        Выйти
                                    </MenuItem>
                                </div>
                            </>
                        )}
                    </Dropdown>
                )}
            </div>
        </header>
    );
};
