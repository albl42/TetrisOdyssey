import { GameFeature } from './GameFeature.js';

/**
 * Feature that allows instantly dropping a piece to the bottom
 */
export class HardDropFeature extends GameFeature {
    constructor() {
        super(
            'hard-drop',
            'Hard Drop',
            'Instantly drop piece to bottom',
            true
        );
    }
    
    protected onActivate(): void {
        // Nothing to do on activation
    }
    
    protected onDeactivate(): void {
        // Nothing to do on deactivation
    }
    
    protected onUpdate(deltaTime: number): void {
        // This feature doesn't need to update each frame
        // It's triggered by user input instead
    }
    
    /**
     * Perform a hard drop of the current piece
     * @returns The number of lines cleared
     */
    public hardDrop(): number {
        if (!this.gameState) return 0;
        
        const board = this.gameState.getBoard();
        const linesCleared = board.hardDropCurrentPiece();
        this.gameState.updateScore(linesCleared);
        this.gameState.spawnPiece();
        
        return linesCleared;
    }
} 