
import * as PIXI from 'pixi.js';

import { Unit as UnitSettings, Defaults } from './../Settings';
import Utils from './../Utils';

import Container from './../base/Container';

import Scene from './../Scene';

export default class Button extends Container {

	constructor (settings = {
		name  : Defaults.Button.name, 
		attrs : Defaults.Button.attrs, 
		model : Defaults.Button.model
	}) {

		super();

		this.interactive = true;
		this.buttonMode = true;

		let { 
			name = Defaults.Button.name, 
			attrs = Defaults.Button.attrs, 
			model = Defaults.Button.model 
		} = settings;
		this.name = name;

		this.attrs = Utils.cleanOptionsObject(attrs, Defaults.Button.attrs);

		this.initModel(model);
	}

	initModel (model = Defaults.Button.model) {
		let params = Utils.cleanOptionsObject(model, Defaults.Button.model);
		let models = [];

		let modelWidth = params.size * UnitSettings.size;
		let modelHeight = modelWidth;

		let res = params.textures.main.baseTexture.resource;
		let svgTexture = PIXI.BaseTexture.from(res);
		svgTexture.setSize(modelWidth, modelHeight);
		let buttonTexture = new PIXI.Texture(svgTexture);
		let button = PIXI.Sprite.from(buttonTexture);
		button.anchor.set(0.5);
		// button.x -= modelWidth/2;
		// button.y -= modelHeight/2;
		// button.pivot.x = 0.5 * crate.width;
		// button.pivot.y = 0.5 * crate.height;
		// crate.angle = 45;
		button.name = `Button`;
		models.push(button);

		this.addChild(...models);
		// this.pivot.x += 0;
		// this.pivot.y += 0;
	}

	getModel () { return this.getChildByName('Button'); }
}
