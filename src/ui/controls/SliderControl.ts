import { IGameFeature } from '../../features/GameFeature.js';
import { FeatureControl } from './FeatureControl.js';
import { SpeedControlFeature } from '../../features/SpeedControlFeature.js';

/**
 * Control component for features that need a slider control
 */
export class SliderControl implements FeatureControl {
    private container: HTMLElement;
    private slider: HTMLInputElement;
    private valueDisplay: HTMLElement;
    private feature: IGameFeature;
    private min: number;
    private max: number;
    private step: number;
    private onValueChange: (value: number) => void;

    constructor(
        feature: IGameFeature,
        min: number,
        max: number,
        step: number,
        onValueChange: (value: number) => void
    ) {
        this.feature = feature;
        this.min = min;
        this.max = max;
        this.step = step;
        this.onValueChange = onValueChange;
        this.container = this.createContainer();
        this.slider = this.createSlider();
        this.valueDisplay = this.createValueDisplay();
        
        this.container.appendChild(this.createLabel());
        this.container.appendChild(this.slider);
        this.container.appendChild(this.valueDisplay);

        // Set initial value
        if (feature.id === 'game-speed') {
            const speedFeature = feature as SpeedControlFeature;
            const initialValue = speedFeature.getSpeedValue();
            this.slider.value = initialValue.toString();
            this.updateValueDisplay(initialValue);
        }
    }

    private createContainer(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'feature-control';
        return container;
    }

    private createLabel(): HTMLElement {
        const label = document.createElement('div');
        label.className = 'feature-label';
        
        const name = document.createElement('div');
        name.className = 'feature-name';
        name.textContent = this.feature.name;
        
        const description = document.createElement('div');
        description.className = 'feature-description';
        description.textContent = this.feature.description;
        
        label.appendChild(name);
        label.appendChild(description);
        return label;
    }

    private createSlider(): HTMLInputElement {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'feature-slider';
        slider.min = this.min.toString();
        slider.max = this.max.toString();
        slider.step = this.step.toString();
        slider.value = this.max.toString(); // Start at max value
        
        slider.addEventListener('input', () => {
            const value = parseInt(slider.value);
            this.updateValueDisplay(value);
            this.onValueChange(value);
        });
        
        return slider;
    }

    private createValueDisplay(): HTMLElement {
        const display = document.createElement('div');
        display.className = 'feature-value';
        return display;
    }

    private updateValueDisplay(value: number): void {
        if (this.feature.id === 'game-speed') {
            this.valueDisplay.textContent = `${value}x`;
        } else {
            this.valueDisplay.textContent = value.toString();
        }
    }

    getElement(): HTMLElement {
        return this.container;
    }

    update(): void {
        if (this.feature.id === 'game-speed') {
            const speedFeature = this.feature as SpeedControlFeature;
            const currentValue = speedFeature.getSpeedValue();
            this.slider.value = currentValue.toString();
            this.updateValueDisplay(currentValue);
        }
    }

    cleanup(): void {
        // No cleanup needed for this control
    }
} 