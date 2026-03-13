import { Category } from '../types';

export const speed: Category = {
    id: 'speed',
    name: 'Speed',
    icon: '🚀',
    description: 'Convert between speed and velocity units such as m/s, km/h, mph, knots and more.',
    baseUnit: 'meter-per-second',
    units: [
        { id: 'meter-per-second', name: 'Meter per Second', symbol: 'm/s', factor: 1 },
        { id: 'kilometer-per-hour', name: 'Kilometer per Hour', symbol: 'km/h', factor: 0.277778 },
        { id: 'mile-per-hour', name: 'Mile per Hour', symbol: 'mph', factor: 0.44704 },
        { id: 'knot', name: 'Knot', symbol: 'kn', factor: 0.514444 },
        { id: 'foot-per-second', name: 'Foot per Second', symbol: 'ft/s', factor: 0.3048 },
        { id: 'centimeter-per-second', name: 'Centimeter per Second', symbol: 'cm/s', factor: 0.01 },
        { id: 'mach', name: 'Mach', symbol: 'Ma', factor: 343 },
        { id: 'speed-of-light', name: 'Speed of Light', symbol: 'c', factor: 299792458 },
        { id: 'kilometer-per-second', name: 'Kilometer per Second', symbol: 'km/s', factor: 1000 },
        { id: 'mile-per-second', name: 'Mile per Second', symbol: 'mi/s', factor: 1609.344 },
        { id: 'inch-per-second', name: 'Inch per Second', symbol: 'in/s', factor: 0.0254 },
        { id: 'yard-per-second', name: 'Yard per Second', symbol: 'yd/s', factor: 0.9144 },
        { id: 'meter-per-minute', name: 'Meter per Minute', symbol: 'm/min', factor: 1 / 60 },
        { id: 'kilometer-per-minute', name: 'Kilometer per Minute', symbol: 'km/min', factor: 1000 / 60 },
        { id: 'mile-per-minute', name: 'Mile per Minute', symbol: 'mi/min', factor: 1609.344 / 60 },
        { id: 'foot-per-minute', name: 'Foot per Minute', symbol: 'ft/min', factor: 0.3048 / 60 },
        { id: 'millimeter-per-second', name: 'Millimeter per Second', symbol: 'mm/s', factor: 0.001 },
    ],
};
