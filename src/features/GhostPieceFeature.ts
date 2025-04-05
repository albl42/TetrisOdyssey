import { GameFeature } from './GameFeature.js';
import { Tetromino } from '../tetromino/Tetromino.js';

/**
 * Feature that shows a ghost piece indicating where the current piece will land
 */
export class GhostPieceFeature extends GameFeature {
    private ghostPiece: Tetromino | null = null;
    private ghostX: number = 0;
    private ghostY: number = 0;
    
    constructor() {
        super(
            'ghost-piece',
            'Ghost Piece',
            'Shows where the piece will land',
            false
        );
    }
    
    protected onActivate(): void {
        // Nothing to do on activation
    }
    
    protected onDeactivate(): void {
        this.ghostPiece = null;
    }
    
    protected onUpdate(deltaTime: number): void {
        if (!this.gameState) return;
        
        const board = this.gameState.getBoard();
        const currentPiece = board.getCurrentPiece();
        
        if (!currentPiece) {
            this.ghostPiece = null;
            return;
        }
        
        // Create a ghost piece with the same type as the current piece
        this.ghostPiece = new Tetromino(currentPiece.tetromino.getType());
        this.ghostPiece.shape = currentPiece.tetromino.shape.map(row => [...row]);
        this.ghostPiece.color = 'rgba(255, 255, 255, 0.3)';
        
        // Calculate ghost position (same as current piece but at bottom)
        this.ghostX = currentPiece.x;
        this.ghostY = currentPiece.y;
        
        // Move ghost piece to bottom
        while (board.isValidMove(this.ghostPiece, this.ghostX, this.ghostY + 1)) {
            this.ghostY++;
        }
    }
    
    /**
     * Get the ghost piece for rendering
     */
    public getGhostPiece(): { tetromino: Tetromino, x: number, y: number } | null {
        if (!this.ghostPiece) return null;
        return { tetromino: this.ghostPiece, x: this.ghostX, y: this.ghostY };
    }
} 