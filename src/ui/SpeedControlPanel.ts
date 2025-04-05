import { SpeedControlFeature } from '../features/SpeedControlFeature.js';

/**
 * UI component for controlling the drop speed of pieces
 */
export class SpeedControlPanel {
    private container: HTMLElement;
    private speedControlFeature: SpeedControlFeature;
    private slider: HTMLInputElement;
    private speedDisplay: HTMLElement;

    constructor(speedControlFeature: SpeedControlFeature) {
        this.speedControlFeature = speedControlFeature;
        this.container = this.createContainer();
        this.slider = this.createSlider();
        this.speedDisplay = this.createSpeedDisplay();
        
        this.container.appendChild(this.createLabel());
        this.container.appendChild(this.slider);
        this.container.appendChild(this.speedDisplay);
        
        // Set initial value
        const initialValue = this.speedControlFeature.getSpeedValue();
        this.slider.value = initialValue.toString();
        this.updateSpeedDisplay(initialValue);
    }

    private createContainer(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'speed-control-panel';
        return container;
    }

    private createLabel(): HTMLElement {
        const label = document.createElement('div');
        label.className = 'feature-label';
        
        const name = document.createElement('div');
        name.className = 'feature-name';
        name.textContent = this.speedControlFeature.name;
        
        const description = document.createElement('div');
        description.className = 'feature-description';
        description.textContent = this.speedControlFeature.description;
        
        label.appendChild(name);
        label.appendChild(description);
        return label;
    }

    private createSlider(): HTMLInputElement {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'feature-slider';
        slider.min = '1';
        slider.max = '10';
        slider.step = '1';
        
        slider.addEventListener('input', () => {
            const value = parseInt(slider.value);
            this.updateSpeedDisplay(value);
            this.speedControlFeature.setSpeed(value);
        });
        
        return slider;
    }

    private createSpeedDisplay(): HTMLElement {
        const display = document.createElement('div');
        display.className = 'feature-value';
        return display;
    }

    private updateSpeedDisplay(value: number): void {
        this.speedDisplay.textContent = `${value}x`;
    }

    getElement(): HTMLElement {
        return this.container;
    }

    update(): void {
        const currentValue = this.speedControlFeature.getSpeedValue();
        this.slider.value = currentValue.toString();
        this.updateSpeedDisplay(currentValue);
    }

    cleanup(): void {
        // No cleanup needed for this control
    }
} 