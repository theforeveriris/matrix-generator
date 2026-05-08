export function getColorByIndex(index, gridSize, algorithm, chaosLevel, colors) {
    const centerX = (gridSize - 1) / 2;
    const centerY = (gridSize - 1) / 2;
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    const chaosRoll = Math.random() * 10;

    if (chaosRoll < chaosLevel) {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    let colorIndex;

    switch (algorithm) {
        case 'random':
            colorIndex = Math.floor(Math.random() * colors.length);
            break;
        case 'gradient':
            const dist = Math.sqrt((col - centerX) ** 2 + (row - centerY) ** 2);
            const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2);
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
            const diamondDist = Math.abs(col - centerX) + Math.abs(row - centerY);
            const maxDiamondDist = gridSize - 1;
            const diamondT = diamondDist / maxDiamondDist;
            colorIndex = Math.floor(diamondT * (colors.length - 1));
            break;
        default:
            colorIndex = Math.floor(Math.random() * colors.length);
    }

    return colors[Math.max(0, Math.min(colors.length - 1, colorIndex))];
}

export function generateMatrix(container, gridSize, algorithm, chaosLevel, colors) {
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    const maxSize = Math.min(500 / gridSize, 60);
    const total = gridSize * gridSize;

    for (let i = 0; i < total; i++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';

        const color = getColorByIndex(i, gridSize, algorithm, chaosLevel, colors);
        cell.style.backgroundColor = color;
        cell.style.color = color;
        cell.style.width = `${maxSize}px`;
        cell.style.height = `${maxSize}px`;

        container.appendChild(cell);

        const delay = (i % gridSize) * 20 + Math.floor(i / gridSize) * 20;
        setTimeout(() => {
            cell.classList.add('visible');
        }, delay);
    }

    return total;
}
