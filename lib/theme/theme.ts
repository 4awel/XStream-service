export type Theme = 'DARK' | 'LIGHT';

const STORAGE_KEY = 'theme';

const toAttribute = (theme: Theme): string => (theme === 'LIGHT' ? 'light' : 'dark');

/**
 * Скрипт для <head>: ставит data-theme до первой отрисовки, иначе светлая тема
 * сначала мигнёт тёмной. Источник правды — сервер (user.theme), localStorage —
 * только кэш, чтобы угадать тему ещё до ответа /user/me.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="LIGHT")document.documentElement.setAttribute("data-theme","light")}catch(e){}})()`;

export const applyTheme = (theme: Theme): void => {
    document.documentElement.setAttribute('data-theme', toAttribute(theme));
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // приватный режим или заблокированное хранилище — тема просто не запомнится
    }
};
