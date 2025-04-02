import { GameFeature } from './GameFeatures.js';

export class FeaturePanel {
    private container: HTMLElement;
    private features: GameFeature[];
    private position: 'left' | 'right';

    constructor(features: GameFeature[], position: 'left' | 'right' = 'right') {
        this.features = features;
        this.position = position;
        this.container = this.createContainer();
        this.initializeButtons();
    }

    private createContainer(): HTMLElement {
        const container = document.createElement('div');
        container.className = `feature-panel ${this.position}`;
        return container;
    }

    private initializeButtons(): void {
        this.features.forEach(feature => {
            const button = this.createFeatureButton(feature);
            this.container.appendChild(button);
        });
    }

    private createFeatureButton(feature: GameFeature): HTMLElement {
        const button = document.createElement('button');
        button.className = `feature-button ${feature.isActive ? 'active' : ''}`;
        button.innerHTML = `
            <div class="feature-name">${feature.name}</div>
            <div class="feature-description">${feature.description}</div>
        `;

        button.addEventListener('click', () => {
            feature.toggle();
            button.classList.toggle('active');
        });

        return button;
    }

    getElement(): HTMLElement {
        return this.container;
    }
} 