import { Category } from '../types';

export const pixelDensity: Category = {
    id: 'pixel-density',
    name: 'Pixel Density',
    icon: '🔍',
    description: 'Convert between pixel density units such as PPI, PPCM, DPI and more.',
    baseUnit: 'ppi',
    units: [
        { id: 'ppi', name: 'Pixels per Inch', symbol: 'PPI', factor: 1 },
        { id: 'ppcm', name: 'Pixels per Centimeter', symbol: 'PPCM', factor: 2.54 },
        { id: 'ppmm', name: 'Pixels per Millimeter', symbol: 'PPMM', factor: 25.4 },
        { id: 'dpi', name: 'Dots per Inch', symbol: 'DPI', factor: 1 },
        { id: 'dpcm', name: 'Dots per Centimeter', symbol: 'DPCM', factor: 2.54 },
        { id: 'dpmm', name: 'Dots per Millimeter', symbol: 'DPMM', factor: 25.4 },
        { id: 'lpi', name: 'Lines per Inch', symbol: 'LPI', factor: 1 },
        { id: 'lpcm', name: 'Lines per Centimeter', symbol: 'LPCM', factor: 2.54 },
    ],
};
