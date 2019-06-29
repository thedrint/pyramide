
import * as PIXI from 'pixi.js';
import IntersectHelper from './../IntersectHelper';

import { Unit as UnitSettings, Defaults } from './../Settings';
import Utils from './../Utils';

import Container from './../base/Container';

import Scene from './../Scene';

export default class Shield extends Container {

	constructor (settings = {
		name  : Defaults.shield.name, 
		attrs : Defaults.shield.attrs, 
		model : Defaults.shield.model
	}) {

		super();

		let { 
			name = Defaults.shield.name, 
			attrs = Defaults.shield.attrs, 
			model = Defaults.shield.model 
		} = settings;
		this.name = name;

		this.attrs = Utils.cleanOptionsObject(attrs, Defaults.shield.attrs);

		this.initModel(model);
	}

	initModel (model = Defaults.shield.model) {
		let params = Utils.cleanOptionsObject(model, Defaults.shield.model);
		let models = [];

		let plateWidth = params.size * UnitSettings.size;

		let res = params.texture.baseTexture.resource;
		let svgTexture = PIXI.BaseTexture.from(res);
		svgTexture.setSize(plateWidth, res.height * plateWidth/res.width * 0.4);
		let plateTexture = new PIXI.Texture(svgTexture);
		let plate = PIXI.Sprite.from(plateTexture);
		plate.anchor.set(0.5);
		plate.rotation = Math.PI;
		plate.name = `Plate`;
		models.push(plate);

		this.addChild(...models);
		this.shape = new IntersectHelper.Rectangle(this);
	}

	getModel () { return this.getChildByName('Plate'); }
}
