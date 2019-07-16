
import * as PIXI from 'pixi.js';

import { Unit as UnitSettings, Defaults } from './../Settings';
import Utils from './../Utils';
import Container from './../base/Container';

export default class ButtonModel extends PIXI.Sprite {

	constructor (logic, scene) {
		let params = logic.settings.model;
		let models = [];
		let modelWidth = params.size || UnitSettings.size;
		let modelHeight = modelWidth;

		let texture = params.textures.main;
		texture.baseTexture.setSize(modelWidth, modelHeight);

		super(texture);
		this.anchor.set(0.5);
		this.name = params.name;

		this.logic = logic;
		this.scene = scene;

		this.interactive = true;
		this.buttonMode = true;

		this.name = params.name;
	}
}
