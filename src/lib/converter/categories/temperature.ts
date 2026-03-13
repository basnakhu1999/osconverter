import { TemperatureCategory } from '../types';

export const temperature: TemperatureCategory = {
    id: 'temperature',
    name: 'Temperature',
    icon: '🌡️',
    description: 'Convert between temperature scales including Celsius, Fahrenheit, Kelvin, Rankine and more.',
    baseUnit: 'kelvin',
    units: [
        {
            id: 'celsius',
            name: 'Celsius',
            symbol: '°C',
            toBase: (v: number) => v + 273.15,
            fromBase: (v: number) => v - 273.15,
        },
        {
            id: 'fahrenheit',
            name: 'Fahrenheit',
            symbol: '°F',
            toBase: (v: number) => (v - 32) * (5 / 9) + 273.15,
            fromBase: (v: number) => (v - 273.15) * (9 / 5) + 32,
        },
        {
            id: 'kelvin',
            name: 'Kelvin',
            symbol: 'K',
            toBase: (v: number) => v,
            fromBase: (v: number) => v,
        },
        {
            id: 'rankine',
            name: 'Rankine',
            symbol: '°R',
            toBase: (v: number) => v * (5 / 9),
            fromBase: (v: number) => v * (9 / 5),
        },
        {
            id: 'delisle',
            name: 'Delisle',
            symbol: '°De',
            toBase: (v: number) => 373.15 - (v * 2) / 3,
            fromBase: (v: number) => ((373.15 - v) * 3) / 2,
        },
        {
            id: 'newton-temp',
            name: 'Newton (temperature)',
            symbol: '°N',
            toBase: (v: number) => (v * 100) / 33 + 273.15,
            fromBase: (v: number) => ((v - 273.15) * 33) / 100,
        },
        {
            id: 'reaumur',
            name: 'Réaumur',
            symbol: '°Ré',
            toBase: (v: number) => (v * 5) / 4 + 273.15,
            fromBase: (v: number) => ((v - 273.15) * 4) / 5,
        },
        {
            id: 'romer',
            name: 'Rømer',
            symbol: '°Rø',
            toBase: (v: number) => ((v - 7.5) * 40) / 21 + 273.15,
            fromBase: (v: number) => ((v - 273.15) * 21) / 40 + 7.5,
        },
    ],
};
