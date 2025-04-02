export interface GameFeature {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    toggle: () => void;
}

export class GameFeatures {
    private features: Map<string, GameFeature>;

    constructor() {
        this.features = new Map();
        this.initializeFeatures();
    }

    private initializeFeatures(): void {
        // Example features - we can add more later
        this.addFeature({
            id: 'ghost-piece',
            name: 'Ghost Piece',
            description: 'Shows where the piece will land',
            isActive: false,
            toggle: () => this.toggleFeature('ghost-piece')
        });

        // this.addFeature({
        //     id: 'hold-piece',
        //     name: 'Hold Piece ',
        //     description: 'Store a piece for later use',
        //     isActive: false,
        //     toggle: () => this.toggleFeature('hold-piece')
        // });

        this.addFeature({
            id: 'hard-drop',
            name: 'Hard Drop',
            description: 'Instantly drop piece to bottom',
            isActive: true,
            toggle: () => this.toggleFeature('hard-drop')
        });
    }

    private addFeature(feature: GameFeature): void {
        this.features.set(feature.id, feature);
    }

    private toggleFeature(id: string): void {
        const feature = this.features.get(id);
        if (feature) {
            feature.isActive = !feature.isActive;
        }
    }

    getFeature(id: string): GameFeature | undefined {
        return this.features.get(id);
    }

    getAllFeatures(): GameFeature[] {
        return Array.from(this.features.values());
    }

    isFeatureActive(id: string): boolean {
        return this.features.get(id)?.isActive ?? false;
    }
} 