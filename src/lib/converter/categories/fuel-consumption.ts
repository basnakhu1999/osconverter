import { Category } from '../types';

export const fuelConsumption: Category = {
    id: 'fuel-consumption',
    name: 'Fuel Consumption',
    icon: '⛽',
    description: 'Convert between fuel consumption units such as L/100km, MPG, km/L and more.',
    baseUnit: 'liter-per-100km',
    units: [
        { id: 'liter-per-100km', name: 'Liter per 100 km', symbol: 'L/100km', factor: 1 },
        { id: 'mpg-us', name: 'Miles per Gallon (US)', symbol: 'mpg', factor: 235.215 },
        { id: 'mpg-uk', name: 'Miles per Gallon (UK)', symbol: 'mpg (imp)', factor: 282.481 },
        { id: 'km-per-liter', name: 'Kilometer per Liter', symbol: 'km/L', factor: 100 },
        { id: 'mile-per-liter', name: 'Mile per Liter', symbol: 'mi/L', factor: 62.1371 },
        { id: 'gallon-per-100-miles', name: 'Gallon per 100 Miles', symbol: 'gal/100mi', factor: 2.35215 },
        { id: 'liter-per-mile', name: 'Liter per Mile', symbol: 'L/mi', factor: 0.621371 },
        { id: 'gallon-per-mile', name: 'US Gallon per Mile', symbol: 'gal/mi', factor: 0.0235215 },
        { id: 'meter-per-liter', name: 'Meter per Liter', symbol: 'm/L', factor: 100000 },
        { id: 'nautical-mile-per-liter', name: 'Nautical Mile per Liter', symbol: 'nmi/L', factor: 54.0 },
    ],
};
