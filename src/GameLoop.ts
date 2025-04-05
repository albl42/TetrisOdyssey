import { GameState } from './GameState.js';
import { FeatureManager } from './features/FeatureManager.js';
import { HardDropFeature } from './features/HardDropFeature.js';

/**
 * Manages the game loop and timing
 */
export class GameLoop {
    private gameState: GameState;
    private featureManager: FeatureManager;
    private onFrame: () => void;
    private lastTime: number = 0;
    private dropInterval: number = 1000; // Default drop interval in milliseconds
    private timeSinceLastDrop: number = 0;
    private isRunning: boolean = false;
    private animationFrameId: number | null = null;
    
    constructor(
        gameState: GameState,
        featureManager: FeatureManager,
        onFrame: () => void
    ) {
        this.gameState = gameState;
        this.featureManager = featureManager;
        this.onFrame = onFrame;
    }
    
    /**
     * Start the game loop
     */
    public start(): void {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        this.timeSinceLastDrop = 0;
        this.gameLoop();
    }
    
    /**
     * Stop the game loop
     */
    public stop(): void {
        this.isRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    /**
     * Set the drop interval
     */
    public setDropInterval(interval: number): void {
        this.dropInterval = interval;
    }
    
    /**
     * The main game loop
     */
    private gameLoop(currentTime: number = 0): void {
        if (!this.isRunning) return;
        
        // Calculate delta time
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update time since last drop
        this.timeSinceLastDrop += deltaTime;
        
        // Check if it's time to drop the piece
        if (this.timeSinceLastDrop >= this.dropInterval) {
            this.dropPiece();
            this.timeSinceLastDrop = 0;
        }
        
        // Update features
        this.featureManager.update(deltaTime);
        
        // Call the frame callback
        this.onFrame();
        
        // Schedule next frame
        this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    /**
     * Drop the current piece
     */
    private dropPiece(): void {
        if (this.gameState.isGameOver()) return;
        
        const board = this.gameState.getBoard();
        if (!board.moveCurrentPieceDown()) {
            // Piece has landed, place it and handle the aftermath
            board.placeCurrentPiece();
            const linesCleared = board.clearLines();
            this.gameState.updateScore(linesCleared);
            this.gameState.spawnPiece();
        }
    }
    
    /**
     * Perform a hard drop
     */
    public hardDrop(): void {
        if (this.gameState.isGameOver()) return;
        
        const hardDropFeature = this.featureManager.getFeature<HardDropFeature>('hard-drop');
        if (hardDropFeature) {
            hardDropFeature.hardDrop();
        }
    }
} 