import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    error?: string | null;
    onChange: (value: string) => void;
}

export const Input = ({
    label,
    error,
    id,
    className = '',
    onChange,
    ...rest
}: InputProps): ReactNode => {
    return (
        <label htmlFor={id} className='flex flex-col gap-2'>
            {label !== undefined && <span className='text-sm text-gray-light'>{label}</span>}
            <input
                id={id}
                className={`rounded-main border border-gray bg-gray-dark px-5 py-3 text-white outline-none placeholder:text-gray focus:border-red ${className}`}
                onChange={(event) => onChange(event.target.value)}
                {...rest}
            />
            {error !== undefined && error !== null && (
                <span className='text-sm text-red'>{error}</span>
            )}
        </label>
    );
};
