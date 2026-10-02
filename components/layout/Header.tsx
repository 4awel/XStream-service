'use client';

import Link from 'next/link';
import { LiveIcon, LogoutIcon, UserIcon } from '@ui/Icons';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout } from '@store/slices/user.slice';
import type { ReactNode } from 'react';

export const Header = (): ReactNode => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);

    return (
        <header className='border-b border-gray-dark'>
            <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
                <Link href='/' className='flex items-center gap-2 text-xl font-bold'>
                    <LiveIcon className='text-red' />
                    Stream
                </Link>

                {user === null ? (
                    <Link
                        href='/login'
                        className='rounded-main bg-red px-5 py-2 font-semibold hover:bg-red-dark'
                    >
                        Login
                    </Link>
                ) : (
                    <div className='flex items-center gap-4'>
                        <span className='flex items-center gap-2 text-gray-light'>
                            <UserIcon />
                            {user.username}
                        </span>
                        <button
                            type='button'
                            aria-label='Logout'
                            className='text-gray hover:text-red'
                            onClick={() => dispatch(logout())}
                        >
                            <LogoutIcon />
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
