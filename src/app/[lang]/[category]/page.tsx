import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary, t } from '@/lib/i18n/getDictionary';
import { type Locale, locales } from '@/lib/i18n/config';
import { getCategoryById, allCategories, getConversionSlug } from '@/lib/converter';

export async function generateStaticParams() {
    const params: { lang: string; category: string }[] = [];
    for (const locale of locales) {
        for (const cat of allCategories) {
            params.push({ lang: locale, category: cat.id });
        }
    }
    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; category: string }> }): Promise<Metadata> {
    const { lang, category: catId } = await params;
    const dict = await getDictionary(lang as Locale);
    const cat = getCategoryById(catId);
    if (!cat) return {};

    const title = t(dict.seo.categoryTitle, { category: cat.name });
    const description = t(dict.seo.categoryDescription, { category: cat.name, count: cat.units.length.toString() });

    return {
        title,
        description,
        alternates: {
            canonical: `https://osconverter.com/${lang}/${catId}`,
            languages: Object.fromEntries(locales.map((l) => [l, `https://osconverter.com/${l}/${catId}`])),
        },
        openGraph: { title, description, url: `https://osconverter.com/${lang}/${catId}` },
        twitter: { card: 'summary', title, description },
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string; category: string }> }) {
    const { lang, category: catId } = await params;
    const dict = await getDictionary(lang as Locale);
    const cat = getCategoryById(catId);
    if (!cat) notFound();

    // Generate popular pairs (first 5 units paired with each other)
    const topUnits = cat.units.slice(0, 8);
    const pairs: { from: string; to: string; slug: string; label: string }[] = [];
    for (let i = 0; i < Math.min(topUnits.length, 6); i++) {
        for (let j = i + 1; j < Math.min(topUnits.length, 6); j++) {
            pairs.push({
                from: topUnits[i].id,
                to: topUnits[j].id,
                slug: `${topUnits[i].id}-to-${topUnits[j].id}`,
                label: `${topUnits[i].name} → ${topUnits[j].name}`,
            });
            pairs.push({
                from: topUnits[j].id,
                to: topUnits[i].id,
                slug: `${topUnits[j].id}-to-${topUnits[i].id}`,
                label: `${topUnits[j].name} → ${topUnits[i].name}`,
            });
        }
    }

    return (
        <div className="container" style={{ paddingTop: 'var(--space-2xl)' }}>
            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <Link href={`/${lang}`}>Home</Link>
                <span className="breadcrumb-sep">/</span>
                <span>{cat.name}</span>
            </nav>

            {/* Header */}
            <div style={{ marginBottom: 'var(--space-3xl)' }}>
                <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-sm)' }}>
                    {cat.icon} {cat.name}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', maxWidth: '700px' }}>
                    {cat.description}
                </p>
                <div className="badge" style={{ marginTop: 'var(--space-md)' }}>
                    {t(dict.category.unitsAvailable, { count: cat.units.length.toString() })}
                </div>
            </div>

            {/* Ad slot */}
            <div className="ad-slot" style={{ marginBottom: 'var(--space-2xl)' }}>{dict.ad.label}</div>

            {/* Popular conversion pairs */}
            <section style={{ marginBottom: 'var(--space-3xl)' }}>
                <h2 className="section-title">{dict.category.popularPairs}</h2>
                <div className="popular-list">
                    {pairs.slice(0, 16).map((p) => (
                        <Link
                            key={p.slug}
                            href={`/${lang}/${catId}/${p.slug}`}
                            className="popular-item"
                        >
                            {p.label}
                        </Link>
                    ))}
                </div>
            </section>

            {/* All units */}
            <section style={{ marginBottom: 'var(--space-3xl)' }}>
                <h2 className="section-title">{dict.category.allConverters}</h2>
                <div className="grid-4">
                    {cat.units.map((unit) => (
                        <div key={unit.id} className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{unit.name}</div>
                            <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>{unit.symbol}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            { '@type': 'ListItem', position: 1, name: 'Home', item: `https://osconverter.com/${lang}` },
                            { '@type': 'ListItem', position: 2, name: cat.name, item: `https://osconverter.com/${lang}/${catId}` },
                        ],
                    }),
                }}
            />
        </div>
    );
}
