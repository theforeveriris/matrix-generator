export const ALGORITHMS = ['random', 'gradient', 'wave', 'block', 'diamond', 'horizontal', 'vertical', 'diagonal', 'spiral', 'concentric', 'checker', 'stripes', 'triangular'];

export function getColorByIndex(index, gridSize, algorithm, colors) {
    const centerX = (gridSize - 1) / 2;
    const centerY = (gridSize - 1) / 2;
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const dx = col - centerX;
    const dy = row - centerY;

    let colorIndex;

    switch (algorithm) {
        case 'random':
            colorIndex = Math.floor(Math.random() * colors.length);
            break;
        case 'gradient':
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
            const t = Math.min(1, dist / maxDist);
            colorIndex = Math.floor(t * (colors.length - 1));
            break;
        case 'wave':
            const wave = Math.sin(col * 0.8) * Math.cos(row * 0.8);
            const waveNorm = (wave + 1) / 2;
            colorIndex = Math.floor(waveNorm * (colors.length - 1));
            break;
        case 'block':
            const blockSize = Math.max(1, Math.floor(gridSize / 2));
            const blockX = Math.floor(col / blockSize);
            const blockY = Math.floor(row / blockSize);
            colorIndex = (blockX + blockY) % colors.length;
            break;
        case 'diamond':
            const diamondDist = Math.abs(dx) + Math.abs(dy);
            const maxDiamondDist = gridSize - 1;
            const diamondT = diamondDist / maxDiamondDist;
            colorIndex = Math.floor(diamondT * (colors.length - 1));
            break;
        case 'horizontal':
            colorIndex = Math.floor((col / (gridSize - 1)) * (colors.length - 1));
            break;
        case 'vertical':
            colorIndex = Math.floor((row / (gridSize - 1)) * (colors.length - 1));
            break;
        case 'diagonal':
            const diagSum = col + row;
            const maxDiag = (gridSize - 1) * 2;
            colorIndex = Math.floor((diagSum / maxDiag) * (colors.length - 1));
            break;
        case 'spiral':
            const angle = Math.atan2(dy, dx);
            const spiralNorm = ((angle + Math.PI) / (2 * Math.PI) + 0.5) % 1;
            colorIndex = Math.floor(spiralNorm * (colors.length - 1));
            break;
        case 'concentric':
            const concDist = Math.sqrt(dx * dx + dy * dy);
            const maxConc = Math.sqrt(centerX * centerX + centerY * centerY);
            const concNorm = (concDist / maxConc + (col % 2) * 0.1) % 1;
            colorIndex = Math.floor(concNorm * (colors.length - 1));
            break;
        case 'checker':
            colorIndex = ((Math.floor(col / 2) + Math.floor(row / 2)) % 2) * (colors.length - 1);
            break;
        case 'stripes':
            colorIndex = Math.floor((row % 3) / 2 * (colors.length - 1));
            if (col % 2 === 0) colorIndex = Math.floor(colorIndex / 2);
            break;
        case 'triangular':
            const triDist = Math.min(col, row) + Math.abs(col - row) * 0.5;
            const maxTri = gridSize;
            const triNorm = triDist / maxTri;
            colorIndex = Math.floor(triNorm * (colors.length - 1));
            break;
        default:
            colorIndex = Math.floor(Math.random() * colors.length);
    }

    const safeColors = colors && colors.length ? colors : ['#ff0080'];
    const safeIndex = Math.max(0, Math.min(safeColors.length - 1, Math.floor(colorIndex || 0)));
    return safeColors[safeIndex];
}

export function generateMatrix(container, gridSize, algorithm, colors) {
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    const total = gridSize * gridSize;

    for (let i = 0; i < total; i++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';

        const color = getColorByIndex(i, gridSize, algorithm, colors);
        cell.style.backgroundColor = color;
        cell.style.color = color;

        container.appendChild(cell);

        const delay = (i % gridSize) * 20 + Math.floor(i / gridSize) * 20;
        setTimeout(() => {
            cell.classList.add('visible');
        }, delay);
    }

    return total;
}
