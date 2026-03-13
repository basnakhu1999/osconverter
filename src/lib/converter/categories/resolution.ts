import { Category } from '../types';

export const resolution: Category = {
    id: 'resolution',
    name: 'Resolution',
    icon: '🖥️',
    description: 'Convert between common display resolutions measured in total pixels.',
    baseUnit: 'pixel',
    units: [
        { id: 'pixel', name: 'Pixel', symbol: 'px', factor: 1 },
        { id: 'kilopixel', name: 'Kilopixel', symbol: 'kpx', factor: 1000 },
        { id: 'megapixel', name: 'Megapixel', symbol: 'MP', factor: 1e6 },
        { id: 'gigapixel', name: 'Gigapixel', symbol: 'GP', factor: 1e9 },
        { id: 'hd-720p', name: 'HD 720p (1280×720)', symbol: '720p', factor: 921600 },
        { id: 'full-hd-1080p', name: 'Full HD 1080p (1920×1080)', symbol: '1080p', factor: 2073600 },
        { id: 'qhd-1440p', name: 'QHD 1440p (2560×1440)', symbol: '1440p', factor: 3686400 },
        { id: 'uhd-4k', name: '4K UHD (3840×2160)', symbol: '4K', factor: 8294400 },
        { id: 'uhd-8k', name: '8K UHD (7680×4320)', symbol: '8K', factor: 33177600 },
        { id: 'vga', name: 'VGA (640×480)', symbol: 'VGA', factor: 307200 },
        { id: 'svga', name: 'SVGA (800×600)', symbol: 'SVGA', factor: 480000 },
        { id: 'xga', name: 'XGA (1024×768)', symbol: 'XGA', factor: 786432 },
        { id: 'wxga', name: 'WXGA (1280×800)', symbol: 'WXGA', factor: 1024000 },
        { id: 'wqxga', name: 'WQXGA (2560×1600)', symbol: 'WQXGA', factor: 4096000 },
        { id: 'cinema-4k', name: 'Cinema 4K (4096×2160)', symbol: 'DCI 4K', factor: 8847360 },
    ],
};
