import { Category } from '../types';

export const frequency: Category = {
    id: 'frequency',
    name: 'Frequency',
    icon: '〰️',
    description: 'Convert between frequency units such as Hertz, kilohertz, megahertz, gigahertz, RPM and more.',
    baseUnit: 'hertz',
    units: [
        { id: 'hertz', name: 'Hertz', symbol: 'Hz', factor: 1 },
        { id: 'kilohertz', name: 'Kilohertz', symbol: 'kHz', factor: 1000 },
        { id: 'megahertz', name: 'Megahertz', symbol: 'MHz', factor: 1e6 },
        { id: 'gigahertz', name: 'Gigahertz', symbol: 'GHz', factor: 1e9 },
        { id: 'terahertz', name: 'Terahertz', symbol: 'THz', factor: 1e12 },
        { id: 'millihertz', name: 'Millihertz', symbol: 'mHz', factor: 0.001 },
        { id: 'microhertz', name: 'Microhertz', symbol: 'μHz', factor: 1e-6 },
        { id: 'nanohertz', name: 'Nanohertz', symbol: 'nHz', factor: 1e-9 },
        { id: 'rpm', name: 'Revolutions per Minute', symbol: 'RPM', factor: 1 / 60 },
        { id: 'rps', name: 'Revolutions per Second', symbol: 'RPS', factor: 1 },
        { id: 'rph', name: 'Revolutions per Hour', symbol: 'RPH', factor: 1 / 3600 },
        { id: 'cycle-per-second', name: 'Cycle per Second', symbol: 'cps', factor: 1 },
        { id: 'beats-per-minute', name: 'Beats per Minute', symbol: 'BPM', factor: 1 / 60 },
        { id: 'radian-per-second', name: 'Radian per Second', symbol: 'rad/s', factor: 1 / (2 * Math.PI) },
        { id: 'degree-per-second', name: 'Degree per Second', symbol: '°/s', factor: 1 / 360 },
        { id: 'frames-per-second', name: 'Frames per Second', symbol: 'FPS', factor: 1 },
    ],
};
