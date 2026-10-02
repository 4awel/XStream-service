import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-red text-white hover:bg-red-dark',
    secondary: 'bg-gray-dark text-white hover:bg-gray',
    ghost: 'bg-transparent text-gray-light hover:text-white',
};

export const Button = ({
    variant = 'primary',
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
            className={`rounded-main px-5 py-3 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
            {...rest}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    );
};
