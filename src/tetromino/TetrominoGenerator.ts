import { Tetromino } from './Tetromino.js';
import { TetrominoType } from './TetrominoType.js';

/**
 * Class responsible for generating Tetromino pieces.
 * This class encapsulates the logic for creating random Tetromino pieces.
 */
export class TetrominoGenerator {
    private readonly types: TetrominoType[] = [
        TetrominoType.I,
        TetrominoType.J,
        TetrominoType.L,
        TetrominoType.O,
        TetrominoType.S,
        TetrominoType.T,
        TetrominoType.Z
    ];

    /**
     * Generates a random Tetromino piece.
     * @returns A new Tetromino instance with a random type
     */
    public generateRandomPiece(): Tetromino {
        const randomType = this.types[Math.floor(Math.random() * this.types.length)];
        return new Tetromino(randomType);
    }

    /**
     * Generates multiple Tetromino pieces.
     * @param count The number of pieces to generate
     * @returns An array of Tetromino instances
     */
    public generateMultiplePieces(count: number): Tetromino[] {
        return Array(count).fill(null).map(() => this.generateRandomPiece());
    }
} 