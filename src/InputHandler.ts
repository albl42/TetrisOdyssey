import { GameState } from './GameState.js';
import { FeatureManager } from './features/FeatureManager.js';
import { HoldPieceFeature } from './features/HoldPieceFeature.js';

export class InputHandler {
    private gameState: GameState;
    private featureManager: FeatureManager;

    constructor(gameState: GameState, featureManager: FeatureManager) {
        this.gameState = gameState;
        this.featureManager = featureManager;
        
        // Prevent spacebar from scrolling
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
            }
        });
        
        // Add keyboard event listeners
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent): void {
        // Handle key down events
        const board = this.gameState.getBoard();
        
        switch (event.code) {
            case 'ArrowLeft':
                board.moveCurrentPieceLeft();
                break;
            case 'ArrowRight':
                board.moveCurrentPieceRight();
                break;
            case 'ArrowDown':
                board.moveCurrentPieceDown();
                break;
            case 'ArrowUp':
                board.rotateCurrentPiece();
                break;
            case 'Space':
                if (this.featureManager.isFeatureActive('hard-drop')) {
                    board.hardDropCurrentPiece();
                }
                break;
            case 'KeyH':
                if (this.featureManager.isFeatureActive('hold-piece')) {
                    const holdFeature = this.featureManager.getFeature<HoldPieceFeature>('hold-piece');
                    if (holdFeature) {
                        holdFeature.holdPiece();
                    }
                }
                break;
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        // Handle key up events if needed
    }
} 