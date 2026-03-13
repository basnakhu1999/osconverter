import { Category } from '../types';

export const density: Category = {
    id: 'density',
    name: 'Density',
    icon: '🧱',
    description: 'Convert between density units such as kg/m³, g/cm³, lb/ft³ and more.',
    baseUnit: 'kilogram-per-cubic-meter',
    units: [
        { id: 'kilogram-per-cubic-meter', name: 'Kilogram per Cubic Meter', symbol: 'kg/m³', factor: 1 },
        { id: 'gram-per-cubic-centimeter', name: 'Gram per Cubic Centimeter', symbol: 'g/cm³', factor: 1000 },
        { id: 'gram-per-liter', name: 'Gram per Liter', symbol: 'g/L', factor: 1 },
        { id: 'kilogram-per-liter', name: 'Kilogram per Liter', symbol: 'kg/L', factor: 1000 },
        { id: 'gram-per-milliliter', name: 'Gram per Milliliter', symbol: 'g/mL', factor: 1000 },
        { id: 'milligram-per-liter', name: 'Milligram per Liter', symbol: 'mg/L', factor: 0.001 },
        { id: 'pound-per-cubic-foot', name: 'Pound per Cubic Foot', symbol: 'lb/ft³', factor: 16.01846 },
        { id: 'pound-per-cubic-inch', name: 'Pound per Cubic Inch', symbol: 'lb/in³', factor: 27679.9 },
        { id: 'pound-per-gallon-us', name: 'Pound per US Gallon', symbol: 'lb/gal', factor: 119.8264 },
        { id: 'pound-per-gallon-uk', name: 'Pound per Imperial Gallon', symbol: 'lb/imp gal', factor: 99.7764 },
        { id: 'ounce-per-cubic-inch', name: 'Ounce per Cubic Inch', symbol: 'oz/in³', factor: 1729.994 },
        { id: 'ton-per-cubic-meter', name: 'Ton per Cubic Meter', symbol: 't/m³', factor: 1000 },
        { id: 'slug-per-cubic-foot', name: 'Slug per Cubic Foot', symbol: 'slug/ft³', factor: 515.379 },
        { id: 'grain-per-gallon', name: 'Grain per Gallon', symbol: 'gr/gal', factor: 0.017118 },
        { id: 'microgram-per-liter', name: 'Microgram per Liter', symbol: 'μg/L', factor: 1e-6 },
    ],
};
