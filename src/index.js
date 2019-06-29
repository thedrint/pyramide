
// Import the game and settings for the game
import Game from './Game';
import { Application as ApplicationSettings } from './Settings';

// Create and start new game
let PyramideGame = new Game(ApplicationSettings);
PyramideGame.startGame();
