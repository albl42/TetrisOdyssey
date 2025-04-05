/**
 * Base interface for all feature controls
 */
export interface FeatureControl {
    getElement(): HTMLElement;
    update(): void;
    cleanup(): void;
} 