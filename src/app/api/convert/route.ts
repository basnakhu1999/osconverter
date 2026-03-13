import { NextResponse } from 'next/server';
import { getCategoryById, convert, formatNumber } from '@/lib/converter';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const valueStr = searchParams.get('value');

    if (!categoryId || !from || !to || !valueStr) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const value = parseFloat(valueStr);
    if (isNaN(value)) {
        return NextResponse.json({ error: 'Invalid value' }, { status: 400 });
    }

    const category = getCategoryById(categoryId);
    if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    try {
        const result = convert(value, from, to, category);
        return NextResponse.json({
            value: result.value,
            result: result.result,
            formula: result.formula,
            fromUnit: { id: result.fromUnit.id, name: result.fromUnit.name, symbol: result.fromUnit.symbol },
            toUnit: { id: result.toUnit.id, name: result.toUnit.name, symbol: result.toUnit.symbol },
            formattedResult: formatNumber(result.result),
        });
    } catch (error) {
        return NextResponse.json({ error: 'Conversion failed' }, { status: 400 });
    }
}
