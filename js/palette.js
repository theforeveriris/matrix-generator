import { PALETTES } from './constants.js';

export function initPresetPalettes(onPaletteChange) {
    Object.keys(PALETTES).forEach(name => {
        const preview = document.getElementById(`${name}Preview`);
        if (preview) {
            PALETTES[name].slice(0, 6).forEach(color => {
                const dot = document.createElement('div');
                dot.className = 'preset-color-dot';
                dot.style.backgroundColor = color;
                preview.appendChild(dot);
            });
        }
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            onPaletteChange(btn.dataset.preset);
        });
    });
}
