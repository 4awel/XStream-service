/** Отдельно от Settings.tsx: файл без 'use client', его импортирует серверная страница. */
export const SETTINGS_TABS = [
    'profile',
    'channel',
    'stream-key',
    'appearance',
    'interests',
    'security',
] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number];

export const isSettingsTab = (value: string | undefined): value is SettingsTab =>
    SETTINGS_TABS.some((tab) => tab === value);
