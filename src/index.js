import PyramideGame from './assets/js/Pyramide.js';
import './assets/css/index.css';

if( process.env.NODE_ENV === 'production' ) {
	console.log =  function(){};
}

PyramideGame.playGame();
