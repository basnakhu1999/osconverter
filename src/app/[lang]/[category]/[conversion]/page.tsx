import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary, t } from '@/lib/i18n/getDictionary';
import { type Locale, locales } from '@/lib/i18n/config';
import {
    getCategoryById,
    allCategories,
    parseConversionSlug,
    parseValueConversionSlug,
    slugHasValue,
    findUnitInCategory,
    convert,
    formatNumber,
    generateConversionTable,
    getRelatedConversions,
} from '@/lib/converter';
import ConverterClient from './ConverterClient';

export const revalidate = 86400; // ISR: 24 hours

// Helper: resolve slug to units (handles both "cm-to-meter" and "100-cm-to-m")
function resolveSlug(slug: string, catId: string) {
    const cat = getCategoryById(catId);
    if (!cat) return null;

    // Check if slug has a value prefix: "100-cm-to-m"
    if (slugHasValue(slug)) {
        const parsed = parseValueConversionSlug(slug, cat);
        if (!parsed) return null;
        const fromUnit = cat.units.find((u) => u.id === parsed.fromId);
        const toUnit = cat.units.find((u) => u.id === parsed.toId);
        if (!fromUnit || !toUnit) return null;
        return { cat, fromUnit, toUnit, value: parsed.value, hasValue: true };
    }

    // Standard slug: "cm-to-meter" or "centimeter-to-meter"
    const parsed = parseConversionSlug(slug);
    if (!parsed) return null;

    // Try direct ID match first, then alias resolution
    let fromUnit = cat.units.find((u) => u.id === parsed.fromId);
    let toUnit = cat.units.find((u) => u.id === parsed.toId);

    // If not found by direct ID, try alias resolution
    if (!fromUnit) fromUnit = findUnitInCategory(cat, parsed.fromId);
    if (!toUnit) toUnit = findUnitInCategory(cat, parsed.toId);

    if (!fromUnit || !toUnit) return null;
    return { cat, fromUnit, toUnit, value: 1, hasValue: false };
}

export async function generateStaticParams() {
    const params: { lang: string; category: string; conversion: string }[] = [];
    const popularCategories = ['length', 'weight', 'temperature', 'speed', 'volume'];

    for (const locale of ['en']) {
        for (const catId of popularCategories) {
            const cat = getCategoryById(catId);
            if (!cat) continue;
            const topUnits = cat.units.slice(0, 6);
            for (const from of topUnits) {
                for (const to of topUnits) {
                    if (from.id !== to.id) {
                        params.push({ lang: locale, category: catId, conversion: `${from.id}-to-${to.id}` });
                    }
                }
            }
        }
    }
    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; category: string; conversion: string }> }): Promise<Metadata> {
    const { lang, category: catId, conversion } = await params;
    const dict = await getDictionary(lang as Locale);
    const resolved = resolveSlug(conversion, catId);
    if (!resolved) return {};

    const { cat, fromUnit, toUnit, value, hasValue } = resolved;
    const result = convert(value, fromUnit.id, toUnit.id, cat);

    // Use dynamic SEO title/description when a value is present
    if (hasValue) {
        const title = t(dict.seo.dynamicTitle, {
            value: value.toString(),
            from: fromUnit.symbol,
            to: toUnit.symbol,
            result: formatNumber(result.result),
            fromName: fromUnit.name,
            toName: toUnit.name,
        });
        const description = t(dict.seo.dynamicDescription, {
            value: value.toString(),
            fromName: fromUnit.name,
            result: formatNumber(result.result),
            toName: toUnit.name,
            from: fromUnit.symbol,
            to: toUnit.symbol,
        });
        return {
            title,
            description,
            alternates: {
                canonical: `https://osconverter.com/${lang}/${catId}/${conversion}`,
                languages: Object.fromEntries(
                    locales.map((l) => [l, `https://osconverter.com/${l}/${catId}/${conversion}`])
                ),
            },
            openGraph: { title, description, url: `https://osconverter.com/${lang}/${catId}/${conversion}` },
            twitter: { card: 'summary', title, description },
        };
    }

    // Standard converter page metadata
    const title = t(dict.seo.converterTitle, {
        from: fromUnit.name,
        to: toUnit.name,
        category: cat.name,
    });
    const description = t(dict.seo.converterDescription, {
        from: fromUnit.name,
        to: toUnit.name,
        value: '1',
        fromSymbol: fromUnit.symbol,
        result: formatNumber(result.result),
        toSymbol: toUnit.symbol,
    });

    return {
        title,
        description,
        alternates: {
            canonical: `https://osconverter.com/${lang}/${catId}/${conversion}`,
            languages: Object.fromEntries(
                locales.map((l) => [l, `https://osconverter.com/${l}/${catId}/${conversion}`])
            ),
        },
        openGraph: { title, description, url: `https://osconverter.com/${lang}/${catId}/${conversion}` },
        twitter: { card: 'summary', title, description },
    };
}

export default async function ConversionPage({ params }: { params: Promise<{ lang: string; category: string; conversion: string }> }) {
    const { lang, category: catId, conversion } = await params;
    const dict = await getDictionary(lang as Locale);
    const resolved = resolveSlug(conversion, catId);
    if (!resolved) notFound();

    const { cat, fromUnit, toUnit, value, hasValue } = resolved;
    const defaultResult = convert(value, fromUnit.id, toUnit.id, cat);
    const table = generateConversionTable(fromUnit.id, toUnit.id, cat);
    const related = getRelatedConversions(catId, fromUnit.id, toUnit.id, 8);

    // Page heading changes based on whether there's a value
    const pageTitle = hasValue
        ? `${value} ${fromUnit.name} to ${toUnit.name}`
        : t(dict.converter.howToConvert, { from: fromUnit.name, to: toUnit.name });

    return (
        <div className="container" style={{ paddingTop: 'var(--space-2xl)' }}>
            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <Link href={`/${lang}`}>Home</Link>
                <span className="breadcrumb-sep">/</span>
                <Link href={`/${lang}/${catId}`}>{cat.name}</Link>
                <span className="breadcrumb-sep">/</span>
                {hasValue ? (
                    <span>{value} {fromUnit.symbol} → {toUnit.symbol}</span>
                ) : (
                    <span>{fromUnit.name} → {toUnit.name}</span>
                )}
            </nav>

            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-xl)' }}>
                {pageTitle}
            </h1>

            {/* Show prominent result for value-prefixed URLs */}
            {hasValue && (
                <div className="converter-widget" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div className="converter-result">
                        <div className="converter-result-value">
                            {value} {fromUnit.symbol} = {formatNumber(defaultResult.result)} {toUnit.symbol}
                        </div>
                        <div className="converter-result-label">
                            {fromUnit.name} → {toUnit.name}
                        </div>
                    </div>
                    <div className="converter-formula" style={{ marginTop: 'var(--space-lg)' }}>
                        <h3>{dict.converter.formula}</h3>
                        <code>{defaultResult.formula}</code>
                    </div>
                </div>
            )}

            {/* Ad slot */}
            <div className="ad-slot" style={{ marginBottom: 'var(--space-xl)' }}>{dict.ad.label}</div>

            {/* Interactive Converter Widget - Client Component */}
            <ConverterClient
                categoryId={catId}
                fromUnitId={fromUnit.id}
                toUnitId={toUnit.id}
                units={cat.units.map((u) => ({ id: u.id, name: u.name, symbol: u.symbol }))}
                defaultValue={value}
                defaultResult={defaultResult.result}
                formula={defaultResult.formula}
                isTemperature={catId === 'temperature'}
                lang={lang}
                dict={dict}
            />

            {/* Ad slot */}
            <div className="ad-slot" style={{ margin: 'var(--space-xl) 0' }}>{dict.ad.label}</div>

            {/* Conversion Table */}
            <section style={{ marginBottom: 'var(--space-2xl)' }}>
                <h2 className="section-title">{dict.converter.conversionTable}</h2>
                <table className="conversion-table">
                    <thead>
                        <tr>
                            <th>{fromUnit.name} ({fromUnit.symbol})</th>
                            <th>{toUnit.name} ({toUnit.symbol})</th>
                        </tr>
                    </thead>
                    <tbody>
                        {table.map((row) => (
                            <tr key={row.value}>
                                <td>{row.value} {fromUnit.symbol}</td>
                                <td>{formatNumber(row.result)} {toUnit.symbol}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Related Conversions */}
            <section style={{ marginBottom: 'var(--space-2xl)' }}>
                <h2 className="section-title">{dict.converter.relatedConversions}</h2>
                <div className="related-grid">
                    {related.map((r) => {
                        const rFrom = cat.units.find((u) => u.id === r.fromId);
                        const rTo = cat.units.find((u) => u.id === r.toId);
                        if (!rFrom || !rTo) return null;
                        return (
                            <Link key={r.slug} href={`/${lang}/${catId}/${r.slug}`} className="related-link">
                                {rFrom.name} → {rTo.name}
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Unit Explanations */}
            <section style={{ marginBottom: 'var(--space-2xl)' }}>
                <h2 className="section-title">{dict.converter.unitExplanation}</h2>
                <div className="grid-2">
                    <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
                            {fromUnit.name} ({fromUnit.symbol})
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                            The {fromUnit.name.toLowerCase()} is a unit of {cat.name.toLowerCase()}.
                            Its symbol is {fromUnit.symbol}.
                        </p>
                    </div>
                    <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
                            {toUnit.name} ({toUnit.symbol})
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                            The {toUnit.name.toLowerCase()} is a unit of {cat.name.toLowerCase()}.
                            Its symbol is {toUnit.symbol}.
                        </p>
                    </div>
                </div>
            </section>

            {/* JSON-LD schemas */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            { '@type': 'ListItem', position: 1, name: 'Home', item: `https://osconverter.com/${lang}` },
                            { '@type': 'ListItem', position: 2, name: cat.name, item: `https://osconverter.com/${lang}/${catId}` },
                            { '@type': 'ListItem', position: 3, name: `${fromUnit.name} to ${toUnit.name}`, item: `https://osconverter.com/${lang}/${catId}/${conversion}` },
                        ],
                    }),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'HowTo',
                        name: `How to convert ${fromUnit.name} to ${toUnit.name}`,
                        step: [
                            { '@type': 'HowToStep', text: `Enter the value in ${fromUnit.name} (${fromUnit.symbol}).` },
                            { '@type': 'HowToStep', text: `Apply the conversion formula: ${defaultResult.formula}` },
                            { '@type': 'HowToStep', text: `Get the result in ${toUnit.name} (${toUnit.symbol}).` },
                        ],
                    }),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: [
                            {
                                '@type': 'Question',
                                name: hasValue
                                    ? `What is ${value} ${fromUnit.name.toLowerCase()} in ${toUnit.name.toLowerCase()}?`
                                    : `How many ${toUnit.name.toLowerCase()}s are in 1 ${fromUnit.name.toLowerCase()}?`,
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: hasValue
                                        ? `${value} ${fromUnit.name} is equal to ${formatNumber(defaultResult.result)} ${toUnit.name}.`
                                        : `1 ${fromUnit.name} equals ${formatNumber(defaultResult.result)} ${toUnit.name}.`,
                                },
                            },
                            {
                                '@type': 'Question',
                                name: `What is the formula to convert ${fromUnit.name.toLowerCase()} to ${toUnit.name.toLowerCase()}?`,
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: defaultResult.formula,
                                },
                            },
                        ],
                    }),
                }}
            />
        </div>
    );
}
