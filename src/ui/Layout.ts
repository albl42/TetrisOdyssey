import { GameState } from '../GameState.js';

/**
 * Layout component that defines the outermost structure of the game UI
 */
export class Layout {
    private container: HTMLDivElement;
    private header: HTMLDivElement;
    private mainContent: HTMLDivElement;
    private sidebar: HTMLDivElement;
    private footer: HTMLDivElement;
    private canvas: HTMLCanvasElement;
    private resizeObserver: ResizeObserver | null = null;

    constructor() {
        console.log('Creating layout...');
        
        this.container = this.createContainer();
        console.log('Container created');
        
        this.header = this.createHeader();
        console.log('Header created');
        
        this.mainContent = this.createMainContent();
        console.log('Main content created');
        
        this.sidebar = this.createSidebar();
        console.log('Sidebar created');
        
        this.footer = this.createFooter();
        console.log('Footer created');
        
        this.canvas = this.createCanvas();
        console.log('Canvas created');

        // Assemble the layout
        this.mainContent.appendChild(this.canvas);
        console.log('Canvas appended to main content');
        
        this.container.appendChild(this.header);
        console.log('Header appended to container');
        
        this.container.appendChild(this.createContentWrapper());
        console.log('Content wrapper appended to container');
        
        this.container.appendChild(this.footer);
        console.log('Footer appended to container');
        
        // Set up resize observer for responsive canvas
        this.setupResizeObserver();
        console.log('Resize observer set up');
        
        console.log('Layout assembly complete');
    }

    private setupResizeObserver(): void {
        // Clean up existing observer if any
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        // Create new observer
        this.resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target === this.mainContent) {
                    // Use requestAnimationFrame to ensure layout is complete
                    requestAnimationFrame(() => {
                        this.updateCanvasSize();
                    });
                }
            }
        });
        
        // Start observing
        this.resizeObserver.observe(this.mainContent);
    }

    private updateCanvasSize(): void {
        const containerWidth = this.mainContent.clientWidth;
        const containerHeight = this.mainContent.clientHeight;
        
        // Tetris board dimensions (10x20)
        const boardWidth = 10;
        const boardHeight = 20;
        const blockSize = 30; // Match the block size from Game class
        
        // Calculate the maximum size that maintains the 1:2 aspect ratio
        // while fitting within the container
        const maxWidth = containerWidth - 40; // Account for padding
        const maxHeight = containerHeight - 40;
        
        // Calculate the size that maintains the 1:2 aspect ratio
        let width, height;
        
        // First try to fit based on the block size
        const idealWidth = boardWidth * blockSize;
        const idealHeight = boardHeight * blockSize;
        
        if (maxWidth >= idealWidth && maxHeight >= idealHeight) {
            // We can use the ideal size
            width = idealWidth;
            height = idealHeight;
        } else {
            // Need to scale down
            const widthRatio = maxWidth / idealWidth;
            const heightRatio = maxHeight / idealHeight;
            const scale = Math.min(widthRatio, heightRatio);
            
            width = Math.floor(idealWidth * scale);
            height = Math.floor(idealHeight * scale);
        }
        
        // Set canvas size
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Center the canvas in the container
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '50%';
        this.canvas.style.top = '50%';
        this.canvas.style.transform = 'translate(-50%, -50%)';
        
        console.log('Canvas size updated:', width, 'x', height);
    }

    private createContainer(): HTMLDivElement {
        const container = document.createElement('div');
        container.className = 'game-layout';
        return container;
    }

    private createHeader(): HTMLDivElement {
        const header = document.createElement('div');
        header.className = 'game-header';

        const title = document.createElement('h1');
        title.className = 'game-title';
        title.textContent = 'Tetris Odyssey';

        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'score-display';
        scoreDisplay.id = 'score';
        scoreDisplay.textContent = 'Score: 0';

        header.appendChild(title);
        header.appendChild(scoreDisplay);
        return header;
    }

    private createMainContent(): HTMLDivElement {
        const mainContent = document.createElement('div');
        mainContent.className = 'game-main';
        mainContent.style.position = 'relative'; // Ensure absolute positioning works
        return mainContent;
    }

    private createSidebar(): HTMLDivElement {
        const sidebar = document.createElement('div');
        sidebar.className = 'game-sidebar';
        return sidebar;
    }

    private createContentWrapper(): HTMLDivElement {
        const wrapper = document.createElement('div');
        wrapper.className = 'content-wrapper';
        wrapper.appendChild(this.mainContent);
        wrapper.appendChild(this.sidebar);
        return wrapper;
    }

    private createFooter(): HTMLDivElement {
        const footer = document.createElement('div');
        footer.className = 'game-footer hidden';
        footer.textContent = '© 2024 Tetris Odyssey';
        return footer;
    }

    private createCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.id = 'gameCanvas';
        
        // Set initial size based on standard Tetris dimensions
        const blockSize = 30;
        canvas.width = 10 * blockSize;  // 10 blocks wide
        canvas.height = 20 * blockSize; // 20 blocks high
        
        // Add CSS to ensure canvas is centered and maintains aspect ratio
        canvas.style.display = 'block';
        canvas.style.maxWidth = '100%';
        canvas.style.maxHeight = '100%';
        
        return canvas;
    }

    /**
     * Get the main container element
     */
    getElement(): HTMLDivElement {
        return this.container;
    }
    
    /**
     * Get the sidebar element where game UI components will be added
     */
    getSidebar(): HTMLDivElement {
        return this.sidebar;
    }
    
    /**
     * Get the main content element where the game canvas is located
     */
    getMainContent(): HTMLDivElement {
        return this.mainContent;
    }
    
    /**
     * Get the canvas element
     */
    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }
} 