import { Category } from '../types';

export const voltage: Category = {
    id: 'voltage',
    name: 'Voltage',
    icon: '🔌',
    description: 'Convert between voltage / electric potential units such as volts, millivolts, kilovolts and more.',
    baseUnit: 'volt',
    units: [
        { id: 'volt', name: 'Volt', symbol: 'V', factor: 1 },
        { id: 'millivolt', name: 'Millivolt', symbol: 'mV', factor: 0.001 },
        { id: 'microvolt', name: 'Microvolt', symbol: 'μV', factor: 1e-6 },
        { id: 'nanovolt', name: 'Nanovolt', symbol: 'nV', factor: 1e-9 },
        { id: 'kilovolt', name: 'Kilovolt', symbol: 'kV', factor: 1000 },
        { id: 'megavolt', name: 'Megavolt', symbol: 'MV', factor: 1e6 },
        { id: 'gigavolt', name: 'Gigavolt', symbol: 'GV', factor: 1e9 },
        { id: 'abvolt', name: 'Abvolt', symbol: 'abV', factor: 1e-8 },
        { id: 'statvolt', name: 'Statvolt', symbol: 'statV', factor: 299.792 },
        { id: 'planck-voltage', name: 'Planck Voltage', symbol: 'Vₚ', factor: 1.04295e27 },
    ],
};

export const current: Category = {
    id: 'current',
    name: 'Electric Current',
    icon: '⚡',
    description: 'Convert between electric current units such as amperes, milliamperes, kiloamperes and more.',
    baseUnit: 'ampere',
    units: [
        { id: 'ampere', name: 'Ampere', symbol: 'A', factor: 1 },
        { id: 'milliampere', name: 'Milliampere', symbol: 'mA', factor: 0.001 },
        { id: 'microampere', name: 'Microampere', symbol: 'μA', factor: 1e-6 },
        { id: 'nanoampere', name: 'Nanoampere', symbol: 'nA', factor: 1e-9 },
        { id: 'picoampere', name: 'Picoampere', symbol: 'pA', factor: 1e-12 },
        { id: 'kiloampere', name: 'Kiloampere', symbol: 'kA', factor: 1000 },
        { id: 'megaampere', name: 'Megaampere', symbol: 'MA', factor: 1e6 },
        { id: 'abampere', name: 'Abampere', symbol: 'abA', factor: 10 },
        { id: 'statampere', name: 'Statampere', symbol: 'statA', factor: 3.336e-10 },
        { id: 'biot', name: 'Biot', symbol: 'Bi', factor: 10 },
        { id: 'coulomb-per-second', name: 'Coulomb per Second', symbol: 'C/s', factor: 1 },
    ],
};

export const resistance: Category = {
    id: 'resistance',
    name: 'Resistance',
    icon: '🔗',
    description: 'Convert between electrical resistance units such as ohms, kilohms, megohms and more.',
    baseUnit: 'ohm',
    units: [
        { id: 'ohm', name: 'Ohm', symbol: 'Ω', factor: 1 },
        { id: 'milliohm', name: 'Milliohm', symbol: 'mΩ', factor: 0.001 },
        { id: 'microohm', name: 'Microohm', symbol: 'μΩ', factor: 1e-6 },
        { id: 'nanoohm', name: 'Nanoohm', symbol: 'nΩ', factor: 1e-9 },
        { id: 'kilohm', name: 'Kilohm', symbol: 'kΩ', factor: 1000 },
        { id: 'megohm', name: 'Megohm', symbol: 'MΩ', factor: 1e6 },
        { id: 'gigohm', name: 'Gigohm', symbol: 'GΩ', factor: 1e9 },
        { id: 'abohm', name: 'Abohm', symbol: 'abΩ', factor: 1e-9 },
        { id: 'statohm', name: 'Statohm', symbol: 'statΩ', factor: 8.9876e11 },
        { id: 'reciprocal-siemens', name: 'Reciprocal Siemens', symbol: '1/S', factor: 1 },
        { id: 'volt-per-ampere', name: 'Volt per Ampere', symbol: 'V/A', factor: 1 },
    ],
};

export const magneticField: Category = {
    id: 'magnetic-field',
    name: 'Magnetic Field',
    icon: '🧲',
    description: 'Convert between magnetic field strength units such as Tesla, Gauss, Weber/m² and more.',
    baseUnit: 'tesla',
    units: [
        { id: 'tesla', name: 'Tesla', symbol: 'T', factor: 1 },
        { id: 'millitesla', name: 'Millitesla', symbol: 'mT', factor: 0.001 },
        { id: 'microtesla', name: 'Microtesla', symbol: 'μT', factor: 1e-6 },
        { id: 'nanotesla', name: 'Nanotesla', symbol: 'nT', factor: 1e-9 },
        { id: 'gauss', name: 'Gauss', symbol: 'G', factor: 1e-4 },
        { id: 'milligauss', name: 'Milligauss', symbol: 'mG', factor: 1e-7 },
        { id: 'kilogauss', name: 'Kilogauss', symbol: 'kG', factor: 0.1 },
        { id: 'weber-per-square-meter', name: 'Weber per Square Meter', symbol: 'Wb/m²', factor: 1 },
        { id: 'maxwell-per-square-cm', name: 'Maxwell per Square Centimeter', symbol: 'Mx/cm²', factor: 1e-4 },
        { id: 'gamma', name: 'Gamma', symbol: 'γ', factor: 1e-9 },
        { id: 'line-per-square-inch', name: 'Line per Square Inch', symbol: 'line/in²', factor: 1.55e-5 },
    ],
};
