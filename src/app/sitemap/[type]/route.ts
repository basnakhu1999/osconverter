import { NextResponse } from 'next/server';
import { locales } from '@/lib/i18n/config';
import { allCategories, getCategoryById } from '@/lib/converter';

// 50 popular values for programmatic SEO
const POPULAR_VALUES = [
    0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10,
    12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75,
    80, 90, 100, 125, 150, 175, 200, 250, 300, 400,
    500, 600, 750, 800, 1000, 1500, 2000, 2500, 3000,
    5000, 10000, 25000, 50000, 100000, 1000000,
];

const MAX_PER_FILE = 45000;

const blogSlugs = [
    'how-to-convert-cm-to-meter',
    'unit-conversion-guide',
    'what-is-meter',
];

interface SitemapEntry {
    url: string;
    lastmod: string;
    changefreq: string;
    priority: number;
}

function generateXml(entries: SitemapEntry[]): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

/**
 * Dynamic sub-sitemap routes.
 * 
 * GET /sitemap/main.xml          → homepage, categories, blog
 * GET /sitemap/length.xml        → all length converter pairs × 5 locales
 * GET /sitemap/values-length-1.xml → value-prefixed length pages (page 1)
 */
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ type: string }> }
) {
    const { type } = await params;
    const baseUrl = 'https://osconverter.com';
    const now = new Date().toISOString();

    // Remove .xml extension
    const slug = type.replace(/\.xml$/, '');

    // ========== MAIN SITEMAP ==========
    if (slug === 'main') {
        const entries: SitemapEntry[] = [];

        // Homepages
        for (const locale of locales) {
            entries.push({
                url: `${baseUrl}/${locale}`,
                lastmod: now,
                changefreq: 'daily',
                priority: 1.0,
            });
        }

        // Category pages
        for (const locale of locales) {
            for (const cat of allCategories) {
                entries.push({
                    url: `${baseUrl}/${locale}/${cat.id}`,
                    lastmod: now,
                    changefreq: 'weekly',
                    priority: 0.8,
                });
            }
        }

        // Blog
        for (const locale of locales) {
            entries.push({
                url: `${baseUrl}/${locale}/blog`,
                lastmod: now,
                changefreq: 'weekly',
                priority: 0.7,
            });
            for (const blogSlug of blogSlugs) {
                entries.push({
                    url: `${baseUrl}/${locale}/blog/${blogSlug}`,
                    lastmod: now,
                    changefreq: 'monthly',
                    priority: 0.5,
                });
            }
        }

        return new NextResponse(generateXml(entries), {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
            },
        });
    }

    // ========== VALUE-PREFIXED SITEMAPS ==========
    // Pattern: values-{categoryId}-{page}
    const valuesMatch = slug.match(/^values-(.+)-(\d+)$/);
    if (valuesMatch) {
        const catId = valuesMatch[1];
        const page = parseInt(valuesMatch[2]);
        const cat = getCategoryById(catId);

        if (!cat) {
            return new NextResponse('Not found', { status: 404 });
        }

        // Generate all value-prefixed URLs for this category
        const allEntries: SitemapEntry[] = [];

        for (const locale of locales) {
            for (const from of cat.units) {
                for (const to of cat.units) {
                    if (from.id !== to.id) {
                        for (const val of POPULAR_VALUES) {
                            // Format value: clean decimals
                            const valStr = Number.isInteger(val)
                                ? val.toString()
                                : val.toString();

                            allEntries.push({
                                url: `${baseUrl}/${locale}/${catId}/${valStr}-${from.id}-to-${to.id}`,
                                lastmod: now,
                                changefreq: 'monthly',
                                priority: 0.4,
                            });
                        }
                    }
                }
            }
        }

        // Paginate
        const startIndex = (page - 1) * MAX_PER_FILE;
        const pageEntries = allEntries.slice(startIndex, startIndex + MAX_PER_FILE);

        if (pageEntries.length === 0) {
            return new NextResponse('Not found', { status: 404 });
        }

        return new NextResponse(generateXml(pageEntries), {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
            },
        });
    }

    // ========== CATEGORY CONVERTER SITEMAPS ==========
    // Pattern: {categoryId}
    const cat = getCategoryById(slug);
    if (cat) {
        const entries: SitemapEntry[] = [];
        const topUnits = cat.units.slice(0, 5);

        for (const locale of locales) {
            for (const from of cat.units) {
                for (const to of cat.units) {
                    if (from.id !== to.id) {
                        // Top units get higher priority
                        const isTop = topUnits.some((u) => u.id === from.id) &&
                                      topUnits.some((u) => u.id === to.id);
                        entries.push({
                            url: `${baseUrl}/${locale}/${cat.id}/${from.id}-to-${to.id}`,
                            lastmod: now,
                            changefreq: 'monthly',
                            priority: isTop ? 0.7 : 0.5,
                        });
                    }
                }
            }
        }

        return new NextResponse(generateXml(entries), {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
            },
        });
    }

    return new NextResponse('Not found', { status: 404 });
}
