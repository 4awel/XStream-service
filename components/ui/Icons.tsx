import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const baseProps: IconProps = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
};

const icon = (paths: ReactNode): ((props: IconProps) => ReactNode) => {
    // Именованная функция — React DevTools и правило display-name видят имя.
    const Icon = (props: IconProps): ReactNode => (
        <svg {...baseProps} {...props}>
            {paths}
        </svg>
    );
    return Icon;
};

export const LiveIcon = icon(
    <>
        <circle cx='12' cy='12' r='3' fill='currentColor' />
        <path d='M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9' />
    </>,
);
export const UserIcon = icon(
    <>
        <circle cx='12' cy='8' r='4' />
        <path d='M4 20a8 8 0 0 1 16 0' />
    </>,
);
export const LogoutIcon = icon(
    <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9' />,
);
export const CheckIcon = icon(<path d='M20 6 9 17l-5-5' />);
export const SettingsIcon = icon(
    <>
        <circle cx='12' cy='12' r='3' />
        <path d='M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z' />
    </>,
);
export const KeyIcon = icon(
    <>
        <circle cx='7.5' cy='15.5' r='4.5' />
        <path d='m10.7 12.3 9.8-9.8M17 6l3 3M14.5 8.5l2 2' />
    </>,
);
export const PaletteIcon = icon(
    <>
        <path d='M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2.5a1.5 1.5 0 0 0-1 2.6A1.9 1.9 0 0 1 12 22z' />
        <circle cx='7.5' cy='10.5' r='1' fill='currentColor' />
        <circle cx='12' cy='7.5' r='1' fill='currentColor' />
        <circle cx='16.5' cy='10.5' r='1' fill='currentColor' />
    </>,
);
export const ShieldIcon = icon(<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />);
export const VideoIcon = icon(
    <>
        <rect x='2' y='6' width='14' height='12' rx='2' />
        <path d='m16 10 6-3v10l-6-3' />
    </>,
);
export const SparkIcon = icon(
    <path d='M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8' />,
);
export const SunIcon = icon(
    <>
        <circle cx='12' cy='12' r='4' />
        <path d='M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4' />
    </>,
);
export const MoonIcon = icon(<path d='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z' />);
export const UploadIcon = icon(
    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12' />,
);
export const TrashIcon = icon(<path d='M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6' />);
export const HeartIcon = icon(
    <path d='M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z' />,
);
export const SearchIcon = icon(
    <>
        <circle cx='11' cy='11' r='7' />
        <path d='m20 20-3.5-3.5' />
    </>,
);
export const ChevronDownIcon = icon(<path d='m6 9 6 6 6-6' />);
export const ArrowLeftIcon = icon(<path d='M19 12H5M12 19l-7-7 7-7' />);
export const MenuIcon = icon(<path d='M4 6h16M4 12h16M4 18h16' />);
export const SidebarIcon = icon(
    <>
        <rect x='3' y='4' width='18' height='16' rx='3' />
        <path d='M9 4v16' />
    </>,
);
export const CloseIcon = icon(<path d='M18 6 6 18M6 6l12 12' />);
export const ChevronLeftIcon = icon(<path d='m15 18-6-6 6-6' />);
export const ChevronRightIcon = icon(<path d='m9 18 6-6-6-6' />);
export const HomeIcon = icon(
    <path d='M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z' />,
);
export const GridIcon = icon(
    <>
        <rect x='3' y='3' width='7' height='7' rx='2' />
        <rect x='14' y='3' width='7' height='7' rx='2' />
        <rect x='3' y='14' width='7' height='7' rx='2' />
        <rect x='14' y='14' width='7' height='7' rx='2' />
    </>,
);
export const ShareIcon = icon(
    <>
        <circle cx='18' cy='5' r='3' />
        <circle cx='6' cy='12' r='3' />
        <circle cx='18' cy='19' r='3' />
        <path d='m8.6 13.5 6.8 4M15.4 6.5l-6.8 4' />
    </>,
);
export const ChatIcon = icon(<path d='M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z' />);
