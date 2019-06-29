
import {UNIT} from './Constants';
import Colors from './Colors';

export const Application = {
	width: 800,
	height: 600,
	autoStart: false, 
	backgroundColor: Colors.breeze,
};

export const FPS = {
	min    : 10, 
	max    : 60, 
	target : 60,
};

export const Game = {
	title: `Pyramide Solitaire`,
	version: `0.0.1-pixi`,
	tile: 32,
	unit: {
		size: 64,
	},
};

export const Unit = {
	size: 64,
};

export const Defaults = {
	Card: {
		model : {
			size        : Unit.size,
			textures    : {
				main     : undefined,
				face     : undefined,
				shirt    : undefined,
			},
		},
	}, 
	Button: {
		model : {
			size        : 1/2,
			textures    : {
				main      : undefined,
				pressed   : undefined,
			},
		},
	}, 
	Scoreboard : {
		name : `Scoreboard`,
		attrs : {
			scores : 0,
		}, 
		model : {
			width  : 1,
			height  : 1,
			fontColor : Colors.white,
			backgroundColor : Colors.green,
			textures : {
				main: undefined,
			},
		}, 
	}, 
};

export const WebFont = {
	google: {
		families: ['Pacifico:latin,cyrillic'],
	},
};
