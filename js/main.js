import { state } from './state.js';
import { generateMatrix } from './generator.js';
import { initAllSliders } from './sliders.js';
import { initPresetPalettes } from './palette.js';
import { initAlgorithmButtons, updateInfo, initGenerateButton } from './ui.js';

function render() {
    const matrixContainer = document.getElementById('matrix');
    const { gridSize, algorithm } = state.get();
    const colors = state.getColors();
    generateMatrix(matrixContainer, gridSize, algorithm, colors);
    updateInfo(state);
}

function exportAsPNG(gridSize) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 40;
    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;

    document.querySelectorAll('#matrix .matrix-cell').forEach((cell, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        ctx.fillStyle = cell.style.backgroundColor || '#888';
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    });

    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'matrix.png';
        a.click();
        URL.revokeObjectURL(url);
    });
}

function exportAsSVG(gridSize) {
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${gridSize * 40}" height="${gridSize * 40}">`;
    svg += `<rect width="100%" height="100%" fill="#ebe7e0"/>`;

    document.querySelectorAll('#matrix .matrix-cell').forEach((cell, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const color = cell.style.backgroundColor || '#888';
        svg += `<rect x="${col * 40}" y="${row * 40}" width="40" height="40" fill="${color}"/>`;
    });
    svg += '</svg>';

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matrix.svg';
    a.click();
    URL.revokeObjectURL(url);
}

function exportAsJSON(gridSize) {
    const cells = [];
    document.querySelectorAll('#matrix .matrix-cell').forEach((cell, index) => {
        cells.push({
            index,
            row: Math.floor(index / gridSize),
            col: index % gridSize,
            color: cell.style.backgroundColor
        });
    });

    const data = {
        version: '1.0',
        generated: new Date().toISOString(),
        grid: { size: gridSize, total: gridSize * gridSize },
        settings: state.get(),
        palette: { name: state.get('currentPalette'), colors: state.getColors() },
        cells
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matrix.json';
    a.click();
    URL.revokeObjectURL(url);
}

function exportAsCSS() {
    const colors = state.getColors();
    let css = ':root {\n  /* Matrix Palette */\n';
    colors.forEach((c, i) => css += `  --color-${i + 1}: ${c};\n`);
    css += '}\n';
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matrix-palette.css';
    a.click();
    URL.revokeObjectURL(url);
}

function exportAsJS(gridSize) {
    const colors = state.getColors();
    const grid = [];
    const cells = document.querySelectorAll('#matrix .matrix-cell');
    for (let i = 0; i < gridSize; i++) {
        const row = [];
        for (let j = 0; j < gridSize; j++) {
            row.push(cells[i * gridSize + j]?.style.backgroundColor || '#888');
        }
        grid.push(row);
    }
    const code = `const GRID_SIZE = ${gridSize};\nconst PALETTE = ${JSON.stringify(colors)};\nconst MATRIX = ${JSON.stringify(grid)};`;
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matrix.js';
    a.click();
    URL.revokeObjectURL(url);
}

function showExportModal() {
    const existing = document.querySelector('.export-modal');
    if (existing) existing.remove();

    const { gridSize } = state.get();

    const modal = document.createElement('div');
    modal.className = 'export-modal';
    modal.innerHTML = `
        <div class="export-modal-overlay"></div>
        <div class="export-modal-content">
            <h3>Export As</h3>
            <button data-format="png">PNG Image</button>
            <button data-format="svg">SVG Vector</button>
            <button data-format="json">JSON Data</button>
            <button data-format="css">CSS Variables</button>
            <button data-format="js">JavaScript</button>
            <button class="export-modal-close">×</button>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.export-modal-overlay').onclick = () => modal.remove();
    modal.querySelector('.export-modal-close').onclick = () => modal.remove();

    modal.querySelectorAll('[data-format]').forEach(btn => {
        btn.onclick = () => {
            const fmt = btn.dataset.format;
            switch (fmt) {
                case 'png': exportAsPNG(gridSize); break;
                case 'svg': exportAsSVG(gridSize); break;
                case 'json': exportAsJSON(gridSize); break;
                case 'css': exportAsCSS(); break;
                case 'js': exportAsJS(gridSize); break;
            }
            modal.remove();
        };
    });
}

function init() {
    initAllSliders(
        (value) => { state.set('gridSize', value); render(); }
    );

    initPresetPalettes((palette) => {
        state.set('currentPalette', palette);
        render();
    });

    initAlgorithmButtons((algo) => {
        state.set('algorithm', algo);
        render();
    });

    initGenerateButton(() => { render(); });

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', showExportModal);
    }

    state.setRenderCallback(render);
    render();
}

document.addEventListener('DOMContentLoaded', init);
