import { Tetromino } from './Tetromino.js';

export class Board {
    private grid: number[][];
    private colors: string[][];
    private readonly width: number;
    private readonly height: number;

    constructor(width: number = 10, height: number = 20) {
        this.width = width;
        this.height = height;
        this.grid = Array(height).fill(null).map(() => Array(width).fill(0));
        this.colors = Array(height).fill(null).map(() => Array(width).fill(''));
    }

    isValidMove(tetromino: Tetromino, x: number, y: number): boolean {
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

    placePiece(tetromino: Tetromino): void {
        const x = tetromino.getX();
        const y = tetromino.getY();

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
} 