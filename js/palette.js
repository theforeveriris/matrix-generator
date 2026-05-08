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

export function initCustomPalette(state) {
    const slotsContainer = document.getElementById('customSlots');

    function renderCustomSlots() {
        slotsContainer.innerHTML = '';

        for (let i = 0; i < 8; i++) {
            const slot = document.createElement('div');
            slot.className = 'color-slot';

            if (state.customColors[i]) {
                slot.classList.add('has-color');
                slot.style.backgroundColor = state.customColors[i];
                slot.innerHTML = `
                    <input type="color" value="${state.customColors[i]}">
                    <button class="delete-btn">×</button>
                `;

                slot.querySelector('input').addEventListener('input', (e) => {
                    state.customColors[i] = e.target.value;
                    slot.style.backgroundColor = e.target.value;
                    if (state.currentPalette === 'custom') {
                        state.triggerRender();
                    }
                });

                slot.querySelector('.delete-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    state.customColors.splice(i, 1);
                    renderCustomSlots();
                    if (state.currentPalette === 'custom') {
                        state.triggerRender();
                    }
                });
            } else {
                slot.innerHTML = '<span class="add-icon">+</span>';
                slot.addEventListener('click', () => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = '#ff0000';
                    input.addEventListener('input', (e) => {
                        if (!state.customColors[i]) {
                            state.customColors.push(e.target.value);
                            slot.classList.add('has-color');
                            slot.style.backgroundColor = e.target.value;
                            slot.innerHTML = `
                                <input type="color" value="${e.target.value}">
                                <button class="delete-btn">×</button>
                            `;
                            initSlotListeners(slot, i);
                            if (state.currentPalette === 'custom') {
                                state.triggerRender();
                            }
                        }
                    });
                    input.click();
                });
            }

            slotsContainer.appendChild(slot);
        }
    }

    function initSlotListeners(slot, index) {
        slot.querySelector('input').addEventListener('input', (e) => {
            state.customColors[index] = e.target.value;
            slot.style.backgroundColor = e.target.value;
            if (state.currentPalette === 'custom') {
                state.triggerRender();
            }
        });

        slot.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            state.customColors.splice(index, 1);
            renderCustomSlots();
            if (state.currentPalette === 'custom') {
                state.triggerRender();
            }
        });
    }

    renderCustomSlots();

    const customTitle = document.querySelector('.custom-palette .section-title');
    customTitle.style.cursor = 'pointer';
    customTitle.addEventListener('click', () => {
        if (state.customColors.length > 0) {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            state.currentPalette = 'custom';
            state.triggerRender();
        }
    });
}
