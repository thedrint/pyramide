import $ from 'jquery';
import PyramideGame from './Pyramide.js';
import './assets/css/index.css';

$(function(){
	let game = new PyramideGame();
	game.play();
});
