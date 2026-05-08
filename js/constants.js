export const PALETTES = {
    neon: ['#ff0080', '#00ffff', '#ffff00', '#ff00ff', '#00ff80', '#8000ff'],
    sunset: ['#ff4500', '#ff6b35', '#f7931e', '#ffcc00', '#ff8c42', '#e85d04'],
    ocean: ['#001219', '#005f73', '#0a9396', '#94d2bd', '#e9d8a6', '#ee9b00'],
    forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7']
};

export const ALGORITHMS = ['random', 'gradient', 'wave', 'block', 'diamond'];

export const DEFAULT_STATE = {
    gridSize: 8,
    chaosLevel: 5,
    algorithm: 'random',
    currentPalette: 'neon',
    customColors: []
};

export const SLIDER_CONFIG = {
    grid: { min: 3, max: 32, initial: 8 },
    chaos: { min: 1, max: 10, initial: 5 }
};
