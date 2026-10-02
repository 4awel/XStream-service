import type { ReactNode, SelectHTMLAttributes } from 'react';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string;
    options: SelectOption[];
    onChange: (value: string) => void;
}

export const Select = ({
    label,
    options,
    id,
    className = '',
    onChange,
    ...rest
}: SelectProps): ReactNode => {
    return (
        <label htmlFor={id} className='flex flex-col gap-2'>
            {label !== undefined && <span className='text-sm text-gray-light'>{label}</span>}
            <select
                id={id}
                className={`rounded-main border border-gray bg-gray-dark px-5 py-3 text-white outline-none focus:border-red ${className}`}
                onChange={(event) => onChange(event.target.value)}
                {...rest}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
};
