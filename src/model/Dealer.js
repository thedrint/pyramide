
import * as PIXI from 'pixi.js';

import { Unit as UnitSettings, Defaults } from './../Settings';
import Utils from './../Utils';

import Container from './../base/Container';
// import ShirtModel from './Shirt';

export default class DealerModel extends Container {

	constructor (logic, scene) {
		super(logic.settings);
		this.logic = logic;
		this.scene = scene;
		this.name = this.settings.model.name;
		this.interactive = true;
		this.interactiveChildren = true;
		this.init();
	}

	init () {
		let params = this.settings.model;
		let models = [];
		// console.log(this.scene.cardSize);
		let modelWidth = this.scene.cardSize.width;
		let modelHeight = this.scene.cardSize.height;
		let geometry = new PIXI.RoundedRectangle(0, 0, modelWidth, modelHeight, params.lineSize);

		// let shirt = new ShirtModel();
		// models.push(shirt);

		let deck = new PIXI.Graphics();
		deck.clear();
		deck.lineStyle(params.lineSize, params.color);
		deck.drawShape(geometry);
		deck.hitArea = geometry;
		deck.name = `Deck`;
		deck.interactive = true;
		deck.buttonMode = true;
		models.push(deck);

		let slot = new PIXI.Graphics();
		slot.clear();
		slot.lineStyle(params.lineSize, params.color);
		slot.drawShape(geometry);
		slot.hitArea = geometry;
		slot.name = `Slot`;
		slot.interactive = true;
		slot.buttonMode = true;
		models.push(slot);

		this.addChild(...models);
		slot.x = modelWidth + UnitSettings.margin;
	}

	// get Shirt () { return this.getChildByName('Shirt'); }
	get Deck () { return this.getChildByName('Deck'); }
	get Slot () { return this.getChildByName('Slot'); }
}
