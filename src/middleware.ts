import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, isValidLocale } from '@/lib/i18n/config';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip for static files and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml' ||
        pathname.startsWith('/sitemap')
    ) {
        return NextResponse.next();
    }

    // Check if pathname already has a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return NextResponse.next();

    // Detect locale from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language') || '';
    let detectedLocale = defaultLocale;

    for (const locale of locales) {
        if (acceptLanguage.toLowerCase().includes(locale)) {
            detectedLocale = locale;
            break;
        }
    }

    // Redirect to locale-prefixed URL
    const newUrl = new URL(`/${detectedLocale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
}

export const config = {
    matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
