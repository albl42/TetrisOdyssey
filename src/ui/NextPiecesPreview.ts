import { Tetromino } from '../tetromino/Tetromino.js';

/**
 * UI component that displays the next Tetromino pieces that will appear in the game.
 * This class handles the rendering of the preview pieces.
 */
export class NextPiecesPreview {
    private container: HTMLElement;
    private previews: Tetromino[];
    private blockSize: number;

    constructor(blockSize: number = 20) {
        this.blockSize = blockSize;
        this.previews = [];
        this.container = this.createContainer();
    }

    private createContainer(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'next-pieces-preview';
        
        const title = document.createElement('h3');
        title.textContent = 'Next Pieces';
        container.appendChild(title);
        
        const previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container';
        container.appendChild(previewContainer);
        
        return container;
    }

    public updatePreviews(pieces: Tetromino[]): void {
        this.previews = pieces;
        this.render();
    }

    private render(): void {
        const previewContainer = this.container.querySelector('.preview-container');
        if (!previewContainer) return;
        
        // Clear previous previews
        previewContainer.innerHTML = '';
        
        // Create new previews
        this.previews.forEach((piece, index) => {
            const preview = this.createPiecePreview(piece, index);
            previewContainer.appendChild(preview);
        });
    }

    private createPiecePreview(piece: Tetromino, index: number): HTMLElement {
        const preview = document.createElement('div');
        preview.className = 'piece-preview';
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context');
        
        // Set canvas size based on piece size
        const padding = 10;
        const pieceWidth = piece.shape[0].length * this.blockSize;
        const pieceHeight = piece.shape.length * this.blockSize;
        canvas.width = pieceWidth + padding * 2;
        canvas.height = pieceHeight + padding * 2;

        // Draw piece
        piece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    ctx.fillStyle = piece.color;
                    ctx.fillRect(
                        x * this.blockSize + padding,
                        y * this.blockSize + padding,
                        this.blockSize - 1,
                        this.blockSize - 1
                    );
                }
            });
        });

        preview.appendChild(canvas);
        return preview;
    }

    getElement(): HTMLElement {
        return this.container;
    }
} 