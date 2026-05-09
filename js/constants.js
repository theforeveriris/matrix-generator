export const PALETTES = {
    neon: ['#ff0080', '#00ffff', '#ffff00', '#ff00ff', '#00ff80', '#8000ff'],
    sunset: ['#ff4500', '#ff6b35', '#f7931e', '#ffcc00', '#ff8c42', '#e85d04'],
    ocean: ['#001219', '#005f73', '#0a9396', '#94d2bd', '#e9d8a6', '#ee9b00'],
    forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7'],
    mono: ['#1a1a1a', '#4a4a4a', '#7a7a7a', '#a8a8a8', '#d0d0d0', '#f5f5f5'],
    pastel: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e8baff'],
    earth: ['#5c4033', '#8b5a2b', '#a0522d', '#cd853f', '#d2691e', '#deb887'],
    vintage: ['#704214', '#8b4513', '#a0522d', '#bc8f8f', '#d2b48c', '#f5deb3'],
    cyber: ['#0d0221', '#1a0533', '#2d1b69', '#5c1aab', '#9333ea', '#c084fc'],
    nordic: ['#2c3e50', '#34495e', '#5d6d7e', '#85929e', '#aeb6bf', '#d5d8dc'],
    autumn: ['#8b0000', '#a52a2a', '#b8860b', '#cd853f', '#d2691e', '#daa520'],
    lavender: ['#2e1a47', '#4a2c6a', '#6b3fa0', '#8e44ad', '#a569bd', '#d7bde2'],
    mint: ['#0d3b3b', '#1a5656', '#267272', '#339090', '#66b2b2', '#99d9d9'],
    trans: ['#5bcefa', '#f5a9b8', '#ffffff', '#f5a9b8', '#5bcefa', '#d0d0d0'],
    rainbow: ['#e40303', '#ff8c00', '#ffed00', '#008026', '#004dff', '#750787'],
    lesbian: ['#d52d00', '#ef7627', '#ff9aae', '#ffffff', '#d162a4', '#a50062'],
    gay: ['#078d70', '#3aa982', '#6dc555', '#79b8ff', '#4170a6', '#5039a3'],
    bisexual: ['#d60270', '#9c59d1', '#0038a8', '#d60270', '#9c59d1', '#0038a8'],
    pan: ['#ff218c', '#ffd800', '#21b1ff', '#ff218c', '#ffd800', '#21b1ff'],
    nb: ['#fcf434', '#ffffff', '#9c59d1', '#ffffff', '#282828', '#d0d0d0'],
    ace: ['#000000', '#a3a3a3', '#ffffff', '#800080', '#a3a3a3', '#800080'],
    gqueer: ['#b57fd8', '#ffffff', '#498142', '#b57fd8', '#ffffff', '#498142'],
    intersex: ['#fff200', '#9c59b1', '#fff200', '#9c59b1', '#fff200', '#9c59b1']
};

export const ALGORITHMS = ['random', 'gradient', 'wave', 'block', 'diamond', 'horizontal', 'vertical', 'diagonal', 'spiral', 'concentric', 'checker', 'stripes', 'triangular'];

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
