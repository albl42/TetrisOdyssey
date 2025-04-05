/**
 * Enum representing the different types of Tetromino pieces in the game.
 * Each type corresponds to a specific shape and color.
 */
export enum TetrominoType {
    I = 'I',
    J = 'J',
    L = 'L',
    O = 'O',
    S = 'S',
    T = 'T',
    Z = 'Z'
}

/**
 * Returns the shape matrix for a given tetromino type.
 * @param type The tetromino type
 * @returns A 2D array representing the shape (1 for filled cells, 0 for empty cells)
 */
export function getShape(type: TetrominoType): number[][] {
    const shapes: Record<TetrominoType, number[][]> = {
        [TetrominoType.I]: [[1, 1, 1, 1]],
        [TetrominoType.J]: [[1, 0, 0], [1, 1, 1]],
        [TetrominoType.L]: [[0, 0, 1], [1, 1, 1]],
        [TetrominoType.O]: [[1, 1], [1, 1]],
        [TetrominoType.S]: [[0, 1, 1], [1, 1, 0]],
        [TetrominoType.T]: [[0, 1, 0], [1, 1, 1]],
        [TetrominoType.Z]: [[1, 1, 0], [0, 1, 1]]
    };
    return shapes[type];
}

/**
 * Returns the color for a given tetromino type.
 * @param type The tetromino type
 * @returns A CSS color string
 */
export function getColor(type: TetrominoType): string {
    const colors: Record<TetrominoType, string> = {
        [TetrominoType.I]: '#00f0f0',
        [TetrominoType.J]: '#0000f0',
        [TetrominoType.L]: '#f0a000',
        [TetrominoType.O]: '#f0f000',
        [TetrominoType.S]: '#00f000',
        [TetrominoType.T]: '#a000f0',
        [TetrominoType.Z]: '#f00000'
    };
    return colors[type];
} 