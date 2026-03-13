// Core types for the conversion engine

export interface Unit {
    id: string;
    name: string;
    symbol: string;
    factor: number; // relative to base unit (1 = base unit)
}

export interface TemperatureUnit extends Omit<Unit, 'factor'> {
    toBase: (value: number) => number;   // convert to Kelvin
    fromBase: (value: number) => number; // convert from Kelvin
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    description: string;
    baseUnit: string; // id of the base unit
    units: Unit[];
}

export interface TemperatureCategory extends Omit<Category, 'units'> {
    units: TemperatureUnit[];
}

export interface ConversionResult {
    value: number;
    fromUnit: Unit | TemperatureUnit;
    toUnit: Unit | TemperatureUnit;
    result: number;
    formula: string;
    categoryId: string;
}

export interface ConversionPair {
    fromId: string;
    toId: string;
    categoryId: string;
    slug: string; // e.g., "cm-to-meter"
}

export type AnyCategory = Category | TemperatureCategory;
