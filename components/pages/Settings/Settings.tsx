'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Spinner } from '@ui/Button';
import { KeyIcon, PaletteIcon, ShieldIcon, SparkIcon, UserIcon, VideoIcon } from '@ui/Icons';
import { StreamKeyPanel } from '@page-ui/StreamKeyPanel/StreamKeyPanel';
import { AppearanceSection } from '@page-ui/Settings/AppearanceSection';
import { ChannelSection } from '@page-ui/Settings/ChannelSection';
import { InterestsSection } from '@page-ui/Settings/InterestsSection';
import { ProfileSection } from '@page-ui/Settings/ProfileSection';
import { SecuritySection } from '@page-ui/Settings/SecuritySection';
import { useRequireAuth } from '@composables/useRequireAuth';
import { SETTINGS_TABS } from '@page-ui/Settings/settings.tabs';
import type { SettingsTab } from '@page-ui/Settings/settings.tabs';
import type { ReactNode } from 'react';

const TAB_META: Record<SettingsTab, { title: string; icon: ReactNode }> = {
    profile: { title: 'Профиль', icon: <UserIcon /> },
    channel: { title: 'Канал', icon: <VideoIcon /> },
    'stream-key': { title: 'Ключ трансляции', icon: <KeyIcon /> },
    appearance: { title: 'Внешний вид', icon: <PaletteIcon /> },
    interests: { title: 'Интересы', icon: <SparkIcon /> },
    security: { title: 'Безопасность', icon: <ShieldIcon /> },
};

export const Settings = ({ initialTab }: { initialTab: SettingsTab }): ReactNode => {
    const router = useRouter();
    const user = useRequireAuth();
    const [tab, setTab] = useState<SettingsTab>(initialTab);

    const select = (next: SettingsTab): void => {
        setTab(next);
        // Вкладка в адресе: можно дать ссылку прямо на «Ключ трансляции».
        router.replace(`/settings?tab=${next}`, { scroll: false });
    };

    if (user === null) {
        return (
            <div className='flex min-h-[60vh] items-center justify-center text-muted'>
                <Spinner className='size-6' />
            </div>
        );
    }

    return (
        <div className='mx-auto max-w-5xl px-4 py-8'>
            <h1 className='mb-6 text-3xl font-extrabold tracking-tight'>Настройки</h1>

            <div className='flex flex-col gap-6 md:flex-row'>
                <nav
                    aria-label='Разделы настроек'
                    className='-mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:w-56 md:shrink-0 md:flex-col md:overflow-visible md:px-0'
                >
                    {SETTINGS_TABS.map((key) => {
                        const isActive = key === tab;
                        return (
                            <button
                                key={key}
                                type='button'
                                aria-current={isActive ? 'page' : undefined}
                                onClick={() => select(key)}
                                className={`flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-accent-soft text-fg'
                                        : 'text-muted hover:bg-surface-2 hover:text-fg'
                                }`}
                            >
                                <span className={isActive ? 'text-accent' : ''}>
                                    {TAB_META[key].icon}
                                </span>
                                {TAB_META[key].title}
                            </button>
                        );
                    })}
                </nav>

                <div className='min-w-0 flex-1'>
                    {tab === 'profile' && <ProfileSection user={user} />}
                    {tab === 'channel' && <ChannelSection user={user} />}
                    {tab === 'stream-key' && <StreamKeyPanel />}
                    {tab === 'appearance' && <AppearanceSection />}
                    {tab === 'interests' && <InterestsSection />}
                    {tab === 'security' && <SecuritySection email={user.email} />}
                </div>
            </div>
        </div>
    );
};
