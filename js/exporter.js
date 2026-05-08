export async function exportAsPNG(matrixElement, gridSize, filename = 'matrix') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 40;
    const gap = 0;
    const padding = 0;

    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;

    const cells = matrixElement.querySelectorAll('.matrix-cell');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const x = col * cellSize;
        const y = row * cellSize;

        ctx.fillStyle = cell.style.backgroundColor;
        ctx.fillRect(x, y, cellSize, cellSize);
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

export async function exportAsSVG(matrixElement, gridSize, filename = 'matrix') {
    const cellSize = 40;
    const width = gridSize * cellSize;
    const height = gridSize * cellSize;

    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#ebe7e0"/>
  <g>
`;

    const cells = matrixElement.querySelectorAll('.matrix-cell');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const x = col * cellSize;
        const y = row * cellSize;
        const color = cell.style.backgroundColor;

        svgContent += `    <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}"/>\n`;
    });

    svgContent += `  </g>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${filename}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
}

export function exportAsJSON(state, gridSize, algorithm, chaosLevel, filename = 'matrix') {
    const colors = [];
    const cells = document.querySelectorAll('.matrix-cell');
    cells.forEach((cell, index) => {
        colors.push({
            index,
            row: Math.floor(index / gridSize),
            col: index % gridSize,
            color: cell.style.backgroundColor
        });
    });

    const data = {
        version: '1.0',
        generated: new Date().toISOString(),
        grid: {
            size: gridSize,
            total: gridSize * gridSize
        },
        settings: {
            algorithm,
            chaosLevel
        },
        palette: {
            name: state.get('currentPalette'),
            colors: state.getColors()
        },
        cells: colors
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${filename}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
}

export function exportAsCSS(state, filename = 'matrix') {
    const colors = state.getColors();
    const cssLines = [
        ':root {',
        '  /* Matrix Palette Export */',
        `  /* Generated: ${new Date().toISOString()} */`,
        ''
    ];

    colors.forEach((color, index) => {
        const varName = `--color-${index + 1}`;
        cssLines.push(`  ${varName}: ${color};`);
    });

    cssLines.push('');
    cssLines.push('  /* Color aliases */');
    cssLines.push(`  --matrix-primary: ${colors[0]};`);
    if (colors.length > 1) {
        cssLines.push(`  --matrix-secondary: ${colors[1]};`);
    }
    if (colors.length > 2) {
        cssLines.push(`  --matrix-accent: ${colors[2]};`);
    }
    if (colors.length > 3) {
        cssLines.push(`  --matrix-highlight: ${colors[colors.length - 1]};`);
    }

    cssLines.push('}');
    cssLines.push('');
    cssLines.push('/* Usage: */');
    cssLines.push('/* .element { background-color: var(--matrix-primary); } */');

    const blob = new Blob([cssLines.join('\n')], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${filename}-palette.css`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
}

export function exportAsCode(state, gridSize, filename = 'matrix') {
    const colors = state.getColors();
    const grid = [];
    const cells = document.querySelectorAll('.matrix-cell');

    for (let i = 0; i < gridSize; i++) {
        const row = [];
        for (let j = 0; j < gridSize; j++) {
            const cell = cells[i * gridSize + j];
            row.push(cell.style.backgroundColor);
        }
        grid.push(row);
    }

    const code = `// Matrix Generator Export
// Generated: ${new Date().toISOString()}

// Configuration
const GRID_SIZE = ${gridSize};
const PALETTE = ${JSON.stringify(colors, null, 4)};
const ALGORITHM = '${state.get('algorithm')}';
const CHAOS_LEVEL = ${state.get('chaosLevel')};

// Grid Data (row-major order)
const MATRIX = ${JSON.stringify(grid, null, 4)};

// Usage: MATRIX[row][col] to get color
// Example: document.body.style.backgroundColor = MATRIX[0][0];
`;

    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${filename}.js`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
}

export function showExportMenu(anchorElement, matrixElement, state, gridSize, algorithm, chaosLevel) {
    const existingMenu = document.querySelector('.export-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }

    const menu = document.createElement('div');
    menu.className = 'export-menu';
    menu.innerHTML = `
        <div class="export-menu-title">Export</div>
        <button class="export-option" data-format="png">PNG Image</button>
        <button class="export-option" data-format="svg">SVG Vector</button>
        <button class="export-option" data-format="json">JSON Data</button>
        <button class="export-option" data-format="css">CSS Variables</button>
        <button class="export-option" data-format="js">JavaScript</button>
    `;

    const rect = anchorElement.getBoundingClientRect();
    menu.style.position = 'absolute';
    menu.style.top = `${rect.bottom + 8}px`;
    menu.style.right = '0';

    document.body.appendChild(menu);

    menu.querySelectorAll('.export-option').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const format = btn.dataset.format;

            switch (format) {
                case 'png':
                    await exportAsPNG(matrixElement, gridSize);
                    break;
                case 'svg':
                    await exportAsSVG(matrixElement, gridSize);
                    break;
                case 'json':
                    exportAsJSON(state, gridSize, algorithm, chaosLevel);
                    break;
                case 'css':
                    exportAsCSS(state);
                    break;
                case 'js':
                    exportAsCode(state, gridSize);
                    break;
            }

            menu.remove();
        });
    });

    document.addEventListener('click', function closeMenu() {
        menu.remove();
        document.removeEventListener('click', closeMenu);
    });
}
