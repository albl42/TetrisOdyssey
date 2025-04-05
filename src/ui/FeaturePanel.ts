import { IGameFeature } from '../features/GameFeature.js';
import { FeatureControl } from './controls/FeatureControl.js';
import { ToggleControl } from './controls/ToggleControl.js';
import { PreviewToggleControl } from './controls/PreviewToggleControl.js';
import { SliderControl } from './controls/SliderControl.js';
import { SpeedControlFeature } from '../features/SpeedControlFeature.js';

/**
 * Panel that displays and manages game feature toggles
 */
export class FeaturePanel {
    private container: HTMLElement;
    private features: Map<string, FeatureControl>;

    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'feature-panel';
        this.features = new Map();
    }

    initializeControls(features: IGameFeature[]): void {
        features.forEach(feature => {
            let control: FeatureControl;

            switch (feature.id) {
                case 'ghost-piece':
                case 'hold-piece':
                    control = new PreviewToggleControl(feature);
                    break;
                case 'hard-drop':
                    control = new ToggleControl(feature);
                    break;
                case 'game-speed':
                    const speedFeature = feature as SpeedControlFeature;
                    control = new SliderControl(
                        feature,
                        1, // min speed
                        10, // max speed
                        1, // step
                        (value: number) => {
                            speedFeature.setSpeed(value);
                        }
                    );
                    break;
                default:
                    control = new ToggleControl(feature);
            }

            this.features.set(feature.id, control);
            this.container.appendChild(control.getElement());
        });
    }

    update(): void {
        this.features.forEach(control => control.update());
    }

    cleanup(): void {
        this.features.forEach(control => control.cleanup());
        this.features.clear();
        this.container.innerHTML = '';
    }

    getElement(): HTMLElement {
        return this.container;
    }
} 