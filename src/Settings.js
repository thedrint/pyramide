
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
	unit: {
		name: 'John Doe', 
		spec: UNIT.SPECIALIZATION.INFANTRY, 
		attrs : {
			immortal : false,
			lvl      : 0,
			hp       : undefined,
			mp       : undefined,
			attack   : 0,
			defend   : 0,
			speed    : 1,
		},
		skills : {
			strength  : 0,
			agility   : 0,
			intellect : 0,
		},
		equipment : {
			head    : undefined,
			hands   : {
				right : undefined,
				left  : undefined,
			},
			fingers : undefined,
			foots   : undefined,
			neck    : undefined,
			legs    : undefined,
			body    : undefined,
			arms    : undefined,
		},
		model : {
			size        : Game.unit.size,
			colors      : {
				armor     : Colors.green,
				helmet    : Colors.black,
				weapon    : Colors.metal,
				shield    : Colors.brown,				
			},
			textures    : {
				armor     : undefined,
				helmet    : undefined,
				weapon    : undefined,
				shield    : undefined,				
			},
		},
	}, 
	body : {
		name : `Body`,
		attrs : {
			defend : 0,
		}, 
		model : {
			size  : 1,
			color : Colors.green,
			texture: undefined,
		}, 
	}, 
	helmet : {
		name : `Helmet`,
		attrs : {
			defend : 0,
		}, 
		model : {
			size  : 1,
			color : Colors.black,
			texture: undefined,
		}, 
	}, 
	weapon : {
		name : `Weapon`,
		attrs : {
			damage : 1,
		}, 
		model : {
			size  : 1,
			color : Colors.metal,
			texture: undefined,
		}, 
	}, 
	shield : {
		name : `Shield`,
		attrs : {
			defend : 1,
		}, 
		model : {
			size  : 0.75,
			color : Colors.brown,
			texture: undefined,
		}, 
	}, 
	crate : {
		name : `Crate`,
		attrs : {
			defend : 1000,
		}, 
		model : {
			size  : 1,
			color : Colors.brown,
			texture: undefined,
		}, 
	}, 
	party : {
		name   : 'Bandits',
		faction : 'Bandits', 
		color   : Colors.red, 
	}
};

export const WebFont = {
	google: {
		families: ['Pacifico:latin,cyrillic'],
	},
};
