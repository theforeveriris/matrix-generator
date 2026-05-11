import { SLIDER_CONFIG } from './constants.js';

export function initSlider(trackId, thumbId, fillId, inputId, configKey, onChange) {
    const track = document.getElementById(trackId);
    const thumb = document.getElementById(thumbId);
    const fill = document.getElementById(fillId);
    const inputEl = document.getElementById(inputId);
    const config = SLIDER_CONFIG[configKey];

    function updateSliderByPercent(percent) {
        const value = Math.round(config.min + (config.max - config.min) * percent);
        percent = Math.max(0, Math.min(1, percent));

        fill.style.width = `${percent * 100}%`;
        thumb.style.left = `${percent * 100}%`;
        inputEl.value = value;
        onChange(value);
    }

    function updateSliderByValue(value) {
        value = Math.max(config.min, Math.min(config.max, Math.round(value)));
        const percent = (value - config.min) / (config.max - config.min);
        
        fill.style.width = `${percent * 100}%`;
        thumb.style.left = `${percent * 100}%`;
        inputEl.value = value;
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
        updateSliderByPercent(getPercent(e));
    });

    thumb.addEventListener('mousedown', () => {
        isDragging = true;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) updateSliderByPercent(getPercent(e));
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    track.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSliderByPercent(getPercent(e));
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) updateSliderByPercent(getPercent(e));
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    inputEl.addEventListener('input', (e) => {
        updateSliderByValue(e.target.value);
    });

    inputEl.addEventListener('change', (e) => {
        updateSliderByValue(e.target.value);
    });

    updateSliderByValue(config.initial);
}

export function initAllSliders(onGridChange) {
    initSlider('gridSlider', 'gridThumb', 'gridFill', 'gridInput', 'grid', onGridChange);
}
