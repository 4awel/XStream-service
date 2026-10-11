import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

export const Spinner = ({ className = '' }: { className?: string }): ReactNode => (
    <span
        aria-hidden
        className={`inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
);

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-accent text-on-accent hover:bg-accent-hover',
    secondary: 'bg-surface-2 text-fg hover:bg-surface-3',
    ghost: 'bg-transparent text-muted hover:bg-surface-2 hover:text-fg',
    danger: 'bg-transparent text-accent ring-1 ring-accent/40 hover:bg-accent-soft',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
};

export const Button = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    className = '',
    children,
    ...rest
}: ButtonProps): ReactNode => {
    return (
        <button
            type='button'
            disabled={disabled === true || isLoading}
            aria-busy={isLoading}
            className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...rest}
        >
            {isLoading && <Spinner />}
            {children}
        </button>
    );
};
