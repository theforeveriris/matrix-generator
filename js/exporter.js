export function exportAsPNG(matrixElement, gridSize, filename = 'matrix') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 40;

    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;

    const cells = matrixElement.querySelectorAll('.matrix-cell');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const x = col * cellSize;
        const y = row * cellSize;
        const color = cell.style.backgroundColor;

        ctx.fillStyle = color || '#888888';
        ctx.fillRect(x, y, cellSize, cellSize);
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function exportAsSVG(matrixElement, gridSize, filename = 'matrix') {
    const cellSize = 40;
    const width = gridSize * cellSize;
    const height = gridSize * cellSize;

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<rect width="100%" height="100%" fill="#ebe7e0"/>`;

    const cells = matrixElement.querySelectorAll('.matrix-cell');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const x = col * cellSize;
        const y = row * cellSize;
        const color = cell.style.backgroundColor || '#888888';
        svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}"/>`;
    });

    svg += '</svg>';

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = `${filename}.svg`;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

export function exportAsJSON(state, gridSize, algorithm, chaosLevel, filename = 'matrix') {
    const cellsData = [];
    document.querySelectorAll('#matrix .matrix-cell').forEach((cell, index) => {
        cellsData.push({
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
        settings: { algorithm, chaosLevel },
        palette: { name: state.get('currentPalette'), colors: state.getColors() },
        cells: cellsData
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `${filename}.json`;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

export function exportAsCSS(state, filename = 'matrix') {
    const colors = state.getColors();
    let css = ':root {\n  /* Matrix Palette Export */\n';

    colors.forEach((color, i) => {
        css += `  --color-${i + 1}: ${color};\n`;
    });

    css += `  --matrix-primary: ${colors[0]};\n`;
    if (colors.length > 1) css += `  --matrix-secondary: ${colors[1]};\n`;
    if (colors.length > 2) css += `  --matrix-accent: ${colors[2]};\n`;

    css += '}\n\n/* Usage: .element { color: var(--matrix-primary); } */';

    const blob = new Blob([css], { type: 'text/css' });
    const link = document.createElement('a');
    link.download = `${filename}-palette.css`;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

export function exportAsCode(state, gridSize, filename = 'matrix') {
    const colors = state.getColors();
    const matrixEl = document.querySelector('#matrix');
    const grid = [];

    for (let i = 0; i < gridSize; i++) {
        const row = [];
        for (let j = 0; j < gridSize; j++) {
            const cell = matrixEl.querySelectorAll('.matrix-cell')[i * gridSize + j];
            row.push(cell ? cell.style.backgroundColor : '#888888');
        }
        grid.push(row);
    }

    const code = `// Matrix Generator Export
const GRID_SIZE = ${gridSize};
const PALETTE = ${JSON.stringify(colors)};
const MATRIX = ${JSON.stringify(grid)};`;

    const blob = new Blob([code], { type: 'text/javascript' });
    const link = document.createElement('a');
    link.download = `${filename}.js`;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

export function showExportMenu(anchorElement, matrixElement, state, gridSize, algorithm, chaosLevel) {
    const existingMenu = document.querySelector('.export-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }

    const menu = document.createElement('div');
    menu.className = 'export-menu';

    const formats = [
        { id: 'png', label: 'PNG Image' },
        { id: 'svg', label: 'SVG Vector' },
        { id: 'json', label: 'JSON Data' },
        { id: 'css', label: 'CSS Variables' },
        { id: 'js', label: 'JavaScript' }
    ];

    formats.forEach(fmt => {
        const btn = document.createElement('button');
        btn.className = 'export-option';
        btn.textContent = fmt.label;
        btn.onclick = () => {
            switch (fmt.id) {
                case 'png': exportAsPNG(matrixElement, gridSize); break;
                case 'svg': exportAsSVG(matrixElement, gridSize); break;
                case 'json': exportAsJSON(state, gridSize, algorithm, chaosLevel); break;
                case 'css': exportAsCSS(state); break;
                case 'js': exportAsCode(state, gridSize); break;
            }
            menu.remove();
        };
        menu.appendChild(btn);
    });

    anchorElement.parentElement.appendChild(menu);
}
