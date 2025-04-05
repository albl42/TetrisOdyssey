import { GameState } from '../GameState.js';
import { IGameFeature } from './GameFeature.js';
import { GhostPieceFeature } from './GhostPieceFeature.js';
import { HardDropFeature } from './HardDropFeature.js';
import { HoldPieceFeature } from './HoldPieceFeature.js';
import { SpeedControlFeature } from './SpeedControlFeature.js';

type FeatureType = GhostPieceFeature | HardDropFeature | HoldPieceFeature | SpeedControlFeature;

/**
 * Feature manager that handles game features with proper type safety
 */
export class FeatureManager {
    private features: Map<string, FeatureType> = new Map();
    private gameState: GameState | null = null;
    private speedControlFeature: SpeedControlFeature | null = null;
    
    constructor() {
        this.initializeFeatures();
    }
    
    /**
     * Initialize all available features
     */
    private initializeFeatures(): void {
        // Add features with their default states
        this.addFeature(new GhostPieceFeature());
        this.addFeature(new HardDropFeature());
        this.addFeature(new HoldPieceFeature());
        this.speedControlFeature = new SpeedControlFeature();
        this.addFeature(this.speedControlFeature);
    }
    
    /**
     * Add a feature to the manager
     */
    public addFeature(feature: FeatureType): void {
        this.features.set(feature.id, feature);
    }
    
    /**
     * Get a feature by ID with proper type checking
     */
    public getFeature<K extends FeatureType>(id: string): K | undefined {
        return this.features.get(id) as K | undefined;
    }
    
    /**
     * Get all features
     */
    public getAllFeatures(): FeatureType[] {
        return Array.from(this.features.values());
    }
    
    /**
     * Initialize the feature manager with game state
     */
    public initialize(gameState: GameState): void {
        this.gameState = gameState;
        this.features.forEach(feature => feature.initialize(gameState));
    }
    
    /**
     * Update all features
     */
    public update(deltaTime: number): void {
        this.features.forEach(feature => feature.update(deltaTime));
    }
    
    /**
     * Clean up all features
     */
    public cleanup(): void {
        this.features.forEach(feature => feature.cleanup());
        this.features.clear();
        this.gameState = null;
    }
    
    /**
     * Get the speed control feature
     */
    public getSpeedControlFeature(): SpeedControlFeature | null {
        return this.speedControlFeature;
    }
    
    /**
     * Check if a feature is active
     */
    public isFeatureActive(id: string): boolean {
        const feature = this.features.get(id);
        return feature ? feature.isActive : false;
    }
} 