import { Settings } from '@page-ui/Settings/Settings';
import { isSettingsTab } from '@page-ui/Settings/settings.tabs';
import type { ReactNode } from 'react';

interface SettingsPageProps {
    searchParams: Promise<{ tab?: string }>;
}

const SettingsPage = async ({ searchParams }: SettingsPageProps): Promise<ReactNode> => {
    const { tab } = await searchParams;
    return <Settings initialTab={isSettingsTab(tab) ? tab : 'profile'} />;
};

export default SettingsPage;
