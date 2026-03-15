import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    async headers() {
        return [
            // Security headers for all pages
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value:
                            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://www.clarity.ms; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://www.clarity.ms; frame-src https://googleads.g.doubleclick.net;",
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
            // CDN Cache: Converter pages (7 days cache, 1 day stale)
            {
                source: '/:lang/:category/:conversion',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=604800, stale-while-revalidate=86400',
                    },
                ],
            },
            // CDN Cache: Category pages (7 days)
            {
                source: '/:lang/:category',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=604800, stale-while-revalidate=86400',
                    },
                ],
            },
            // CDN Cache: Homepage (1 day)
            {
                source: '/:lang',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=86400, stale-while-revalidate=3600',
                    },
                ],
            },
            // CDN Cache: Blog pages (7 days)
            {
                source: '/:lang/blog/:slug',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=604800, stale-while-revalidate=86400',
                    },
                ],
            },
            // CDN Cache: Static sitemap files (30 days)
            {
                source: '/sitemap/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=2592000, stale-while-revalidate=604800',
                    },
                ],
            },
            {
                source: '/sitemap.xml',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=2592000, stale-while-revalidate=604800',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
