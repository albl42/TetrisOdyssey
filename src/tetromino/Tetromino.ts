import { TetrominoType, getShape, getColor } from './TetrominoType.js';

export class Tetromino {
    public shape: number[][];
    public color: string;
    private type: TetrominoType;

    constructor(type: TetrominoType) {
        this.type = type;
        this.shape = getShape(type);
        this.color = getColor(type);
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

    public getType(): TetrominoType {
        return this.type;
    }
} 