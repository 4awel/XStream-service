import { fieldClass } from '@ui/Input';
import type { ReactNode, TextareaHTMLAttributes } from 'react';

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    label?: string;
    value: string;
    maxLength: number;
    onChange: (value: string) => void;
}

/** Со счётчиком символов: лимит всё равно проверяет сервер, но видеть его заранее удобнее. */
export const Textarea = ({
    label,
    id,
    value,
    maxLength,
    onChange,
    ...rest
}: TextareaProps): ReactNode => (
    <label htmlFor={id} className='flex flex-col gap-1.5'>
        {label !== undefined && <span className='text-sm font-medium text-muted'>{label}</span>}
        <textarea
            id={id}
            value={value}
            maxLength={maxLength}
            className={`${fieldClass} min-h-24 resize-y`}
            onChange={(event) => onChange(event.target.value)}
            {...rest}
        />
        <span className='self-end text-xs text-subtle'>
            {value.length}/{maxLength}
        </span>
    </label>
);
