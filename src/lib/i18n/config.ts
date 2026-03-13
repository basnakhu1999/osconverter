export const locales = ['en', 'th', 'es', 'zh', 'hi'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
    en: 'English',
    th: 'ไทย',
    es: 'Español',
    zh: '中文',
    hi: 'हिन्दी',
};

export const localeFlags: Record<Locale, string> = {
    en: '🇺🇸',
    th: '🇹🇭',
    es: '🇪🇸',
    zh: '🇨🇳',
    hi: '🇮🇳',
};

export function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}

export function getLocaleFromPath(path: string): Locale {
    const segments = path.split('/').filter(Boolean);
    const first = segments[0];
    if (first && isValidLocale(first)) return first;
    return defaultLocale;
}
