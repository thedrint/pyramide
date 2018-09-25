import $ from 'jquery';
import PyramideGame from './Pyramide.js';

$(function(){
	let game = new PyramideGame();
	game.play();
});
