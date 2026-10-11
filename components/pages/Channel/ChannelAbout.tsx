import { formatCount, plural } from '@/lib/format/format';
import type { PublicChannel } from '@models/channel';
import type { ReactNode } from 'react';

export const ChannelAbout = ({ channel }: { channel: PublicChannel }): ReactNode => {
    const hasText = channel.streamer.bio !== null || channel.streamDescription !== null;

    return (
        <section className='mx-4 overflow-hidden rounded-xl border border-line bg-surface lg:mx-0'>
            {channel.bannerUrl !== null && (
                // eslint-disable-next-line @next/next/no-img-element -- файл из MinIO
                <img src={channel.bannerUrl} alt='' className='aspect-[4/1] w-full object-cover' />
            )}
            <div className='flex flex-col gap-4 p-5'>
                <h2 className='text-lg font-extrabold'>О канале {channel.streamer.displayName}</h2>
                <p className='text-sm text-muted'>
                    <span className='font-semibold text-fg'>
                        {formatCount(channel.followersCount)}
                    </span>{' '}
                    {plural(channel.followersCount, ['фоловер', 'фоловера', 'фоловеров'])}
                </p>
                {channel.streamer.bio !== null && (
                    <p className='whitespace-pre-line'>{channel.streamer.bio}</p>
                )}
                {channel.streamDescription !== null && (
                    <p className='whitespace-pre-line text-sm text-muted'>
                        {channel.streamDescription}
                    </p>
                )}
                {!hasText && (
                    <p className='text-sm text-subtle'>Стример пока ничего о себе не рассказал.</p>
                )}
            </div>
        </section>
    );
};
