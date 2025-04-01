export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export class Tetromino {
    public shape: number[][];
    public color: string;
    private x: number;
    private y: number;

    constructor(type: TetrominoType) {
        this.x = 3;
        this.y = 0;
        this.shape = this.getShape(type);
        this.color = this.getColor(type);
    }

    private getShape(type: TetrominoType): number[][] {
        const shapes: Record<TetrominoType, number[][]> = {
            'I': [[1, 1, 1, 1]],
            'J': [[1, 0, 0], [1, 1, 1]],
            'L': [[0, 0, 1], [1, 1, 1]],
            'O': [[1, 1], [1, 1]],
            'S': [[0, 1, 1], [1, 1, 0]],
            'T': [[0, 1, 0], [1, 1, 1]],
            'Z': [[1, 1, 0], [0, 1, 1]]
        };
        return shapes[type];
    }

    private getColor(type: TetrominoType): string {
        const colors: Record<TetrominoType, string> = {
            'I': '#00f0f0',
            'J': '#0000f0',
            'L': '#f0a000',
            'O': '#f0f000',
            'S': '#00f000',
            'T': '#a000f0',
            'Z': '#f00000'
        };
        return colors[type];
    }

    public rotate(): void {
        const newShape: number[][] = [];
        for (let i = 0; i < this.shape[0].length; i++) {
            newShape[i] = [];
            for (let j = this.shape.length - 1; j >= 0; j--) {
                newShape[i].push(this.shape[j][i]);
            }
        }
        this.shape = newShape;
    }

    public moveLeft(): void {
        this.x--;
    }

    public moveRight(): void {
        this.x++;
    }

    public moveDown(): void {
        this.y++;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }
} 