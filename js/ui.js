export function initAlgorithmButtons(onAlgorithmChange) {
    document.querySelectorAll('.algo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.algo-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            onAlgorithmChange(btn.dataset.algo);
        });
    });
}

export function updateInfo(stateManager) {
    const gridEl = document.getElementById('infoGrid');
    const colorsEl = document.getElementById('infoColors');
    const algoEl = document.getElementById('infoAlgo');
    const chaosEl = document.getElementById('infoChaos');

    if (gridEl) gridEl.textContent = `${stateManager.get('gridSize')}×${stateManager.get('gridSize')}`;
    if (colorsEl) colorsEl.textContent = stateManager.getColors().length;
    if (algoEl) algoEl.textContent = stateManager.get('algorithm').charAt(0).toUpperCase() + stateManager.get('algorithm').slice(1);
    if (chaosEl) chaosEl.textContent = stateManager.get('chaosLevel');
}

export function initGenerateButton(onClick) {
    const btn = document.getElementById('generateBtn');
    if (btn) {
        btn.addEventListener('click', onClick);
    }
}
