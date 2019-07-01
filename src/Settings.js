
import {UNIT} from './Constants';
import Colors from './Colors';

export const Application = {
	width: 800,
	height: 600,
	autoStart: false, 
	autoResize: true,
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
		attrs: {
			row : undefined,
			index : undefined,
		},
		model : {
			size       : 2,
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
	ModalBox : {
		name : `ModalBox`,
		attrs : {
			text : 'Some content of modal box',
		}, 
		model : {
			width  : 512,
			height  : 256,
			fontColor : Colors.black,
			backgroundColor : Colors.white,
		}, 
	}, 
	Dealer : {
		name : `Dealer`,
		attrs : {
			scores : 0,
		}, 
		model : {
			size: 1.5,
			lineSize  : 8,
			color  : Colors.white,
		}, 
	}, 
};

export const WebFont = {
	google: {
		families: ['Pacifico:latin,cyrillic'],
	},
};
