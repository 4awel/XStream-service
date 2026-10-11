const compact = new Intl.NumberFormat('ru-RU', { notation: 'compact', maximumFractionDigits: 1 });

/** 1234 → «1,2 тыс.» */
export const formatCount = (value: number): string => compact.format(value);

/** Длительность эфира: 0:05:09, 2:14:00. */
export const formatUptime = (startedAt: string, now: number): string => {
    const total = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const pad = (n: number): string => n.toString().padStart(2, '0');
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
};

/** Склонение: plural(5, ['зритель', 'зрителя', 'зрителей']) → «зрителей». */
export const plural = (value: number, forms: [string, string, string]): string => {
    const mod10 = value % 10;
    const mod100 = value % 100;
    if (mod10 === 1 && mod100 !== 11) {
        return forms[0];
    }
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
        return forms[1];
    }
    return forms[2];
};
