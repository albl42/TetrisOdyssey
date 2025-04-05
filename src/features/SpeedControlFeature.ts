import { GameFeature } from './GameFeature.js';

/**
 * Feature that allows controlling the drop speed of pieces
 */
export class SpeedControlFeature extends GameFeature {
    private baseDropInterval: number = 1000; // Base drop interval in milliseconds
    private currentDropInterval: number = 1000;
    private minDropInterval: number = 100; // Fastest speed (100ms between drops)
    private maxDropInterval: number = 2000; // Slowest speed (2 seconds between drops)
    
    constructor() {
        super(
            'game-speed',
            'Game Speed',
            'Adjust the drop speed of pieces',
            true
        );
    }
    
    protected onActivate(): void {
        // Nothing to do on activation
    }
    
    protected onDeactivate(): void {
        // Reset to default speed when deactivated
        this.currentDropInterval = this.baseDropInterval;
        this.updateGameLoopSpeed();
    }
    
    protected onUpdate(deltaTime: number): void {
        // This feature doesn't need to update each frame
        // It's triggered by user input instead
    }
    
    /**
     * Set the drop speed based on a slider value (1-10)
     */
    public setSpeed(speedValue: number): void {
        // Convert speed value (1-10) to drop interval (2000ms to 100ms)
        // Lower interval = faster speed
        const speedRange = this.maxDropInterval - this.minDropInterval;
        this.currentDropInterval = this.maxDropInterval - ((speedValue - 1) / 9) * speedRange;
        this.updateGameLoopSpeed();
    }
    
    /**
     * Get the current speed value (1-10)
     */
    public getSpeedValue(): number {
        const speedRange = this.maxDropInterval - this.minDropInterval;
        const normalizedValue = (this.maxDropInterval - this.currentDropInterval) / speedRange;
        return Math.round(normalizedValue * 9 + 1); // Convert to 1-10 range
    }
    
    /**
     * Get the current drop interval
     */
    public getDropInterval(): number {
        return this.currentDropInterval;
    }
    
    /**
     * Update the game loop's drop interval
     */
    private updateGameLoopSpeed(): void {
        if (this.gameState) {
            this.gameState.setDropInterval(this.currentDropInterval);
        }
    }
} 