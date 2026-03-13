import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { type Locale } from '@/lib/i18n/config';
import { blogPosts } from '@/lib/blog/data';

export async function generateStaticParams() {
    return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) return {};
    return {
        title: post.title,
        description: post.excerpt,
        openGraph: { title: post.title, description: post.excerpt },
    };
}

export default async function BlogPost({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang as Locale);
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) notFound();

    return (
        <div className="blog-content">
            <nav className="breadcrumb">
                <Link href={`/${lang}`}>Home</Link>
                <span className="breadcrumb-sep">/</span>
                <Link href={`/${lang}/blog`}>{dict.blog.title}</Link>
                <span className="breadcrumb-sep">/</span>
                <span>{post.title}</span>
            </nav>

            <article>
                <div style={{ marginBottom: 'var(--space-xl)' }}>
                    <div className="badge" style={{ marginBottom: 'var(--space-sm)' }}>{post.readTime}</div>
                    <h1>{post.title}</h1>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>{post.date}</p>
                </div>

                <div className="ad-slot" style={{ marginBottom: 'var(--space-xl)' }}>{dict.ad.label}</div>

                <div
                    style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(post.content) }}
                />

                <div className="ad-slot" style={{ marginTop: 'var(--space-xl)' }}>{dict.ad.label}</div>

                <div style={{ marginTop: 'var(--space-2xl)' }}>
                    <Link href={`/${lang}/blog`} className="btn btn-secondary">
                        {dict.blog.backToBlog}
                    </Link>
                </div>
            </article>
        </div>
    );
}

function simpleMarkdownToHtml(md: string): string {
    return md
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
        .replace(/^\| (.+) \|$/gm, (match) => {
            const cells = match.split('|').filter(Boolean).map((c) => c.trim());
            return '<tr>' + cells.map((c) => `<td>${c}</td>`).join('') + '</tr>';
        })
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.+)$/gm, (line) => {
            if (line.startsWith('<')) return line;
            return line;
        });
}
