
import {UNIT} from './Constants';
import Colors from './Colors';

export const Application = {
	safeWidth: 800,
	safeHeight: 600,
	width: 800,
	height: 600,
	autoStart: false, 
	autoDensity: true,
	backgroundColor: Colors.breeze,
	// resizeTo: document,
};

export const FPS = {
	min    : 10, 
	max    : 60, 
	target : 60,
};

export const Game = {
	title: `Pyramide Solitaire`,
	version: `0.5.0-pixi`,
	maxRewind: 2,
	tile: 32,
	unit: {
		size: 64,
	},
};

export const Unit = {
	size: 64,
	margin: 4,
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
			name        : 'Button',
			size        : 32,
			textures    : {
				main      : undefined,
				pressed   : undefined,
			},
		},
	}, 
	Scoreboard : {
		attrs : {
			scores : 0,
		}, 
		model : {
			name   : `Scoreboard`,
			width  : 64,
			height  : 64,
			fontColor : Colors.white,
			backgroundColor : Colors.green,
			texture : undefined,
		}, 
	}, 
	ModalBox : {
		attrs : {
			text : 'Some content of modal box',
		}, 
		model : {
			name            : `ModalBox`,
			width           : 512,
			height          : 256,
			fontColor       : Colors.black,
			backgroundColor : Colors.white,
		}, 
	}, 
	Dealer : {
		attrs : {
			scores : 0,
		}, 
		model : {
			name      : `Dealer`,
			size      : 1.5,
			lineSize  : 8,
			color     : Colors.white,
		}, 
	}, 
	DropZone : {
		model : {
			name      : `DropZone`,
			lineSize  : 1,
			color     : Colors.black,
		}, 
	}, 
};

export const WebFont = {
	google: {
		families: ['Pacifico:latin,cyrillic'],
	},
};
