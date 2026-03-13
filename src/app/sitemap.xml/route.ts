import { NextResponse } from 'next/server';
import { allCategories } from '@/lib/converter';

/**
 * Sitemap Index — lists all sub-sitemaps.
 * GET /sitemap.xml
 */
export async function GET() {
    const baseUrl = 'https://osconverter.com';
    const now = new Date().toISOString();

    // Build list of all sub-sitemaps
    const sitemaps: string[] = [];

    // 1. Main sitemap (homepage, categories, blog)
    sitemaps.push(`${baseUrl}/sitemap/main.xml`);

    // 2. Per-category converter sitemaps
    for (const cat of allCategories) {
        sitemaps.push(`${baseUrl}/sitemap/${cat.id}.xml`);
    }

    // 3. Value-prefixed sitemaps per category (paginated)
    // 50 values × N pairs × 5 locales — split into pages of ≤45,000 URLs
    const VALUES_COUNT = 50;
    const LOCALES_COUNT = 5;
    const MAX_PER_FILE = 45000;

    for (const cat of allCategories) {
        const pairsCount = cat.units.length * (cat.units.length - 1);
        const totalValueUrls = pairsCount * VALUES_COUNT * LOCALES_COUNT;
        const pageCount = Math.ceil(totalValueUrls / MAX_PER_FILE);

        for (let page = 1; page <= pageCount; page++) {
            sitemaps.push(`${baseUrl}/sitemap/values-${cat.id}-${page}.xml`);
        }
    }

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((url) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
        },
    });
}
