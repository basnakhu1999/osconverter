import { Category } from '../types';

export const torque: Category = {
    id: 'torque',
    name: 'Torque',
    icon: '🔧',
    description: 'Convert between torque units such as Newton-meter, foot-pound, kilogram-force meter and more.',
    baseUnit: 'newton-meter',
    units: [
        { id: 'newton-meter', name: 'Newton Meter', symbol: 'N·m', factor: 1 },
        { id: 'kilonewton-meter', name: 'Kilonewton Meter', symbol: 'kN·m', factor: 1000 },
        { id: 'millinewton-meter', name: 'Millinewton Meter', symbol: 'mN·m', factor: 0.001 },
        { id: 'newton-centimeter', name: 'Newton Centimeter', symbol: 'N·cm', factor: 0.01 },
        { id: 'newton-millimeter', name: 'Newton Millimeter', symbol: 'N·mm', factor: 0.001 },
        { id: 'kilogram-force-meter', name: 'Kilogram-force Meter', symbol: 'kgf·m', factor: 9.80665 },
        { id: 'kilogram-force-centimeter', name: 'Kilogram-force Centimeter', symbol: 'kgf·cm', factor: 0.0980665 },
        { id: 'gram-force-centimeter', name: 'Gram-force Centimeter', symbol: 'gf·cm', factor: 9.80665e-5 },
        { id: 'foot-pound-force', name: 'Foot-pound Force', symbol: 'ft·lbf', factor: 1.355818 },
        { id: 'inch-pound-force', name: 'Inch-pound Force', symbol: 'in·lbf', factor: 0.1129848 },
        { id: 'foot-poundal', name: 'Foot-Poundal', symbol: 'ft·pdl', factor: 0.042140 },
        { id: 'dyne-centimeter', name: 'Dyne Centimeter', symbol: 'dyn·cm', factor: 1e-7 },
        { id: 'ounce-force-inch', name: 'Ounce-force Inch', symbol: 'ozf·in', factor: 0.00706155 },
    ],
};
