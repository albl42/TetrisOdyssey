import { UIComponent } from './UIComponent.js';

interface ScoreData {
    score: number;
    level: number;
    lines: number;
}

export class ScoreDisplay extends UIComponent<ScoreData> {
    private scoreElement!: HTMLElement;
    private levelElement!: HTMLElement;
    private linesElement!: HTMLElement;
    
    constructor(initialData: ScoreData) {
        super(initialData);
    }
    
    protected createContainer(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'score-display';
        
        // Create score elements
        this.scoreElement = document.createElement('div');
        this.scoreElement.className = 'score-value';
        
        this.levelElement = document.createElement('div');
        this.levelElement.className = 'level-value';
        
        this.linesElement = document.createElement('div');
        this.linesElement.className = 'lines-value';
        
        // Add elements to container
        container.appendChild(this.scoreElement);
        container.appendChild(this.levelElement);
        container.appendChild(this.linesElement);
        
        return container;
    }
    
    protected render(): void {
        this.scoreElement.textContent = `Score: ${this.data.score}`;
        this.levelElement.textContent = `Level: ${this.data.level}`;
        this.linesElement.textContent = `Lines: ${this.data.lines}`;
    }
} 