import { Category } from '../types';

export const angle: Category = {
    id: 'angle',
    name: 'Angle',
    icon: '📐',
    description: 'Convert between angle units such as degrees, radians, gradians, arcminutes and more.',
    baseUnit: 'degree',
    units: [
        { id: 'degree', name: 'Degree', symbol: '°', factor: 1 },
        { id: 'radian', name: 'Radian', symbol: 'rad', factor: 180 / Math.PI },
        { id: 'gradian', name: 'Gradian', symbol: 'gon', factor: 0.9 },
        { id: 'arcminute', name: 'Arcminute', symbol: '′', factor: 1 / 60 },
        { id: 'arcsecond', name: 'Arcsecond', symbol: '″', factor: 1 / 3600 },
        { id: 'milliradian', name: 'Milliradian', symbol: 'mrad', factor: (180 / Math.PI) * 0.001 },
        { id: 'microradian', name: 'Microradian', symbol: 'μrad', factor: (180 / Math.PI) * 1e-6 },
        { id: 'revolution', name: 'Revolution', symbol: 'rev', factor: 360 },
        { id: 'turn', name: 'Turn', symbol: 'tr', factor: 360 },
        { id: 'quadrant', name: 'Quadrant', symbol: 'quad', factor: 90 },
        { id: 'sextant', name: 'Sextant', symbol: 'sextant', factor: 60 },
        { id: 'octant', name: 'Octant', symbol: 'octant', factor: 45 },
        { id: 'sign', name: 'Sign', symbol: 'sign', factor: 30 },
        { id: 'mil-nato', name: 'Mil (NATO)', symbol: 'mil', factor: 0.05625 },
        { id: 'mil-ussr', name: 'Mil (USSR)', symbol: 'mil', factor: 0.06 },
        { id: 'binary-degree', name: 'Binary Degree', symbol: 'brad', factor: 360 / 256 },
        { id: 'hour-angle', name: 'Hour Angle', symbol: 'HA', factor: 15 },
        { id: 'compass-point', name: 'Compass Point', symbol: 'point', factor: 11.25 },
    ],
};
