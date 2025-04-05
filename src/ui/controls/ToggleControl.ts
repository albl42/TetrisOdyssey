import { IGameFeature } from '../../features/GameFeature.js';
import { FeatureControl } from './FeatureControl.js';

/**
 * Control component for simple toggle features
 */
export class ToggleControl implements FeatureControl {
    private container: HTMLElement;
    private button: HTMLElement;
    private feature: IGameFeature;

    constructor(feature: IGameFeature) {
        this.feature = feature;
        this.container = this.createContainer();
        this.button = this.createButton();
        this.container.appendChild(this.button);
    }

    private createContainer(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'feature-control toggle-control';
        container.setAttribute('data-feature', this.feature.id);
        return container;
    }

    private createButton(): HTMLElement {
        const button = document.createElement('button');
        button.className = `feature-button ${this.feature.isActive ? 'active' : ''}`;
        
        // Create the button content
        const nameContainer = document.createElement('div');
        nameContainer.className = 'feature-name-container';
        
        const nameElement = document.createElement('div');
        nameElement.className = 'feature-name';
        nameElement.textContent = this.feature.name;
        
        // Add keyboard key indicator for hard drop and hold features
        if (this.feature.id === 'hard-drop') {
            const keyIndicator = document.createElement('div');
            keyIndicator.className = 'key-indicator';
            keyIndicator.innerHTML = '<span class="key">Space</span>';
            nameContainer.appendChild(nameElement);
            nameContainer.appendChild(keyIndicator);
        } else if (this.feature.id === 'hold-piece') {
            const keyIndicator = document.createElement('div');
            keyIndicator.className = 'key-indicator';
            keyIndicator.innerHTML = '<span class="key">H</span>';
            nameContainer.appendChild(nameElement);
            nameContainer.appendChild(keyIndicator);
        } else {
            nameContainer.appendChild(nameElement);
        }
        
        const descriptionElement = document.createElement('div');
        descriptionElement.className = 'feature-description';
        descriptionElement.textContent = this.feature.description;
        
        button.appendChild(nameContainer);
        button.appendChild(descriptionElement);

        button.addEventListener('click', () => {
            this.feature.toggle();
            button.classList.toggle('active');
        });

        return button;
    }

    getElement(): HTMLElement {
        return this.container;
    }

    update(): void {
        this.button.classList.toggle('active', this.feature.isActive);
    }

    cleanup(): void {
        // Clean up event listeners if needed
    }
} 