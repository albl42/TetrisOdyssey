import { GameState } from '../GameState.js';

/**
 * Interface for game features
 */
export interface IGameFeature {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    toggle: () => void;
    initialize: (gameState: GameState) => void;
    update: (deltaTime: number) => void;
    cleanup: () => void;
}

/**
 * Abstract base class for game features
 * Provides common functionality and structure for all features
 */
export abstract class GameFeature implements IGameFeature {
    protected gameState: GameState | null = null;
    
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public isActive: boolean = false
    ) {}
    
    /**
     * Toggle the feature on/off
     */
    public toggle(): void {
        this.isActive = !this.isActive;
        if (this.isActive) {
            this.onActivate();
        } else {
            this.onDeactivate();
        }
    }
    
    /**
     * Initialize the feature with the game state
     */
    public initialize(gameState: GameState): void {
        this.gameState = gameState;
        if (this.isActive) {
            this.onActivate();
        }
    }
    
    /**
     * Update the feature (called each frame)
     */
    public update(deltaTime: number): void {
        if (this.isActive && this.gameState) {
            this.onUpdate(deltaTime);
        }
    }
    
    /**
     * Clean up resources when the feature is removed
     */
    public cleanup(): void {
        if (this.isActive) {
            this.onDeactivate();
        }
    }
    
    /**
     * Called when the feature is activated
     */
    protected abstract onActivate(): void;
    
    /**
     * Called when the feature is deactivated
     */
    protected abstract onDeactivate(): void;
    
    /**
     * Called each frame when the feature is active
     */
    protected abstract onUpdate(deltaTime: number): void;
} 