import { GameFeature } from './GameFeature.js';
import { Tetromino } from '../tetromino/Tetromino.js';

/**
 * Feature that allows storing a piece for later use
 */
export class HoldPieceFeature extends GameFeature {
    private heldPiece: Tetromino | null = null;
    private canHold: boolean = true;
    
    constructor() {
        super(
            'hold-piece',
            'Hold Piece',
            'Store a piece for later use',
            false
        );
    }
    
    protected onActivate(): void {
        // Nothing to do on activation
    }
    
    protected onDeactivate(): void {
        this.heldPiece = null;
        this.canHold = true;
    }
    
    protected onUpdate(deltaTime: number): void {
        // This feature doesn't need to update each frame
        // It's triggered by user input instead
    }
    
    /**
     * Hold the current piece and get the previously held piece (if any)
     */
    public holdPiece(): void {
        if (!this.gameState || !this.canHold) return;
        
        const board = this.gameState.getBoard();
        const currentPiece = board.getCurrentPiece();
        
        if (!currentPiece) return;
        
        // Store the current piece's tetromino
        const currentTetromino = currentPiece.tetromino;
        
        // If there's a held piece, spawn it
        if (this.heldPiece) {
            this.gameState.spawnPiece(this.heldPiece);
        } else {
            // If no held piece, spawn the next piece from the queue
            this.gameState.spawnPiece();
        }
        
        // Store the current piece as the held piece
        this.heldPiece = currentTetromino;
        this.canHold = false;
    }
    
    /**
     * Reset the hold ability (called when a new piece is spawned)
     */
    public resetHold(): void {
        this.canHold = true;
    }
    
    /**
     * Get the currently held piece
     */
    public getHeldPiece(): Tetromino | null {
        return this.heldPiece;
    }
} 