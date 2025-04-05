/**
 * UI component that displays the game over screen.
 * This class handles the creation and display of the game over message and restart button.
 */
export class GameOverScreen {
    private container: HTMLElement;
    private onRestart: () => void;
    private contentElement: HTMLElement;
    private titleElement: HTMLElement;
    private scoreElement: HTMLElement;
    private restartButton: HTMLElement;

    constructor(onRestart: () => void) {
        this.onRestart = onRestart;
        this.container = this.createContainer();
        this.contentElement = this.createContentElement();
        this.titleElement = this.createTitleElement();
        this.scoreElement = this.createScoreElement();
        this.restartButton = this.createRestartButton();
        
        // Assemble the game over screen
        this.contentElement.appendChild(this.titleElement);
        this.contentElement.appendChild(this.scoreElement);
        this.contentElement.appendChild(this.restartButton);
        this.container.appendChild(this.contentElement);
        
        // Initially hide the game over screen
        this.hide();
    }

    private createContainer(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'game-over-screen';
        return container;
    }

    private createContentElement(): HTMLElement {
        const contentElement = document.createElement('div');
        contentElement.className = 'game-over-content';
        return contentElement;
    }

    private createTitleElement(): HTMLElement {
        const titleElement = document.createElement('h2');
        titleElement.className = 'game-over-title';
        titleElement.textContent = 'Game Over!';
        return titleElement;
    }

    private createScoreElement(): HTMLElement {
        const scoreElement = document.createElement('div');
        scoreElement.className = 'game-over-score';
        return scoreElement;
    }

    private createRestartButton(): HTMLElement {
        const restartButton = document.createElement('button');
        restartButton.className = 'restart-button';
        restartButton.textContent = 'Restart Game';
        
        restartButton.addEventListener('click', () => {
            this.hide();
            this.onRestart();
        });
        
        return restartButton;
    }

    public show(score: number): void {
        this.scoreElement.textContent = `Final Score: ${score}`;
        this.container.classList.add('visible');
    }

    public hide(): void {
        this.container.classList.remove('visible');
    }

    getElement(): HTMLElement {
        return this.container;
    }
} 