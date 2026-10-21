export const locales = ['id', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'id';

export function resolveLocale(cookieValue: string | undefined): Locale {
  return cookieValue && (locales as readonly string[]).includes(cookieValue)
    ? (cookieValue as Locale)
    : defaultLocale;
}
