import { Category, TemperatureCategory, TemperatureUnit, Unit, ConversionResult } from './types';

/**
 * Core conversion engine - no external libraries.
 * Uses base-unit factor math: result = value × fromFactor ÷ toFactor
 * Temperature uses special conversion functions (non-linear).
 */

export function convert(
    value: number,
    fromUnitId: string,
    toUnitId: string,
    category: Category | TemperatureCategory
): ConversionResult {
    if (category.id === 'temperature') {
        return convertTemperature(value, fromUnitId, toUnitId, category as TemperatureCategory);
    }

    const cat = category as Category;
    const fromUnit = cat.units.find((u) => u.id === fromUnitId);
    const toUnit = cat.units.find((u) => u.id === toUnitId);

    if (!fromUnit || !toUnit) {
        throw new Error(`Unit not found: ${fromUnitId} or ${toUnitId}`);
    }

    const result = (value * fromUnit.factor) / toUnit.factor;
    const formula = `${value} ${fromUnit.symbol} × ${fromUnit.factor} ÷ ${toUnit.factor} = ${formatNumber(result)} ${toUnit.symbol}`;

    return {
        value,
        fromUnit,
        toUnit,
        result,
        formula,
        categoryId: category.id,
    };
}

function convertTemperature(
    value: number,
    fromUnitId: string,
    toUnitId: string,
    category: TemperatureCategory
): ConversionResult {
    const fromUnit = category.units.find((u) => u.id === fromUnitId);
    const toUnit = category.units.find((u) => u.id === toUnitId);

    if (!fromUnit || !toUnit) {
        throw new Error(`Temperature unit not found: ${fromUnitId} or ${toUnitId}`);
    }

    // Convert: fromUnit → Kelvin → toUnit
    const baseValue = fromUnit.toBase(value);
    const result = toUnit.fromBase(baseValue);

    const formula = getTemperatureFormula(value, fromUnit, toUnit, result);

    return {
        value,
        fromUnit,
        toUnit,
        result,
        formula,
        categoryId: category.id,
    };
}

function getTemperatureFormula(
    value: number,
    from: TemperatureUnit,
    to: TemperatureUnit,
    result: number
): string {
    const formulaMap: Record<string, string> = {
        'celsius-fahrenheit': `(${value}°C × 9/5) + 32 = ${formatNumber(result)}°F`,
        'fahrenheit-celsius': `(${value}°F − 32) × 5/9 = ${formatNumber(result)}°C`,
        'celsius-kelvin': `${value}°C + 273.15 = ${formatNumber(result)}K`,
        'kelvin-celsius': `${value}K − 273.15 = ${formatNumber(result)}°C`,
        'fahrenheit-kelvin': `(${value}°F − 32) × 5/9 + 273.15 = ${formatNumber(result)}K`,
        'kelvin-fahrenheit': `(${value}K − 273.15) × 9/5 + 32 = ${formatNumber(result)}°F`,
    };

    const key = `${from.id}-${to.id}`;
    return formulaMap[key] || `${value} ${from.symbol} = ${formatNumber(result)} ${to.symbol}`;
}

export function formatNumber(num: number): string {
    if (Number.isInteger(num)) return num.toString();
    if (Math.abs(num) >= 1) return parseFloat(num.toFixed(6)).toString();
    if (Math.abs(num) >= 0.001) return parseFloat(num.toFixed(8)).toString();
    return num.toExponential(6);
}

export function generateConversionTable(
    fromUnitId: string,
    toUnitId: string,
    category: Category | TemperatureCategory,
    values?: number[]
): { value: number; result: number }[] {
    const defaults = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
    const vals = values || defaults;

    return vals.map((v) => {
        const res = convert(v, fromUnitId, toUnitId, category);
        return { value: v, result: res.result };
    });
}
