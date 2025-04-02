import { Board } from './Board.js';
import { Tetromino, TetrominoType } from './Tetromino.js';
import { GameFeatures } from './GameFeatures.js';
import { FeaturePanel } from './FeaturePanel.js';
import { NextPiecesPreview } from './NextPiecesPreview.js';
import { GameOverScreen } from './GameOverScreen.js';

export class Game {
    private board: Board;
    private currentPiece!: Tetromino;
    private nextPieces: Tetromino[];
    private score: number;
    private gameOver: boolean;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private blockSize: number;
    private dropInterval: number;
    private lastDropTime: number;
    private features: GameFeatures;
    private featurePanel: FeaturePanel;
    private nextPiecesPreview: NextPiecesPreview;
    private gameOverScreen: GameOverScreen;

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
        this.nextPieces = [];
        
        // Initialize features and panels
        this.features = new GameFeatures();
        this.featurePanel = new FeaturePanel(this.features.getAllFeatures(), 'left');
        this.nextPiecesPreview = new NextPiecesPreview(this.blockSize);
        this.gameOverScreen = new GameOverScreen(() => this.restart());
        
        // Add panels to the game container
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.appendChild(this.featurePanel.getElement());
            gameContainer.appendChild(this.nextPiecesPreview.getElement());
        }
        
        console.log('Canvas initialized:', this.canvas.width, 'x', this.canvas.height);
        this.initializeNextPieces();
        this.spawnPiece();
        this.setupControls();
        this.draw(); // Draw initial state
        this.update(0); // Start game loop
    }

    private initializeNextPieces(): void {
        // Generate 3 next pieces
        for (let i = 0; i < 3; i++) {
            this.nextPieces.push(this.generateRandomPiece());
        }
        this.nextPiecesPreview.updatePreviews(this.nextPieces);
    }

    private generateRandomPiece(): Tetromino {
        const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        return new Tetromino(randomType);
    }

    private spawnPiece(): void {
        if (this.nextPieces.length === 0) {
            this.initializeNextPieces();
        }
        
        this.currentPiece = this.nextPieces.shift()!;
        this.currentPiece.setPosition(3, 0);
        
        // Check if the new piece can be placed
        if (!this.board.isValidMove(this.currentPiece, this.currentPiece.getX(), this.currentPiece.getY())) {
            this.gameOver = true;
            return; // Don't spawn new pieces if game is over
        }
        
        // Add a new piece to the queue
        this.nextPieces.push(this.generateRandomPiece());
        this.nextPiecesPreview.updatePreviews(this.nextPieces);
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
                case ' ': // Space bar for hard drop
                    if (this.features.isFeatureActive('hard-drop')) {
                        this.hardDrop();
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

        // Draw ghost piece if enabled
        if (this.features.isFeatureActive('ghost-piece')) {
            this.drawGhostPiece();
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

    private drawGhostPiece(): void {
        // Create a ghost piece with the same type as the current piece
        const ghostPiece = new Tetromino(this.currentPiece.getType());
        ghostPiece.color = 'rgba(255, 255, 255, 0.3)';
        
        // Copy the current piece's shape to maintain rotation
        ghostPiece.shape = this.currentPiece.shape.map(row => [...row]);
        
        // Set the ghost piece's position to match the current piece
        ghostPiece.setPosition(this.currentPiece.getX(), this.currentPiece.getY());
        
        // Move ghost piece to bottom
        while (this.board.isValidMove(ghostPiece, ghostPiece.getX(), ghostPiece.getY() + 1)) {
            ghostPiece.moveDown();
        }

        // Draw ghost piece
        for (let row = 0; row < ghostPiece.shape.length; row++) {
            for (let col = 0; col < ghostPiece.shape[row].length; col++) {
                if (ghostPiece.shape[row][col]) {
                    this.drawBlock(ghostPiece.getX() + col, ghostPiece.getY() + row, ghostPiece.color);
                }
            }
        }
    }

    private drawGameOver(): void {
        this.gameOverScreen.show(this.score);
    }

    private restart(): void {
        this.gameOverScreen.hide();

        // Reset game state
        this.board = new Board();
        this.score = 0;
        this.gameOver = false;
        this.lastDropTime = 0;
        this.nextPieces = [];
        
        // Update score display
        document.getElementById('score')!.textContent = 'Score: 0';
        
        // Initialize new pieces and start game
        this.initializeNextPieces();
        this.spawnPiece();
        this.draw();
        this.update(0);
    }

    private hardDrop(): void {
        while (this.board.isValidMove(this.currentPiece, this.currentPiece.getX(), this.currentPiece.getY() + 1)) {
            this.currentPiece.moveDown();
        }
        this.board.placePiece(this.currentPiece);
        const linesCleared = this.board.clearLines();
        this.updateScore(linesCleared);
        this.spawnPiece();
    }
} 