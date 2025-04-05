import { IGameFeature } from '../../features/GameFeature.js';
import { FeatureControl } from './FeatureControl.js';
import { HoldPieceFeature } from '../../features/HoldPieceFeature.js';

/**
 * Control component for toggle features that need a preview
 */
export class PreviewToggleControl implements FeatureControl {
    private container: HTMLElement;
    private button: HTMLElement;
    private preview: HTMLElement;
    private feature: IGameFeature;
    private previewCanvas: HTMLCanvasElement | null = null;
    private previewCtx: CanvasRenderingContext2D | null = null;

    constructor(feature: IGameFeature) {
        this.feature = feature;
        this.container = this.createContainer();
        this.button = this.createButton();
        this.preview = this.createPreview();
        this.container.appendChild(this.button);
        this.container.appendChild(this.preview);
    }

    private createContainer(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'feature-control preview-toggle-control';
        container.setAttribute('data-feature', this.feature.id);
        return container;
    }

    private createButton(): HTMLElement {
        const button = document.createElement('button');
        button.className = `feature-button ${this.feature.isActive ? 'active' : ''}`;
        
        // Create the button content
        const nameContainer = document.createElement('div');
        nameContainer.className = 'feature-name-container';
        
        const nameElement = document.createElement('div');
        nameElement.className = 'feature-name';
        nameElement.textContent = this.feature.name;
        
        // Add keyboard key indicator for hold feature
        if (this.feature.id === 'hold-piece') {
            const keyIndicator = document.createElement('div');
            keyIndicator.className = 'key-indicator';
            keyIndicator.innerHTML = '<span class="key">H</span>';
            nameContainer.appendChild(nameElement);
            nameContainer.appendChild(keyIndicator);
        } else {
            nameContainer.appendChild(nameElement);
        }
        
        const descriptionElement = document.createElement('div');
        descriptionElement.className = 'feature-description';
        descriptionElement.textContent = this.feature.description;
        
        button.appendChild(nameContainer);
        button.appendChild(descriptionElement);

        button.addEventListener('click', () => {
            this.feature.toggle();
            button.classList.toggle('active');
            this.preview.classList.toggle('visible', this.feature.isActive);
        });

        return button;
    }

    private createPreview(): HTMLElement {
        const preview = document.createElement('div');
        preview.className = 'feature-preview';

        if (this.feature.id === 'hold-piece') {
            const holdPreview = document.createElement('div');
            holdPreview.className = 'hold-piece-preview';
            
            // Create canvas for drawing the held piece
            this.previewCanvas = document.createElement('canvas');
            this.previewCanvas.width = 100;
            this.previewCanvas.height = 100;
            this.previewCtx = this.previewCanvas.getContext('2d');
            
            holdPreview.appendChild(this.previewCanvas);
            preview.appendChild(holdPreview);
        }

        return preview;
    }

    getElement(): HTMLElement {
        return this.container;
    }

    update(): void {
        this.button.classList.toggle('active', this.feature.isActive);
        this.preview.classList.toggle('visible', this.feature.isActive);

        // Update hold piece preview
        if (this.feature.id === 'hold-piece' && this.previewCanvas && this.previewCtx) {
            const holdFeature = this.feature as HoldPieceFeature;
            const heldPiece = holdFeature.getHeldPiece();
            
            // Clear the canvas
            this.previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
            
            if (heldPiece) {
                // Draw the held piece
                const blockSize = 20;
                const offsetX = (this.previewCanvas.width - heldPiece.shape[0].length * blockSize) / 2;
                const offsetY = (this.previewCanvas.height - heldPiece.shape.length * blockSize) / 2;
                
                this.previewCtx.fillStyle = heldPiece.color;
                
                for (let row = 0; row < heldPiece.shape.length; row++) {
                    for (let col = 0; col < heldPiece.shape[row].length; col++) {
                        if (heldPiece.shape[row][col]) {
                            this.previewCtx.fillRect(
                                offsetX + col * blockSize,
                                offsetY + row * blockSize,
                                blockSize - 1,
                                blockSize - 1
                            );
                        }
                    }
                }
            }
        }
    }

    cleanup(): void {
        // Clean up event listeners if needed
    }
} 