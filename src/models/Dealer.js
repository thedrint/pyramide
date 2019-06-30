
import * as PIXI from 'pixi.js';

import { Unit as UnitSettings, Defaults } from './../Settings';
import Utils from './../Utils';

import Card from './../Card';
import Container from './../base/Container';

import Scene from './../Scene';

export default class Dealer extends Container {

	constructor (settings = {
		name  : Defaults.Dealer.name, 
		attrs : Defaults.Dealer.attrs, 
		model : Defaults.Dealer.model
	}) {

		super();

		let { 
			name = Defaults.Dealer.name, 
			attrs = Defaults.Dealer.attrs, 
			model = Defaults.Dealer.model 
		} = settings;
		this.name = name;

		this.attrs = Utils.cleanOptionsObject(attrs, Defaults.Dealer.attrs);

		this.initModel(model);
	}

	initModel (model = Defaults.Dealer.model) {
		let params = Utils.cleanOptionsObject(model, Defaults.Dealer.model);
		let models = [];

		let modelWidth = params.size * UnitSettings.size;

		let resName = `Shirt`;
		let res = PIXI.Loader.shared.resources[resName].texture.baseTexture.resource;
		let modelHeight = res.height * modelWidth/res.width;
		let svgTexture = PIXI.BaseTexture.from(res);
		svgTexture.setSize(modelWidth, modelHeight);
		let shirtTexture = new PIXI.Texture(svgTexture);
		let shirt = PIXI.Sprite.from(shirtTexture);
		shirt.name = 'Shirt';
		models.push(shirt);

		let deck = new PIXI.Graphics();
		deck.clear();
		deck.lineStyle(params.lineSize, params.color);
		deck.drawShape(new PIXI.RoundedRectangle(0, 0, modelWidth, modelHeight, params.lineSize));
		deck.name = `Deck`;
		models.push(deck);

		let slot = new PIXI.Graphics();
		slot.clear();
		slot.lineStyle(params.lineSize, params.color);
		slot.drawShape(new PIXI.RoundedRectangle(modelWidth + 16, 0, modelWidth, modelHeight, params.lineSize));
		slot.name = `Slot`;
		models.push(slot);

		this.addChild(...models);
		// this.pivot.x += 0;
		// this.pivot.y += 0;
	}

	getModel () { return this.getChildByName('Deck'); }
	get Shirt () { return this.getChildByName('Shirt'); }
	get Slot () { return this.getChildByName('Slot'); }
}
