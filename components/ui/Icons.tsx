import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const baseProps: IconProps = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

export const LiveIcon = (props: IconProps): ReactNode => (
    <svg {...baseProps} {...props}>
        <circle cx='12' cy='12' r='3' fill='currentColor' />
        <path d='M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9' />
    </svg>
);

export const UserIcon = (props: IconProps): ReactNode => (
    <svg {...baseProps} {...props}>
        <circle cx='12' cy='8' r='4' />
        <path d='M4 20a8 8 0 0 1 16 0' />
    </svg>
);

export const LogoutIcon = (props: IconProps): ReactNode => (
    <svg {...baseProps} {...props}>
        <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9' />
    </svg>
);
