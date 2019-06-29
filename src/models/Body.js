
import * as PIXI from 'pixi.js';
import IntersectHelper from './../IntersectHelper';

import { Unit as UnitSettings, Defaults } from './../Settings';
import Utils from './../Utils';

import Graphics from './../base/Graphics';

import Scene from './../Scene';

export default class Body extends Graphics {

	constructor (settings = {
		name  : Defaults.body.name, 
		attrs : Defaults.body.attrs, 
		model : Defaults.body.model
	}) {

		super();

		let { 
			name  = Defaults.body.name, 
			attrs = Defaults.body.attrs, 
			model = Defaults.body.model 
		} = settings;
		this.name = name;

		this.attrs = Utils.cleanOptionsObject(attrs, Defaults.body.attrs);

		this.initModel(model);
	}

	initModel (model = Defaults.body.model) {
		let params = Utils.cleanOptionsObject(model, Defaults.body.model);

		let bodyWidth = params.size * UnitSettings.size;

		let models = [];
		let body = Scene.createShape(new PIXI.Ellipse(0, 0, bodyWidth/2, bodyWidth/2), params.color);
		body.name = `Body`;
		models.push(body);

		this.addChild(...models);
		this.pivot.x += 0.5 * bodyWidth;
		this.pivot.y += 0.5 * bodyWidth;
		this.shape = new IntersectHelper.Circle(this);
	}

	getModel () { return this.getChildByName('Body'); }
	getBody () { return this.getModel(); }

	getWidth () { return this.width; }
}