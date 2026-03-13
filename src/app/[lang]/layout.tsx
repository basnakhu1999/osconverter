import type { Metadata } from 'next';
import '../globals.css';
import { locales, localeNames, localeFlags, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { allCategories, categoryGroups, getTotalUnitCount, getTotalConversionCount } from '@/lib/converter';
import Link from 'next/link';

export async function generateStaticParams() {
    return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);

    return {
        title: {
            default: dict.seo.homeTitle,
            template: `%s | OSConverter`,
        },
        description: dict.seo.homeDescription,
        metadataBase: new URL('https://osconverter.com'),
        alternates: {
            canonical: `https://osconverter.com/${lang}`,
            languages: Object.fromEntries(
                locales.map((l) => [l, `https://osconverter.com/${l}`])
            ),
        },
        openGraph: {
            title: dict.seo.homeTitle,
            description: dict.seo.homeDescription,
            url: `https://osconverter.com/${lang}`,
            siteName: 'OSConverter',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: dict.seo.homeTitle,
            description: dict.seo.homeDescription,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function LangLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);

    return (
        <html lang={lang} suppressHydrationWarning>
            <head>
                {locales.map((l) => (
                    <link key={l} rel="alternate" hrefLang={l} href={`https://osconverter.com/${l}`} />
                ))}
                <link rel="alternate" hrefLang="x-default" href="https://osconverter.com/en" />
                {/* Analytics */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
                    }}
                />
                {/* Microsoft Clarity */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/XXXXXXXXXX";
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window,document,"clarity","script");
            `,
                    }}
                />
                {/* JSON-LD WebApplication schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebApplication',
                            name: 'OSConverter',
                            url: 'https://osconverter.com',
                            description: dict.site.description,
                            applicationCategory: 'UtilityApplication',
                            operatingSystem: 'Any',
                            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                            inLanguage: locales,
                        }),
                    }}
                />
            </head>
            <body>
                <div className="page-wrapper">
                    {/* Header */}
                    <header className="site-header">
                        <div className="header-inner">
                            <Link href={`/${lang}`} className="header-logo">
                                🔄 <span>OSConverter</span>
                            </Link>

                            <div className="header-search">
                                <span className="header-search-icon">🔍</span>
                                <input
                                    type="text"
                                    placeholder={dict.nav.searchPlaceholder}
                                    id="global-search"
                                />
                            </div>

                            <nav className="header-nav">
                                <Link href={`/${lang}`}>{dict.nav.categories}</Link>
                                <Link href={`/${lang}/blog`}>{dict.nav.blog}</Link>
                                <div className="lang-switcher">
                                    <button className="lang-btn" id="lang-toggle">
                                        {localeFlags[lang as Locale]} {localeNames[lang as Locale]}
                                    </button>
                                </div>
                            </nav>

                            <button className="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu">☰</button>
                        </div>
                    </header>

                    {/* Main content */}
                    <main className="main-content">
                        {children}
                    </main>

                    {/* Footer */}
                    <footer className="site-footer">
                        <div className="footer-inner">
                            <div className="footer-grid">
                                <div className="footer-brand">
                                    <h3>🔄 <span>OSConverter</span></h3>
                                    <p>{dict.footer.description}</p>
                                </div>
                                <div className="footer-col">
                                    <h4>{dict.nav.categories}</h4>
                                    <ul>
                                        {allCategories.slice(0, 8).map((cat) => (
                                            <li key={cat.id}>
                                                <Link href={`/${lang}/${cat.id}`}>{cat.icon} {cat.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="footer-col">
                                    <h4>{dict.nav.languages}</h4>
                                    <ul>
                                        {locales.map((l) => (
                                            <li key={l}>
                                                <Link href={`/${l}`}>{localeFlags[l]} {localeNames[l]}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="footer-col">
                                    <h4>Links</h4>
                                    <ul>
                                        <li><Link href={`/${lang}/blog`}>{dict.footer.about}</Link></li>
                                        <li><Link href={`/${lang}/blog`}>{dict.footer.privacy}</Link></li>
                                        <li><Link href={`/${lang}/blog`}>{dict.footer.contact}</Link></li>
                                        <li><Link href="/sitemap.xml">{dict.footer.sitemap}</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="footer-bottom">
                                <p>{dict.footer.copyright.replace('{year}', new Date().getFullYear().toString())}</p>
                                <div className="ad-slot">{dict.ad.label}</div>
                            </div>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    );
}
