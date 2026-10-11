import type { ReactNode } from 'react';

interface CardProps {
    title?: string;
    description?: string;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
}

/** Блок настроек/панели: заголовок, пояснение, содержимое. */
export const Card = ({
    title,
    description,
    actions,
    children,
    className = '',
}: CardProps): ReactNode => (
    <section className={`rounded-xl border border-line bg-surface p-5 sm:p-6 ${className}`}>
        {(title !== undefined || actions !== undefined) && (
            <header className='mb-5 flex items-start justify-between gap-4'>
                <div className='flex flex-col gap-1'>
                    {title !== undefined && <h2 className='text-base font-semibold'>{title}</h2>}
                    {description !== undefined && (
                        <p className='text-sm text-muted'>{description}</p>
                    )}
                </div>
                {actions}
            </header>
        )}
        {children}
    </section>
);
