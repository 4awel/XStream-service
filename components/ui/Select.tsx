import { fieldClass } from '@ui/Input';
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
        <label htmlFor={id} className='flex flex-col gap-1.5'>
            {label !== undefined && <span className='text-sm font-medium text-muted'>{label}</span>}
            <select
                id={id}
                className={`${fieldClass} ${className}`}
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
