import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { type Locale } from '@/lib/i18n/config';
import {
    allCategories,
    categoryGroups,
    getTotalUnitCount,
    getTotalConversionCount,
} from '@/lib/converter';
import { t } from '@/lib/i18n/getDictionary';

const popularConversions = [
    { from: 'cm', to: 'meter', cat: 'length', label: 'Centimeter to Meter' },
    { from: 'kg', to: 'pound', cat: 'weight', label: 'Kilogram to Pound' },
    { from: 'celsius', to: 'fahrenheit', cat: 'temperature', label: 'Celsius to Fahrenheit' },
    { from: 'mile', to: 'kilometer', cat: 'length', label: 'Mile to Kilometer' },
    { from: 'gallon-us', to: 'liter', cat: 'volume', label: 'Gallon to Liter' },
    { from: 'inch', to: 'centimeter', cat: 'length', label: 'Inch to Centimeter' },
    { from: 'pound', to: 'kilogram', cat: 'weight', label: 'Pound to Kilogram' },
    { from: 'fahrenheit', to: 'celsius', cat: 'temperature', label: 'Fahrenheit to Celsius' },
    { from: 'kilometer', to: 'mile', cat: 'length', label: 'Kilometer to Mile' },
    { from: 'ounce', to: 'gram', cat: 'weight', label: 'Ounce to Gram' },
    { from: 'foot', to: 'meter', cat: 'length', label: 'Foot to Meter' },
    { from: 'kilowatt-hour', to: 'joule', cat: 'energy', label: 'kWh to Joule' },
];

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);
    const unitCount = getTotalUnitCount();
    const conversionCount = getTotalConversionCount();

    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <h1 className="hero-title animate-fade-in">
                        <span className="hero-title-gradient">{dict.home.heroTitle}</span>
                    </h1>
                    <p className="hero-subtitle animate-fade-in">
                        {dict.home.heroSubtitle}
                    </p>


                    {/* Stats */}
                    <div className="stats-row animate-slide-up">
                        <div className="stat-item">
                            <div className="stat-value">{unitCount.toLocaleString()}+</div>
                            <div className="stat-label">{dict.home.statsUnits}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{allCategories.length}</div>
                            <div className="stat-label">{dict.home.statsCategories}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{(conversionCount).toLocaleString()}+</div>
                            <div className="stat-label">{dict.home.statsConversions}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">5</div>
                            <div className="stat-label">{dict.home.statsLanguages}</div>
                        </div>
                    </div>

                    {/* Ad slot */}
                    <div className="ad-slot" style={{ maxWidth: '728px', margin: '0 auto var(--space-3xl)' }}>
                        {dict.ad.label}
                    </div>

                    {/* Popular Conversions */}
                    <section style={{ marginBottom: 'var(--space-4xl)' }}>
                        <h2 className="section-title">{dict.home.popularTitle}</h2>
                        <div className="popular-list">
                            {popularConversions.map((c) => (
                                <Link
                                    key={`${c.from}-${c.to}`}
                                    href={`/${lang}/${c.cat}/${c.from}-to-${c.to}`}
                                    className="popular-item"
                                >
                                    <span>{c.label}</span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Categories by Group - Premium Layout */}
                    <div className="category-groups">
                        {Object.entries(categoryGroups).map(([key, group]) => (
                            <section key={key} className="category-group">
                                <div className="category-group-header">
                                    <span className="category-group-icon">{group.icon}</span>
                                    <h2 className="category-group-title">
                                        {(dict.groups as Record<string, string>)[key] || group.name}
                                    </h2>
                                    <span className="category-group-count">
                                        {group.categories.reduce((sum, c) => sum + c.units.length, 0)} {dict.home.statsUnits.toLowerCase()}
                                    </span>
                                </div>
                                <div className="category-group-grid">
                                    {group.categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/${lang}/${cat.id}`}
                                            className="category-item"
                                        >
                                            <span className="category-item-icon">{cat.icon}</span>
                                            <div className="category-item-info">
                                                <span className="category-item-name">{cat.name}</span>
                                                <span className="category-item-count">{cat.units.length} {dict.home.statsUnits.toLowerCase()}</span>
                                            </div>
                                            <span className="category-item-arrow">→</span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </section>

            {/* JSON-LD for homepage */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            { '@type': 'ListItem', position: 1, name: 'Home', item: `https://osconverter.com/${lang}` },
                        ],
                    }),
                }}
            />
        </>
    );
}
