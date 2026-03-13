import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="container" style={{
            textAlign: 'center',
            paddingTop: 'var(--space-4xl)',
            paddingBottom: 'var(--space-4xl)',
        }}>
            <h1 style={{
                fontSize: 'var(--text-6xl)',
                fontWeight: 900,
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 'var(--space-lg)',
            }}>
                404
            </h1>
            <p style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-xl)',
                marginBottom: 'var(--space-xl)',
            }}>
                Page not found
            </p>
            <Link href="/en" className="btn btn-primary">
                ← Go Home
            </Link>
        </div>
    );
}
