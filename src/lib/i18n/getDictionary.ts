import { Locale } from './config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dictionaries: Record<Locale, () => Promise<any>> = {
    en: () => import('./dictionaries/en.json').then((m) => m.default ?? m),
    th: () => import('./dictionaries/th.json').then((m) => m.default ?? m),
    es: () => import('./dictionaries/es.json').then((m) => m.default ?? m),
    zh: () => import('./dictionaries/zh.json').then((m) => m.default ?? m),
    hi: () => import('./dictionaries/hi.json').then((m) => m.default ?? m),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getDictionary(locale: Locale): Promise<any> {
    const dict = dictionaries[locale];
    if (!dict) return dictionaries['en']();
    return dict();
}

// Template string interpolation
export function t(template: string, values: Record<string, string | number> = {}): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => {
        return values[key]?.toString() ?? `{${key}}`;
    });
}
