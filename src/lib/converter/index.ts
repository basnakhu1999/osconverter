import { Category, TemperatureCategory, AnyCategory, Unit, TemperatureUnit, ConversionPair } from './types';

// Import all categories
import { length } from './categories/length';
import { weight } from './categories/weight';
import { temperature } from './categories/temperature';
import { speed } from './categories/speed';
import { volume } from './categories/volume';
import { area } from './categories/area';
import { pressure } from './categories/pressure';
import { energy } from './categories/energy';
import { power } from './categories/power';
import { density } from './categories/density';
import { torque } from './categories/torque';
import { force } from './categories/force';
import { angle } from './categories/angle';
import { frequency } from './categories/frequency';
import { dataSize } from './categories/data-size';
import { bitrate } from './categories/bitrate';
import { resolution } from './categories/resolution';
import { pixelDensity } from './categories/pixel-density';
import { cooking } from './categories/cooking';
import { fuelConsumption } from './categories/fuel-consumption';
import { time } from './categories/time';
import { currency } from './categories/currency';
import { voltage, current, resistance, magneticField } from './categories/engineering';

// Re-export conversion engine
export { convert, formatNumber, generateConversionTable } from './engine';
export type { Category, TemperatureCategory, AnyCategory, Unit, TemperatureUnit, ConversionResult, ConversionPair } from './types';

// Grouped categories for navigation
export const categoryGroups = {
    physics: {
        name: 'Physics',
        icon: '⚛️',
        categories: [length, weight, temperature, speed, volume, area, pressure, energy, power, density, torque, force, angle, frequency],
    },
    digital: {
        name: 'Digital',
        icon: '💻',
        categories: [dataSize, bitrate, resolution, pixelDensity],
    },
    dailyLife: {
        name: 'Daily Life',
        icon: '🏠',
        categories: [cooking, fuelConsumption, time, currency],
    },
    engineering: {
        name: 'Engineering',
        icon: '🔧',
        categories: [voltage, current, resistance, magneticField],
    },
};

// Flat list of all categories
export const allCategories: AnyCategory[] = [
    length, weight, temperature, speed, volume, area, pressure, energy, power,
    density, torque, force, angle, frequency,
    dataSize, bitrate, resolution, pixelDensity,
    cooking, fuelConsumption, time, currency,
    voltage, current, resistance, magneticField,
];

// Lookup helpers
export function getCategoryById(id: string): AnyCategory | undefined {
    return allCategories.find((c) => c.id === id);
}

export function getUnitById(categoryId: string, unitId: string): Unit | TemperatureUnit | undefined {
    const cat = getCategoryById(categoryId);
    if (!cat) return undefined;
    return cat.units.find((u) => u.id === unitId);
}

export function getCategoryByUnitId(unitId: string): AnyCategory | undefined {
    return allCategories.find((c) => c.units.some((u) => u.id === unitId));
}

// Generate URL-friendly slug for a conversion pair
export function getConversionSlug(fromUnit: Unit | TemperatureUnit, toUnit: Unit | TemperatureUnit): string {
    return `${fromUnit.id}-to-${toUnit.id}`;
}

// Parse a conversion slug back to unit IDs
export function parseConversionSlug(slug: string): { fromId: string; toId: string } | null {
    const match = slug.match(/^(.+)-to-(.+)$/);
    if (!match) return null;
    return { fromId: match[1], toId: match[2] };
}

// Parse a value-prefixed conversion slug like "100-cm-to-m"
// Returns value + resolved unit IDs (aliases resolved within the given category)
export function parseValueConversionSlug(
    slug: string,
    category: AnyCategory
): { value: number; fromId: string; toId: string } | null {
    // Pattern: "100-cm-to-m" or "50.5-kg-to-lb"
    const match = slug.match(/^(\d+(?:\.\d+)?)-(.+)-to-(.+)$/);
    if (!match) return null;

    const value = parseFloat(match[1]);
    const fromAlias = match[2];
    const toAlias = match[3];

    // Resolve aliases within this category
    const fromUnit = findUnitInCategory(category, fromAlias);
    const toUnit = findUnitInCategory(category, toAlias);

    if (!fromUnit || !toUnit) return null;
    return { value, fromId: fromUnit.id, toId: toUnit.id };
}

// Check if a slug contains a numeric value prefix
export function slugHasValue(slug: string): boolean {
    return /^\d+(?:\.\d+)?-/.test(slug);
}

// Find a unit within a specific category by ID, symbol, alias, or name
export function findUnitInCategory(
    category: AnyCategory,
    query: string
): Unit | TemperatureUnit | undefined {
    const q = query.toLowerCase();
    const resolvedId = resolveUnitAlias(q);

    return category.units.find(
        (u) =>
            u.id === q ||
            u.id === resolvedId ||
            u.symbol.toLowerCase() === q ||
            u.name.toLowerCase() === q ||
            u.name.toLowerCase().replace(/\s+/g, '-') === q ||
            u.name.toLowerCase().replace(/\s+/g, '') === q
    );
}

// Get all conversion pairs for a category (for sitemap generation)
export function getAllConversionPairs(category: AnyCategory): ConversionPair[] {
    const pairs: ConversionPair[] = [];
    for (const from of category.units) {
        for (const to of category.units) {
            if (from.id !== to.id) {
                pairs.push({
                    fromId: from.id,
                    toId: to.id,
                    categoryId: category.id,
                    slug: `${from.id}-to-${to.id}`,
                });
            }
        }
    }
    return pairs;
}

// Get related conversions for internal linking
export function getRelatedConversions(
    categoryId: string,
    fromUnitId: string,
    toUnitId: string,
    limit: number = 8
): ConversionPair[] {
    const cat = getCategoryById(categoryId);
    if (!cat) return [];

    const related: ConversionPair[] = [];

    // Same fromUnit, different toUnit
    for (const unit of cat.units) {
        if (unit.id !== toUnitId && unit.id !== fromUnitId) {
            related.push({
                fromId: fromUnitId,
                toId: unit.id,
                categoryId,
                slug: `${fromUnitId}-to-${unit.id}`,
            });
        }
        if (related.length >= limit / 2) break;
    }

    // Same toUnit, different fromUnit
    for (const unit of cat.units) {
        if (unit.id !== fromUnitId && unit.id !== toUnitId) {
            related.push({
                fromId: unit.id,
                toId: toUnitId,
                categoryId,
                slug: `${unit.id}-to-${toUnitId}`,
            });
        }
        if (related.length >= limit) break;
    }

    return related.slice(0, limit);
}

// Total unit count
export function getTotalUnitCount(): number {
    return allCategories.reduce((sum, cat) => sum + cat.units.length, 0);
}

// Total conversion pair count
export function getTotalConversionCount(): number {
    return allCategories.reduce((sum, cat) => sum + cat.units.length * (cat.units.length - 1), 0);
}

// Parse natural language query like "100 cm to m"
export function parseSearchQuery(query: string): {
    value: number;
    fromUnitId: string;
    toUnitId: string;
    categoryId: string;
} | null {
    const normalized = query.trim().toLowerCase();

    // Pattern: "100 cm to m" or "100cm to m"
    const match = normalized.match(/^(\d+\.?\d*)\s*(.+?)\s+(?:to|in|into|=)\s+(.+)$/);
    if (!match) return null;

    const value = parseFloat(match[1]);
    const fromQuery = match[2].trim();
    const toQuery = match[3].trim();

    // Search for matching units across all categories
    for (const cat of allCategories) {
        const fromUnit = findUnitByQuery(cat, fromQuery);
        const toUnit = findUnitByQuery(cat, toQuery);

        if (fromUnit && toUnit) {
            return {
                value,
                fromUnitId: fromUnit.id,
                toUnitId: toUnit.id,
                categoryId: cat.id,
            };
        }
    }

    return null;
}

function findUnitByQuery(category: AnyCategory, query: string): Unit | TemperatureUnit | undefined {
    const q = query.toLowerCase();
    return category.units.find(
        (u) =>
            u.id === q ||
            u.symbol.toLowerCase() === q ||
            u.name.toLowerCase() === q ||
            u.name.toLowerCase().replace(/\s+/g, '') === q
    );
}

// Short aliases for common unit symbols (for URL parsing)
export const unitAliases: Record<string, string> = {
    'm': 'meter',
    'cm': 'centimeter',
    'mm': 'millimeter',
    'km': 'kilometer',
    'in': 'inch',
    'ft': 'foot',
    'yd': 'yard',
    'mi': 'mile',
    'nmi': 'nautical-mile',
    'kg': 'kilogram',
    'g': 'gram',
    'mg': 'milligram',
    'lb': 'pound',
    'oz': 'ounce',
    'st': 'stone',
    't': 'metric-ton',
    'c': 'celsius',
    'f': 'fahrenheit',
    'k': 'kelvin',
    'r': 'rankine',
    'mph': 'mile-per-hour',
    'kph': 'kilometer-per-hour',
    'kmh': 'kilometer-per-hour',
    'kn': 'knot',
    'mps': 'meter-per-second',
    'l': 'liter',
    'ml': 'milliliter',
    'gal': 'gallon-us',
    'qt': 'quart-us',
    'pt': 'pint-us',
    'floz': 'fluid-ounce-us',
    'tbsp': 'tablespoon-us',
    'tsp': 'teaspoon-us',
    'pa': 'pascal',
    'kpa': 'kilopascal',
    'mpa': 'megapascal',
    'bar': 'bar',
    'atm': 'atmosphere',
    'psi': 'psi',
    'j': 'joule',
    'kj': 'kilojoule',
    'mj': 'megajoule',
    'cal': 'calorie',
    'kcal': 'kilocalorie',
    'kwh': 'kilowatt-hour',
    'btu': 'btu',
    'w': 'watt',
    'kw': 'kilowatt',
    'mw': 'megawatt',
    'hp': 'horsepower',
    'hz': 'hertz',
    'khz': 'kilohertz',
    'mhz': 'megahertz',
    'ghz': 'gigahertz',
    'b': 'byte',
    'kb': 'kilobyte',
    'mb': 'megabyte',
    'gb': 'gigabyte',
    'tb': 'terabyte',
    'pb': 'petabyte',
    'bps': 'bit-per-second',
    'kbps': 'kilobit-per-second',
    'mbps': 'megabit-per-second',
    'gbps': 'gigabit-per-second',
    'v': 'volt',
    'mv': 'millivolt',
    'kv': 'kilovolt',
    'a': 'ampere',
    'ma': 'milliampere',
    'ohm': 'ohm',
};

// Resolve unit alias to full unit ID
export function resolveUnitAlias(alias: string): string {
    return unitAliases[alias.toLowerCase()] || alias;
}
