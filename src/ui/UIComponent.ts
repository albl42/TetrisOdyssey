/**
 * Generic UI component that can work with different types of data
 */
export abstract class UIComponent<T> {
    protected container: HTMLElement;
    protected data: T;
    
    constructor(initialData: T) {
        this.data = initialData;
        this.container = this.createContainer();
    }
    
    /**
     * Update the component's data and re-render
     */
    public update(newData: T): void {
        this.data = newData;
        this.render();
    }
    
    /**
     * Get the component's container element
     */
    public getElement(): HTMLElement {
        return this.container;
    }
    
    /**
     * Create the container element
     */
    protected abstract createContainer(): HTMLElement;
    
    /**
     * Render the component with current data
     */
    protected abstract render(): void;
    
    /**
     * Clean up any resources
     */
    public cleanup(): void {
        // Override in subclasses if needed
    }
} 