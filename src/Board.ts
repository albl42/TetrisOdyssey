import { Tetromino } from './tetromino/Tetromino.js';

/**
 * Represents a Tetromino with its position on the board
 */
interface TetrominoPosition {
    tetromino: Tetromino;
    x: number;
    y: number;
}

export class Board {
    private grid: number[][];
    private colors: string[][];
    private readonly width: number;
    private readonly height: number;
    private currentPiece: TetrominoPosition | null = null;

    constructor(width: number = 10, height: number = 20) {
        this.width = width;
        this.height = height;
        this.grid = Array(height).fill(null).map(() => Array(width).fill(0));
        this.colors = Array(height).fill(null).map(() => Array(width).fill(''));
    }

    /**
     * Sets the current active piece on the board
     * @param tetromino The Tetromino to set as current
     * @param x The x position
     * @param y The y position
     */
    public setCurrentPiece(tetromino: Tetromino, x: number = 3, y: number = 0): void {
        this.currentPiece = { tetromino, x, y };
    }

    /**
     * Gets the current active piece
     * @returns The current Tetromino with its position
     */
    public getCurrentPiece(): TetrominoPosition | null {
        return this.currentPiece;
    }

    /**
     * Checks if a move is valid
     * @param tetromino The Tetromino to check
     * @param x The x position to check
     * @param y The y position to check
     * @returns Whether the move is valid
     */
    public isValidMove(tetromino: Tetromino, x: number, y: number): boolean {
        for (let row = 0; row < tetromino.shape.length; row++) {
            for (let col = 0; col < tetromino.shape[row].length; col++) {
                if (tetromino.shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    if (newX < 0 || newX >= this.width || 
                        newY >= this.height ||
                        (newY >= 0 && this.grid[newY][newX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Moves the current piece left
     * @returns Whether the move was successful
     */
    public moveCurrentPieceLeft(): boolean {
        if (!this.currentPiece) return false;
        
        const newX = this.currentPiece.x - 1;
        if (this.isValidMove(this.currentPiece.tetromino, newX, this.currentPiece.y)) {
            this.currentPiece.x = newX;
            return true;
        }
        return false;
    }

    /**
     * Moves the current piece right
     * @returns Whether the move was successful
     */
    public moveCurrentPieceRight(): boolean {
        if (!this.currentPiece) return false;
        
        const newX = this.currentPiece.x + 1;
        if (this.isValidMove(this.currentPiece.tetromino, newX, this.currentPiece.y)) {
            this.currentPiece.x = newX;
            return true;
        }
        return false;
    }

    /**
     * Moves the current piece down
     * @returns Whether the move was successful
     */
    public moveCurrentPieceDown(): boolean {
        if (!this.currentPiece) return false;
        
        const newY = this.currentPiece.y + 1;
        if (this.isValidMove(this.currentPiece.tetromino, this.currentPiece.x, newY)) {
            this.currentPiece.y = newY;
            return true;
        }
        return false;
    }

    /**
     * Rotates the current piece
     * @returns Whether the rotation was successful
     */
    public rotateCurrentPiece(): boolean {
        if (!this.currentPiece) return false;
        
        this.currentPiece.tetromino.rotate();
        
        // If rotation is invalid, rotate back
        if (!this.isValidMove(this.currentPiece.tetromino, this.currentPiece.x, this.currentPiece.y)) {
            this.currentPiece.tetromino.rotate();
            this.currentPiece.tetromino.rotate();
            this.currentPiece.tetromino.rotate();
            return false;
        }
        
        return true;
    }

    /**
     * Places the current piece on the board
     */
    public placeCurrentPiece(): void {
        if (!this.currentPiece) return;
        
        const { tetromino, x, y } = this.currentPiece;
        
        for (let row = 0; row < tetromino.shape.length; row++) {
            for (let col = 0; col < tetromino.shape[row].length; col++) {
                if (tetromino.shape[row][col]) {
                    const boardY = y + row;
                    if (boardY >= 0) {
                        this.grid[boardY][x + col] = 1;
                        this.colors[boardY][x + col] = tetromino.color;
                    }
                }
            }
        }
        
        this.currentPiece = null;
    }

    /**
     * Performs a hard drop of the current piece
     * @returns The number of lines cleared
     */
    public hardDropCurrentPiece(): number {
        if (!this.currentPiece) return 0;
        
        while (this.moveCurrentPieceDown()) {
            // Continue moving down until it can't move further
        }
        
        this.placeCurrentPiece();
        return this.clearLines();
    }

    clearLines(): number {
        let linesCleared = 0;
        
        for (let row = this.height - 1; row >= 0; row--) {
            if (this.grid[row].every(cell => cell === 1)) {
                this.grid.splice(row, 1);
                this.colors.splice(row, 1);
                this.grid.unshift(Array(this.width).fill(0));
                this.colors.unshift(Array(this.width).fill(''));
                linesCleared++;
                row++;
            }
        }
        
        return linesCleared;
    }

    isGameOver(): boolean {
        return this.grid[0].some(cell => cell === 1);
    }

    getGrid(): number[][] {
        return this.grid;
    }

    getColors(): string[][] {
        return this.colors;
    }

    /**
     * Resets the board to its initial state
     */
    public reset(): void {
        this.grid = Array(this.height).fill(null).map(() => Array(this.width).fill(0));
        this.colors = Array(this.height).fill(null).map(() => Array(this.width).fill(''));
        this.currentPiece = null;
    }
} 