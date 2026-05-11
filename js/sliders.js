import { SLIDER_CONFIG } from './constants.js';

export function initSlider(trackId, thumbId, fillId, valueId, configKey, onChange) {
    const track = document.getElementById(trackId);
    const thumb = document.getElementById(thumbId);
    const fill = document.getElementById(fillId);
    const valueEl = document.getElementById(valueId);
    const config = SLIDER_CONFIG[configKey];

    function updateSlider(percent) {
        const value = Math.round(config.min + (config.max - config.min) * percent);
        percent = Math.max(0, Math.min(1, percent));

        fill.style.width = `${percent * 100}%`;
        thumb.style.left = `${percent * 100}%`;
        valueEl.textContent = value;
        onChange(value);
    }

    function getPercent(e) {
        const rect = track.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        return (clientX - rect.left) / rect.width;
    }

    let isDragging = false;

    track.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSlider(getPercent(e));
    });

    thumb.addEventListener('mousedown', () => {
        isDragging = true;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) updateSlider(getPercent(e));
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    track.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSlider(getPercent(e));
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) updateSlider(getPercent(e));
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    const initialPercent = (config.initial - config.min) / (config.max - config.min);
    updateSlider(initialPercent);
}

export function initAllSliders(onGridChange) {
    initSlider('gridSlider', 'gridThumb', 'gridFill', 'gridValue', 'grid', onGridChange);
}
