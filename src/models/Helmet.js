
import * as PIXI from 'pixi.js';
import IntersectHelper from './../IntersectHelper';

import { Unit as UnitSettings, Defaults } from './../Settings';
import Utils from './../Utils';

import Graphics from './../base/Graphics';

import Scene from './../Scene';

export default class Helmet extends Graphics {

	constructor (settings = {
		name  : Defaults.helmet.name, 
		attrs : Defaults.helmet.attrs, 
		model : Defaults.helmet.model
	}) {

		super();

		let { 
			name  = Defaults.helmet.name, 
			attrs = Defaults.helmet.attrs, 
			model = Defaults.helmet.model 
		} = settings;
		this.name = name;
		this.attrs = Utils.cleanOptionsObject(attrs, Defaults.helmet.attrs);
		this.initModel(model);
	}

	initModel (model = Defaults.helmet.model) {
		let params = Utils.cleanOptionsObject(model, Defaults.helmet.model);

		let helmetWidth = params.size * UnitSettings.size / 2;

		let models = [];
		let helmet = Scene.createShape(new PIXI.Ellipse(0, 0, helmetWidth/2, helmetWidth/2), params.color);
		helmet.name = `Helmet`;
		models.push(helmet);

		this.addChild(...models);
		this.pivot.x += 0.5 * helmetWidth;
		this.pivot.y += 0.5 * helmetWidth;
		this.shape = new IntersectHelper.Circle(this);
	}

	getModel () { return this.getChildByName('Helmet'); }
}