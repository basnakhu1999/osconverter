import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'OSConverter — Free Online Unit Converter',
    description: 'Convert any unit instantly with OSConverter.',
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
