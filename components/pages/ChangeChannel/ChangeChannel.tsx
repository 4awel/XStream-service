'use client';

import { useState } from 'react';
import { Button } from '@ui/Button';
import { Input } from '@ui/Input';
import { useChangeChannel } from '@composables/useChangeChannel';
import type { ReactNode } from 'react';

export const ChangeChannel = (): ReactNode => {
    const { currentChannelId, changeChannel } = useChangeChannel();
    const [channelId, setChannelId] = useState('');

    return (
        <form
            className='flex items-end gap-3 rounded-main bg-gray-dark p-6'
            onSubmit={(event) => {
                event.preventDefault();
                changeChannel(channelId);
                setChannelId('');
            }}
        >
            <div className='flex-1'>
                <Input
                    id='channel'
                    label={`Канал: ${currentChannelId ?? '—'}`}
                    placeholder='id канала'
                    value={channelId}
                    onChange={setChannelId}
                />
            </div>
            <Button type='submit'>Перейти</Button>
        </form>
    );
};
