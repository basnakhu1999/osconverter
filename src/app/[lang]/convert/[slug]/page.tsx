import { redirect, notFound } from 'next/navigation';
import {
    allCategories,
    resolveUnitAlias,
    findUnitInCategory,
} from '@/lib/converter';

export const revalidate = 86400;

/**
 * /[lang]/convert/100-cm-to-m → redirects to /[lang]/length/100-cm-to-m
 * This keeps the /convert/ route working but redirects to the better
 * category-based URL structure for SEO.
 */
function parseSlug(slug: string) {
    // Pattern: "100-cm-to-m"
    const match = slug.match(/^(\d+(?:\.\d+)?)-(.+)-to-(.+)$/);
    if (!match) return null;
    return { value: match[1], fromAlias: match[2], toAlias: match[3] };
}

function findCategory(fromAlias: string, toAlias: string) {
    const fromId = resolveUnitAlias(fromAlias);
    const toId = resolveUnitAlias(toAlias);

    for (const cat of allCategories) {
        const fromUnit = findUnitInCategory(cat, fromAlias) || cat.units.find((u) => u.id === fromId);
        const toUnit = findUnitInCategory(cat, toAlias) || cat.units.find((u) => u.id === toId);
        if (fromUnit && toUnit) {
            return { category: cat, fromUnit, toUnit };
        }
    }
    return null;
}

export default async function ConvertRedirectPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const { lang, slug } = await params;
    const parsed = parseSlug(slug);
    if (!parsed) notFound();

    const found = findCategory(parsed.fromAlias, parsed.toAlias);
    if (!found) notFound();

    // 301 redirect to the category-based URL
    redirect(`/${lang}/${found.category.id}/${slug}`);
}
