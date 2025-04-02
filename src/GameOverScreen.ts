export class GameOverScreen {
    private overlay: HTMLElement | null = null;

    constructor(private onRestart: () => void) {}

    show(score: number): void {
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'game-over-overlay';
            
            // Create elements separately to ensure proper styling
            const title = document.createElement('div');
            title.className = 'game-over-title';
            title.textContent = 'Game Over';
            
            const scoreElement = document.createElement('div');
            scoreElement.className = 'game-over-score';
            scoreElement.textContent = `Final Score: ${score}`;
            
            const button = document.createElement('button');
            button.className = 'restart-button';
            button.textContent = 'Restart Game';
            
            // Add click handler for the restart button
            button.addEventListener('click', () => this.onRestart());
            
            // Append elements to overlay
            this.overlay.appendChild(title);
            this.overlay.appendChild(scoreElement);
            this.overlay.appendChild(button);
            
            // Add overlay to the gameCanvas-wrapper
            const wrapper = document.getElementById('gameCanvas-wrapper');
            if (wrapper) {
                wrapper.appendChild(this.overlay);
            }
        }
    }

    hide(): void {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }
} 