/**
 * Static Sitemap Generator
 * Generates all sitemap XML files into public/sitemap/ at build time.
 * Run: node scripts/generate-sitemaps.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'sitemap');

const BASE_URL = 'https://osconverter.com';
const LOCALES = ['en', 'th', 'es', 'zh', 'hi'];
const MAX_PER_FILE = 45000;

const POPULAR_VALUES = [
    0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10,
    12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75,
    80, 90, 100, 125, 150, 175, 200, 250, 300, 400,
    500, 600, 750, 800, 1000, 1500, 2000, 2500, 3000,
    5000, 10000, 25000, 50000, 100000, 1000000,
];

const BLOG_SLUGS = [
    'how-to-convert-cm-to-meter',
    'unit-conversion-guide',
    'what-is-meter',
];

// ========== Load category data ==========
// We import dynamically from the compiled TS files.
// This script must run AFTER `next build` compiles the TS.
// Alternative: duplicate the category data here for standalone use.

async function loadCategories() {
    const categoriesDir = path.join(ROOT, 'src', 'lib', 'converter', 'categories');
    const files = fs.readdirSync(categoriesDir).filter(f => f.endsWith('.ts'));

    const categories = [];

    for (const file of files) {
        const content = fs.readFileSync(path.join(categoriesDir, file), 'utf-8');

        // Find all category id declarations: id: 'length',
        const catIdRegex = /id:\s*'([^']+)',\s*\n\s*name:/g;
        const catIds = [];
        let catMatch;
        while ((catMatch = catIdRegex.exec(content)) !== null) {
            catIds.push({ id: catMatch[1], pos: catMatch.index });
        }

        for (let i = 0; i < catIds.length; i++) {
            const catId = catIds[i].id;
            const startPos = catIds[i].pos;
            const endPos = i + 1 < catIds.length ? catIds[i + 1].pos : content.length;
            const block = content.substring(startPos, endPos);

            // Find the units array in this block
            const unitsStart = block.indexOf('units:');
            if (unitsStart === -1) continue;

            const unitsBlock = block.substring(unitsStart);
            const unitIds = [];
            const unitRegex = /{\s*id:\s*'([^']+)'/g;
            let m;
            while ((m = unitRegex.exec(unitsBlock)) !== null) {
                unitIds.push(m[1]);
            }

            if (unitIds.length > 0) {
                categories.push({ id: catId, unitIds });
            }
        }
    }

    return categories;
}

// ========== XML generators ==========

function xmlHeader() {
    return '<?xml version="1.0" encoding="UTF-8"?>';
}

function sitemapEntry(url, priority = 0.5, changefreq = 'monthly') {
    return `  <url>
    <loc>${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function wrapUrlset(entries) {
    return `${xmlHeader()}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;
}

function wrapSitemapIndex(sitemapUrls) {
    const now = new Date().toISOString();
    return `${xmlHeader()}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
}

// ========== Main ==========

async function main() {
    console.log('🗺️  Generating static sitemaps...');

    // Clean output directory
    if (fs.existsSync(OUT_DIR)) {
        fs.rmSync(OUT_DIR, { recursive: true });
    }
    fs.mkdirSync(OUT_DIR, { recursive: true });

    const categories = await loadCategories();
    console.log(`   Found ${categories.length} categories`);

    const allSitemapFiles = [];
    let totalUrls = 0;

    // ===== 1. Main sitemap (homepage + categories + blog) =====
    {
        const entries = [];

        // Homepages
        for (const locale of LOCALES) {
            entries.push(sitemapEntry(`${BASE_URL}/${locale}`, 1.0, 'daily'));
        }

        // Category pages
        for (const locale of LOCALES) {
            for (const cat of categories) {
                entries.push(sitemapEntry(`${BASE_URL}/${locale}/${cat.id}`, 0.8, 'weekly'));
            }
        }

        // Blog
        for (const locale of LOCALES) {
            entries.push(sitemapEntry(`${BASE_URL}/${locale}/blog`, 0.7, 'weekly'));
            for (const slug of BLOG_SLUGS) {
                entries.push(sitemapEntry(`${BASE_URL}/${locale}/blog/${slug}`, 0.5, 'monthly'));
            }
        }

        const xml = wrapUrlset(entries);
        fs.writeFileSync(path.join(OUT_DIR, 'main.xml'), xml);
        allSitemapFiles.push(`${BASE_URL}/sitemap/main.xml`);
        totalUrls += entries.length;
        console.log(`   ✓ main.xml (${entries.length} URLs)`);
    }

    // ===== 2. Per-category converter sitemaps =====
    for (const cat of categories) {
        const entries = [];
        const topUnits = cat.unitIds.slice(0, 5);

        for (const locale of LOCALES) {
            for (const from of cat.unitIds) {
                for (const to of cat.unitIds) {
                    if (from !== to) {
                        const isTop = topUnits.includes(from) && topUnits.includes(to);
                        entries.push(sitemapEntry(
                            `${BASE_URL}/${locale}/${cat.id}/${from}-to-${to}`,
                            isTop ? 0.7 : 0.5,
                            'monthly'
                        ));
                    }
                }
            }
        }

        const xml = wrapUrlset(entries);
        fs.writeFileSync(path.join(OUT_DIR, `${cat.id}.xml`), xml);
        allSitemapFiles.push(`${BASE_URL}/sitemap/${cat.id}.xml`);
        totalUrls += entries.length;
        console.log(`   ✓ ${cat.id}.xml (${entries.length} URLs)`);
    }

    // ===== 3. Value-prefixed sitemaps (paginated) =====
    for (const cat of categories) {
        const allEntries = [];

        for (const locale of LOCALES) {
            for (const from of cat.unitIds) {
                for (const to of cat.unitIds) {
                    if (from !== to) {
                        for (const val of POPULAR_VALUES) {
                            const valStr = Number.isInteger(val) ? val.toString() : val.toString();
                            allEntries.push(sitemapEntry(
                                `${BASE_URL}/${locale}/${cat.id}/${valStr}-${from}-to-${to}`,
                                0.4,
                                'monthly'
                            ));
                        }
                    }
                }
            }
        }

        // Paginate
        const pageCount = Math.ceil(allEntries.length / MAX_PER_FILE);
        for (let page = 1; page <= pageCount; page++) {
            const start = (page - 1) * MAX_PER_FILE;
            const pageEntries = allEntries.slice(start, start + MAX_PER_FILE);

            const filename = `values-${cat.id}-${page}.xml`;
            const xml = wrapUrlset(pageEntries);
            fs.writeFileSync(path.join(OUT_DIR, filename), xml);
            allSitemapFiles.push(`${BASE_URL}/sitemap/${filename}`);
            totalUrls += pageEntries.length;
            console.log(`   ✓ ${filename} (${pageEntries.length} URLs)`);
        }
    }

    // ===== 4. Sitemap Index =====
    const indexXml = wrapSitemapIndex(allSitemapFiles);
    // Write to public root so it's served at /sitemap.xml
    fs.writeFileSync(path.join(ROOT, 'public', 'sitemap.xml'), indexXml);
    console.log(`\n   ✓ sitemap.xml (index with ${allSitemapFiles.length} sitemaps)`);
    console.log(`\n🎉 Done! Generated ${allSitemapFiles.length} sitemaps with ${totalUrls.toLocaleString()} total URLs`);
}

main().catch(console.error);
