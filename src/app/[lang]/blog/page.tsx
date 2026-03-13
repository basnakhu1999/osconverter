import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { type Locale } from '@/lib/i18n/config';
import { blogPosts } from '@/lib/blog/data';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);
    return {
        title: dict.blog.title,
        description: 'Learn about unit conversion, measurement systems, and conversion formulas.',
    };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);

    return (
        <div className="container" style={{ paddingTop: 'var(--space-2xl)' }}>
            <nav className="breadcrumb">
                <Link href={`/${lang}`}>Home</Link>
                <span className="breadcrumb-sep">/</span>
                <span>{dict.blog.title}</span>
            </nav>

            <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-2xl)' }}>
                {dict.blog.title}
            </h1>

            <div className="ad-slot" style={{ marginBottom: 'var(--space-2xl)' }}>{dict.ad.label}</div>

            <div className="grid-3">
                {blogPosts.map((post) => (
                    <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                        <div className="blog-card">
                            <div className="badge" style={{ marginBottom: 'var(--space-sm)' }}>{post.readTime}</div>
                            <h2 style={{ color: 'var(--text-primary)' }}>{post.title}</h2>
                            <p>{post.excerpt}</p>
                            <div style={{ marginTop: 'var(--space-md)', color: 'var(--accent-primary)', fontSize: 'var(--text-sm)' }}>
                                {dict.blog.readMore} →
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
