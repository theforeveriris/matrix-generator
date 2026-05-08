import { state } from './state.js';
import { generateMatrix } from './generator.js';
import { initAllSliders } from './sliders.js';
import { initPresetPalettes, initCustomPalette } from './palette.js';
import { initAlgorithmButtons, updateInfo, initGenerateButton } from './ui.js';
import { showExportMenu } from './exporter.js';

function render() {
    const matrixContainer = document.getElementById('matrix');
    const { gridSize, algorithm, chaosLevel } = state.get();
    const colors = state.getColors();

    generateMatrix(matrixContainer, gridSize, algorithm, chaosLevel, colors);
    updateInfo(state);
}

function init() {
    const matrixContainer = document.getElementById('matrix');
    const exportBtn = document.getElementById('exportBtn');

    initAllSliders(
        (value) => {
            state.set('gridSize', value);
            render();
        },
        (value) => {
            state.set('chaosLevel', value);
            updateInfo(state);
        }
    );

    initPresetPalettes((palette) => {
        state.set('currentPalette', palette);
        render();
    });

    initCustomPalette(state);

    initAlgorithmButtons((algo) => {
        state.set('algorithm', algo);
        render();
    });

    initGenerateButton(() => {
        render();
    });

    if (exportBtn) {
        exportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const { gridSize, algorithm, chaosLevel } = state.get();
            showExportMenu(exportBtn, matrixContainer, state, gridSize, algorithm, chaosLevel);
        });
    }

    state.setRenderCallback(render);

    render();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
