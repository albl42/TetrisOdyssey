# Tetris Odyssey

A modern take on the classic Tetris game, built with TypeScript and HTML5 Canvas. This project serves as a foundation for a roguelike Tetris game, combining the familiar block-dropping mechanics with roguelike elements.

## Play Online
You can play the game online at: [https://albl42.github.io/TetrisOdyssey](https://albl42.github.io/TetrisOdyssey)

## Features

### Current Implementation
- Classic Tetris gameplay mechanics
- Seven standard Tetris pieces (I, J, L, O, S, T, Z)
- Smooth piece movement and rotation
- Line clearing and scoring system
- Game over detection
- Modern, clean UI

### Planned Roguelike Features
- Special pieces with unique abilities
- Power-ups and special effects
- Different board layouts and challenges
- Progressive difficulty system
- Unique game modes

## Technical Details

### Built With
- TypeScript
- HTML5 Canvas
- Modern JavaScript (ES2020)
- Node.js and npm for development
- GitHub Actions for CI/CD
- GitHub Pages for hosting

### Project Structure
```
TetrisOdyssey/
├── src/                    # TypeScript source files
│   ├── Game.ts            # Main game logic
│   ├── Board.ts           # Game board management
│   └── tetromino/
│       ├── Tetromino.ts       # Tetris piece implementation
│       └── TetrominoType.ts   # Tetris piece type definitions
├── dist/                   # Compiled JavaScript files
├── styles.css             # Game styling
├── index.html             # Main HTML file
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Local Development
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd TetrisOdyssey
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Controls
- Left/Right Arrow Keys: Move piece horizontally
- Up Arrow: Rotate piece
- Down Arrow: Soft drop (accelerate piece downward)
- The piece will automatically fall every second

## Development

### Available Scripts
- `npm run build`: Compiles TypeScript files to JavaScript
- `npm start`: Starts the development server
- `npm run watch`: Watches for changes and recompiles automatically

### Adding New Features
1. Create new TypeScript files in the `src` directory
2. Import and use them in existing files
3. Run `npm run build` to compile
4. Test your changes in the browser

### Deployment
The game is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment process:
1. Builds the project using TypeScript
2. Uploads the built files to GitHub Pages
3. Makes the game available at `https://albl42.github.io/TetrisOdyssey`

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Inspired by the classic Tetris game
- Built with basic web technologies
- Special thanks to all contributors and testers