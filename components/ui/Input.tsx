import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    hint?: string;
    error?: string | null;
    onChange: (value: string) => void;
}

export const fieldClass =
    'w-full rounded-md border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-subtle hover:border-surface-3 focus:border-accent';

export const Input = ({
    label,
    hint,
    error,
    id,
    className = '',
    onChange,
    ...rest
}: InputProps): ReactNode => {
    const hasError = error !== undefined && error !== null;

    return (
        <label htmlFor={id} className='flex flex-col gap-1.5'>
            {label !== undefined && <span className='text-sm font-medium text-muted'>{label}</span>}
            <input
                id={id}
                aria-invalid={hasError}
                className={`${fieldClass} ${hasError ? 'border-accent' : ''} ${className}`}
                onChange={(event) => onChange(event.target.value)}
                {...rest}
            />
            {hasError ? (
                <span className='text-xs text-accent'>{error}</span>
            ) : (
                hint !== undefined && <span className='text-xs text-subtle'>{hint}</span>
            )}
        </label>
    );
};
