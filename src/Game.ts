import { Board } from './Board.js';
import { Tetromino } from './tetromino/Tetromino.js';
import { TetrominoType } from './tetromino/TetrominoType.js';
import { FeatureManager } from './features/FeatureManager.js';
import { FeaturePanel } from './ui/FeaturePanel.js';
import { NextPiecesPreview } from './ui/NextPiecesPreview.js';
import { GameOverScreen } from './ui/GameOverScreen.js';
import { TetrominoGenerator } from './tetromino/TetrominoGenerator.js';
import { Controls } from './Controls.js';
import { GameLoop } from './GameLoop.js';
import { GameState } from './GameState.js';
import { GhostPieceFeature } from './features/GhostPieceFeature.js';
import { SpeedControlFeature } from './features/SpeedControlFeature.js';
import { Layout } from './ui/Layout.js';
import { Renderer } from './Renderer.js';
import { InputHandler } from './InputHandler.js';

export class Game {
    private board: Board;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private blockSize: number = 30;
    private featureManager: FeatureManager;
    private featurePanel: FeaturePanel;
    private nextPiecesPreview: NextPiecesPreview;
    private gameOverScreen: GameOverScreen;
    private tetrominoGenerator: TetrominoGenerator;
    private controls: Controls;
    private gameState: GameState;
    private gameLoop: GameLoop;
    private layout: Layout;
    private renderer: Renderer;
    private scale: number = 1;

    constructor() {
        console.log('Initializing game...');
        
        // Initialize layout
        this.layout = new Layout();
        document.body.appendChild(this.layout.getElement());
        console.log('Layout added to document body');
        
        // Prevent spacebar from scrolling
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
            }
        });
        
        // Get the canvas from the layout
        this.canvas = this.layout.getCanvas();
        console.log('Canvas retrieved from layout:', this.canvas);
        
        // Get canvas context
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2D context from canvas');
        }
        this.ctx = context;
        console.log('Canvas context obtained');
        
        // Calculate initial scale
        this.updateScale();
        
        // Initialize game components
        this.board = new Board();
        this.tetrominoGenerator = new TetrominoGenerator();
        console.log('Board and tetromino generator initialized');
        
        // Initialize feature manager first
        this.featureManager = new FeatureManager();
        console.log('Feature manager initialized');
        
        // Initialize game state
        this.gameState = new GameState(
            this.board,
            this.tetrominoGenerator,
            (score) => this.updateScoreDisplay(score),
            (score) => this.handleGameOver(score),
            (interval) => this.gameLoop.setDropInterval(interval),
            this.featureManager
        );
        console.log('Game state initialized');
        
        // Initialize feature manager with game state
        this.featureManager.initialize(this.gameState);
        
        // Initialize game loop
        this.gameLoop = new GameLoop(
            this.gameState,
            this.featureManager,
            () => this.draw()
        );
        console.log('Game loop initialized');
        
        // Initialize UI components
        this.featurePanel = new FeaturePanel();
        this.featurePanel.initializeControls(this.featureManager.getAllFeatures());
        this.nextPiecesPreview = new NextPiecesPreview(this.blockSize);
        this.gameOverScreen = new GameOverScreen(() => this.restart());
        
        // Initialize controls with proper callbacks
        this.controls = new Controls(
            this.board,
            this.featureManager,
            () => this.draw(),
            () => this.hardDrop()
        );
        console.log('Controls initialized');
        
        // Initialize renderer
        this.renderer = new Renderer(this.canvas);
        console.log('Renderer initialized');
        
        // Add panels to the sidebar
        const sidebar = this.layout.getSidebar();
        sidebar.appendChild(this.featurePanel.getElement());
        sidebar.appendChild(this.nextPiecesPreview.getElement());
        console.log('Panels added to sidebar');
        
        // Add game over screen to the main content area
        const mainContent = this.layout.getMainContent();
        mainContent.appendChild(this.gameOverScreen.getElement());
        console.log('Game over screen added to main content');
        
        console.log('Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
        
        // Start the game loop
        this.gameLoop.start();
        console.log('Game loop started');
        
        console.log('Game initialization complete');
    }

    private updateScale(): void {
        // Calculate scale based on canvas size vs ideal size
        const idealWidth = 10 * this.blockSize;  // 10 blocks wide
        const idealHeight = 20 * this.blockSize; // 20 blocks high
        
        this.scale = Math.min(
            this.canvas.width / idealWidth,
            this.canvas.height / idealHeight
        );
        
        console.log('Canvas scale updated:', this.scale);
    }

    private drawTestPattern(): void {
        console.log('Drawing test pattern...');
        // Draw a test pattern to verify canvas is working
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(0, 0, this.blockSize, this.blockSize);
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillRect(this.blockSize, 0, this.blockSize, this.blockSize);
        this.ctx.fillStyle = '#0000FF';
        this.ctx.fillRect(0, this.blockSize, this.blockSize, this.blockSize);
        console.log('Test pattern drawn with colors: red, green, blue');
    }

    private handleGameOver(score: number): void {
        console.log('Game Over! Score:', score);
        this.gameOverScreen.show(score);
    }

    private updateScoreDisplay(score: number): void {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = `Score: ${score}`;
        }
    }

    private draw(): void {
        console.log('Drawing game state...');
        
        // Update scale before drawing
        this.updateScale();
        
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        console.log('Canvas cleared');
        
        // Draw the board
        this.drawBoard();
        console.log('Board drawn');
        
        // Draw ghost piece if enabled
        if (this.featureManager.isFeatureActive('ghost-piece')) {
            this.drawGhostPiece();
            console.log('Ghost piece drawn');
        }
        
        // Update next pieces preview
        this.nextPiecesPreview.updatePreviews(this.gameState.getNextPieces());
        console.log('Next pieces preview updated');

        // Update feature panel
        this.featurePanel.update();
        console.log('Feature panel updated');
    }

    private drawBoard(): void {
        // Draw the board grid
        const grid = this.board.getGrid();
        const colors = this.board.getColors();
        
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] === 1) {
                    this.drawBlock(x, y, colors[y][x]);
                }
            }
        }
        
        // Draw the current piece
        const currentPiece = this.board.getCurrentPiece();
        if (currentPiece) {
            const { tetromino, x, y } = currentPiece;
            this.drawTetromino(tetromino, x, y);
        }
    }
    
    private drawGhostPiece(): void {
        const ghostPieceFeature = this.featureManager.getFeature<GhostPieceFeature>('ghost-piece');
        if (!ghostPieceFeature) return;
        
        const ghostPiece = ghostPieceFeature.getGhostPiece();
        if (ghostPiece) {
            const { tetromino, x, y } = ghostPiece;
            this.drawTetromino(tetromino, x, y);
        }
    }

    private drawBlock(x: number, y: number, color: string): void {
        const scaledX = x * this.blockSize * this.scale;
        const scaledY = y * this.blockSize * this.scale;
        const scaledSize = this.blockSize * this.scale;
        
        this.ctx.fillStyle = color;
        this.ctx.fillRect(scaledX, scaledY, scaledSize, scaledSize);
        
        // Draw block border
        this.ctx.strokeStyle = '#000';
        this.ctx.strokeRect(scaledX, scaledY, scaledSize, scaledSize);
    }

    private drawTetromino(tetromino: Tetromino, x: number, y: number): void {
        const shape = tetromino.shape;
        const color = tetromino.color;
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] === 1) {
                    this.drawBlock(x + col, y + row, color);
                }
            }
        }
    }

    private restart(): void {
        this.gameOverScreen.hide();
        
        // Stop the current game loop
        if (this.gameLoop) {
            this.gameLoop.stop();
        }
        
        // Reset game state
        this.board = new Board();
        this.tetrominoGenerator = new TetrominoGenerator();
        
        // Reinitialize feature manager first
        this.featureManager = new FeatureManager();
        
        // Create a new game state
        this.gameState = new GameState(
            this.board,
            this.tetrominoGenerator,
            (score) => this.updateScoreDisplay(score),
            (score) => this.handleGameOver(score),
            (interval) => this.gameLoop.setDropInterval(interval),
            this.featureManager
        );
        
        // Initialize feature manager with the new game state
        this.featureManager.initialize(this.gameState);
        
        // Create a new game loop with the new game state
        this.gameLoop = new GameLoop(
            this.gameState,
            this.featureManager,
            () => this.draw()
        );
        
        // Reinitialize feature panel
        this.featurePanel = new FeaturePanel();
        this.featurePanel.initializeControls(this.featureManager.getAllFeatures());
        
        // Update the feature panel in the sidebar
        const sidebar = this.layout.getSidebar();
        const oldPanel = sidebar.querySelector('.feature-panel');
        if (oldPanel) {
            sidebar.removeChild(oldPanel);
        }
        sidebar.insertBefore(this.featurePanel.getElement(), sidebar.firstChild);
        
        // Reinitialize controls with new board
        this.controls = new Controls(
            this.board,
            this.featureManager,
            () => this.draw(),
            () => this.hardDrop()
        );
        
        // Start the game
        this.draw();
        this.gameLoop.start();
    }

    private hardDrop(): void {
        this.gameLoop.hardDrop();
    }
} 