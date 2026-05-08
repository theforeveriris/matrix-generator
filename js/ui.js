export function initAlgorithmButtons(onAlgorithmChange) {
    document.querySelectorAll('.algo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.algo-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            onAlgorithmChange(btn.dataset.algo);
        });
    });
}

export function updateInfo(state) {
    const gridEl = document.getElementById('infoGrid');
    const colorsEl = document.getElementById('infoColors');
    const algoEl = document.getElementById('infoAlgo');
    const chaosEl = document.getElementById('infoChaos');

    if (gridEl) gridEl.textContent = `${state.gridSize}×${state.gridSize}`;
    if (colorsEl) colorsEl.textContent = state.getColors().length;
    if (algoEl) algoEl.textContent = state.get('algorithm').charAt(0).toUpperCase() + state.get('algorithm').slice(1);
    if (chaosEl) chaosEl.textContent = state.get('chaosLevel');
}

export function initGenerateButton(onClick) {
    const btn = document.getElementById('generateBtn');
    if (btn) {
        btn.addEventListener('click', onClick);
    }
}
