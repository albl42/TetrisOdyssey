import { Board } from './Board.js';
import { TetrominoGenerator } from './tetromino/TetrominoGenerator.js';
import { Tetromino } from './tetromino/Tetromino.js';
import { FeatureManager } from './features/FeatureManager.js';
import { HoldPieceFeature } from './features/HoldPieceFeature.js';

/**
 * Manages the game state for the Tetris game.
 * This class is responsible for tracking score, game over status,
 * next pieces, and handling state-related operations.
 */
export class GameState {
    private board: Board;
    private nextPieces: Tetromino[];
    private score: number;
    private gameOver: boolean;
    private tetrominoGenerator: TetrominoGenerator;
    private onScoreUpdate: (score: number) => void;
    private onGameOver: (score: number) => void;
    private dropInterval: number = 1000; // Default drop interval in milliseconds
    private onDropIntervalChange: ((interval: number) => void) | null = null;
    private featureManager?: FeatureManager;

    constructor(
        board: Board,
        tetrominoGenerator: TetrominoGenerator,
        onScoreUpdate: (score: number) => void,
        onGameOver: (score: number) => void,
        onDropIntervalChange?: (interval: number) => void,
        featureManager?: FeatureManager
    ) {
        this.board = board;
        this.tetrominoGenerator = tetrominoGenerator;
        this.onScoreUpdate = onScoreUpdate;
        this.onGameOver = onGameOver;
        this.onDropIntervalChange = onDropIntervalChange || null;
        this.featureManager = featureManager;
        
        this.score = 0;
        this.gameOver = false;
        this.nextPieces = [];
        
        this.initializeNextPieces();
        this.spawnPiece();
    }

    public reset(): void {
        this.board.reset();
        this.score = 0;
        this.gameOver = false;
        this.nextPieces = [];
        this.onScoreUpdate(this.score);
        
        this.initializeNextPieces();
        this.spawnPiece();
    }

    private initializeNextPieces(): void {
        // Generate 3 next pieces
        this.nextPieces = this.tetrominoGenerator.generateMultiplePieces(3);
    }

    public spawnPiece(specificPiece?: Tetromino): void {
        if (this.nextPieces.length === 0) {
            this.initializeNextPieces();
        }
        
        let newPiece: Tetromino;
        if (specificPiece) {
            newPiece = specificPiece;
        } else {
            newPiece = this.nextPieces.shift()!;
        }
        
        this.board.setCurrentPiece(newPiece, 3, 0);
        
        // Check if the new piece can be placed
        if (!this.board.isValidMove(newPiece, 3, 0)) {
            this.gameOver = true;
            this.onGameOver(this.score);
            return; // Don't spawn new pieces if game is over
        }
        
        // Add a new piece to the queue if we used one from the queue
        if (!specificPiece) {
            this.nextPieces.push(this.tetrominoGenerator.generateRandomPiece());
        }
        
        // Reset hold ability for the new piece
        const holdFeature = this.featureManager?.getFeature<HoldPieceFeature>('hold-piece');
        if (holdFeature) {
            holdFeature.resetHold();
        }
    }

    public updateScore(linesCleared: number): void {
        const points = [0, 100, 300, 500, 800];
        this.score += points[linesCleared];
        this.onScoreUpdate(this.score);
    }

    public getNextPieces(): Tetromino[] {
        return [...this.nextPieces];
    }

    public getScore(): number {
        return this.score;
    }

    public isGameOver(): boolean {
        // Check both the game state's game over flag and the board's game over state
        if (this.gameOver || this.board.isGameOver()) {
            if (!this.gameOver) {
                // If the board detected game over but our state didn't, update it
                this.gameOver = true;
                this.onGameOver(this.score);
            }
            return true;
        }
        return false;
    }

    public getBoard(): Board {
        return this.board;
    }
    
    /**
     * Set the drop interval for the game loop
     * @param interval The new drop interval in milliseconds
     */
    public setDropInterval(interval: number): void {
        this.dropInterval = interval;
        if (this.onDropIntervalChange) {
            this.onDropIntervalChange(interval);
        }
    }
    
    /**
     * Get the current drop interval
     */
    public getDropInterval(): number {
        return this.dropInterval;
    }
    
    /**
     * Set the callback for when the drop interval changes
     */
    public setOnDropIntervalChange(callback: (interval: number) => void): void {
        this.onDropIntervalChange = callback;
    }
} 