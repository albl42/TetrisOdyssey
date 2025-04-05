import { Board } from './Board.js';
import { FeatureManager } from './features/FeatureManager.js';
import { HoldPieceFeature } from './features/HoldPieceFeature.js';

/**
 * Class responsible for handling game controls and input.
 * This class encapsulates all keyboard input handling and piece movement logic.
 */
export class Controls {
    private board: Board;
    private featureManager: FeatureManager;
    private onPieceMove: () => void;
    private onHardDrop: () => void;
    private keyStates: Map<string, boolean> = new Map();
    private lastActionTime: Map<string, number> = new Map();
    private readonly ACTION_COOLDOWN = 100; // ms between repeated actions
    private readonly SOFT_DROP_INTERVAL = 50; // ms between soft drops
    private readonly HARD_DROP_COOLDOWN = 500; // ms between hard drops

    constructor(
        board: Board,
        featureManager: FeatureManager,
        onPieceMove: () => void,
        onHardDrop: () => void
    ) {
        this.board = board;
        this.featureManager = featureManager;
        this.onPieceMove = onPieceMove;
        this.onHardDrop = onHardDrop;
        this.setupControls();
    }

    /**
     * Sets up keyboard event listeners for game controls
     */
    private setupControls(): void {
        // Prevent spacebar from scrolling
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
            }
        });

        // Handle key down events
        document.addEventListener('keydown', (event) => {
            const key = event.code;
            if (!this.keyStates.get(key)) {
                this.keyStates.set(key, true);
                this.handleKeyPress(key);
            }
        });

        // Handle key up events
        document.addEventListener('keyup', (event) => {
            const key = event.code;
            this.keyStates.set(key, false);
        });

        // Set up game loop for continuous actions
        this.startGameLoop();
    }

    /**
     * Start the game loop for handling continuous actions
     */
    private startGameLoop(): void {
        const gameLoop = () => {
            this.handleContinuousActions();
            requestAnimationFrame(gameLoop);
        };
        requestAnimationFrame(gameLoop);
    }

    /**
     * Handle initial key press actions
     */
    private handleKeyPress(key: string): void {
        const now = Date.now();
        const lastAction = this.lastActionTime.get(key) || 0;

        if (now - lastAction < this.ACTION_COOLDOWN) {
            return;
        }

        switch (key) {
            case 'ArrowLeft':
                if (this.board.moveCurrentPieceLeft()) {
                    this.onPieceMove();
                }
                break;
            case 'ArrowRight':
                if (this.board.moveCurrentPieceRight()) {
                    this.onPieceMove();
                }
                break;
            case 'ArrowUp':
                if (this.board.rotateCurrentPiece()) {
                    this.onPieceMove();
                }
                break;
            case 'Space':
                // Check if enough time has passed since the last hard drop
                const lastHardDrop = this.lastActionTime.get('hard-drop') || 0;
                if (now - lastHardDrop >= this.HARD_DROP_COOLDOWN && this.featureManager.isFeatureActive('hard-drop')) {
                    this.onHardDrop();
                    this.lastActionTime.set('hard-drop', now);
                }
                break;
            case 'KeyH':
                if (this.featureManager.isFeatureActive('hold-piece')) {
                    const holdFeature = this.featureManager.getFeature<HoldPieceFeature>('hold-piece');
                    if (holdFeature) {
                        holdFeature.holdPiece();
                        this.onPieceMove();
                    }
                }
                break;
        }

        this.lastActionTime.set(key, now);
    }

    /**
     * Handle continuous actions for held keys
     */
    private handleContinuousActions(): void {
        const now = Date.now();
        const lastDownAction = this.lastActionTime.get('ArrowDown') || 0;

        // Handle soft drop
        if (this.keyStates.get('ArrowDown') && now - lastDownAction >= this.SOFT_DROP_INTERVAL) {
            const moved = this.board.moveCurrentPieceDown();
            if (moved) {
                this.onPieceMove();
            } else {
                // If the piece couldn't move down, it means it hit something
                // We need to place the piece and let the game state handle the next piece
                this.board.placeCurrentPiece();
                this.onPieceMove();
            }
            this.lastActionTime.set('ArrowDown', now);
        }
    }
} 