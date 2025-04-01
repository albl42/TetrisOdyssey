import { Board } from './Board.js';
import { Tetromino, TetrominoType } from './Tetromino.js';

export class Game {
    private board: Board;
    private currentPiece!: Tetromino;
    private score: number;
    private gameOver: boolean;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private blockSize: number;
    private dropInterval: number;
    private lastDropTime: number;

    constructor() {
        console.log('Initializing game...');
        this.board = new Board();
        this.score = 0;
        this.gameOver = false;
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2D context from canvas');
        }
        this.ctx = context;
        this.blockSize = 30;
        this.dropInterval = 1000; // 1 second between drops
        this.lastDropTime = 0;
        
        console.log('Canvas initialized:', this.canvas.width, 'x', this.canvas.height);
        this.spawnPiece();
        this.setupControls();
        this.draw(); // Draw initial state
        this.update(0); // Start game loop
    }

    private spawnPiece(): void {
        const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        this.currentPiece = new Tetromino(randomType);
        console.log('Spawned piece:', randomType);
        
        if (!this.board.isValidMove(this.currentPiece, this.currentPiece.getX(), this.currentPiece.getY())) {
            this.gameOver = true;
        }
    }

    private setupControls(): void {
        document.addEventListener('keydown', (event) => {
            if (this.gameOver) return;

            switch (event.key) {
                case 'ArrowLeft':
                    if (this.board.isValidMove(this.currentPiece, this.currentPiece.getX() - 1, this.currentPiece.getY())) {
                        this.currentPiece.moveLeft();
                    }
                    break;
                case 'ArrowRight':
                    if (this.board.isValidMove(this.currentPiece, this.currentPiece.getX() + 1, this.currentPiece.getY())) {
                        this.currentPiece.moveRight();
                    }
                    break;
                case 'ArrowDown':
                    if (this.board.isValidMove(this.currentPiece, this.currentPiece.getX(), this.currentPiece.getY() + 1)) {
                        this.currentPiece.moveDown();
                    }
                    break;
                case 'ArrowUp':
                    this.currentPiece.rotate();
                    if (!this.board.isValidMove(this.currentPiece, this.currentPiece.getX(), this.currentPiece.getY())) {
                        this.currentPiece.rotate();
                        this.currentPiece.rotate();
                        this.currentPiece.rotate();
                    }
                    break;
            }
            this.draw();
        });
    }

    private update(currentTime: number): void {
        if (this.gameOver) {
            this.drawGameOver();
            return;
        }

        // Handle automatic dropping
        if (currentTime - this.lastDropTime > this.dropInterval) {
            if (this.board.isValidMove(this.currentPiece, this.currentPiece.getX(), this.currentPiece.getY() + 1)) {
                this.currentPiece.moveDown();
            } else {
                this.board.placePiece(this.currentPiece);
                const linesCleared = this.board.clearLines();
                this.updateScore(linesCleared);
                this.spawnPiece();
            }
            this.lastDropTime = currentTime;
        }

        this.draw();
        requestAnimationFrame(this.update.bind(this));
    }

    private updateScore(linesCleared: number): void {
        const points = [0, 100, 300, 500, 800];
        this.score += points[linesCleared];
        document.getElementById('score')!.textContent = `Score: ${this.score}`;
    }

    private draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw board
        const grid = this.board.getGrid();
        const colors = this.board.getColors();
        
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (grid[row][col]) {
                    this.drawBlock(col, row, colors[row][col]);
                }
            }
        }

        // Draw current piece
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    this.drawBlock(this.currentPiece.getX() + col, this.currentPiece.getY() + row, this.currentPiece.color);
                }
            }
        }
    }

    private drawBlock(x: number, y: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize - 1, this.blockSize - 1);
    }

    private drawGameOver(): void {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
    }
} 