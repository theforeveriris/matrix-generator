import { DEFAULT_STATE, PALETTES } from './constants.js';

class StateManager {
    constructor() {
        this.state = { ...DEFAULT_STATE };
        this.listeners = [];
        this.renderCallback = null;
    }

    get(key) {
        return key ? this.state[key] : { ...this.state };
    }

    set(key, value) {
        if (typeof key === 'object') {
            this.state = { ...this.state, ...key };
        } else {
            this.state[key] = value;
        }
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    setRenderCallback(callback) {
        this.renderCallback = callback;
    }

    triggerRender() {
        if (this.renderCallback) {
            this.renderCallback();
        }
    }

    getColors() {
        return PALETTES[this.state.currentPalette];
    }
}

export const state = new StateManager();
