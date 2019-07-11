
import * as PIXI from 'pixi.js';

import { Unit as UnitSettings, Defaults } from './../Settings';
import Utils from './../Utils';

import Container from './../base/Container';

import Scene from './../Scene';

export default class ModalBoxModel extends Container {

	constructor (logic, scene) {
		super(logic.settings);
		this.logic = logic;
		this.scene = scene;
		this.name = this.settings.model.name;
		this.init();
	}

	init () {
		let params = this.settings.model;

		let modalWidth  = this.scene.app.screen.width * 0.8;
		let modalHeight = this.scene.app.screen.height * 0.8;

		let models = [];

		let geometry = new PIXI.RoundedRectangle(0, 0, modalWidth, modalHeight, modalWidth*0.1);
		let background = Scene.createShape(geometry, params.backgroundColor);
		background.name = `Background`;
		models.push(background);

		// let resName = `ModalBorder`;
		// let res = PIXI.Loader.shared.resources[resName].texture.baseTexture.resource;
		// let svgTexture = PIXI.BaseTexture.from(res);
		// svgTexture.setSize(modalWidth, modalHeight);
		// let bordersTexture = new PIXI.Texture(svgTexture);
		// let borders = PIXI.Sprite.from(bordersTexture);
		// borders.name = 'Borders';
		// models.push(borders);

		let text = new PIXI.Text(this._text, {
			fontFamily : 'Pacifico', fontWeight: 400, fontSize: 16, lineHeight: 18, 
			fill : params.fontColor, 
			align : `left`,
		});
		text.name = 'Text';
		text.anchor.set(0.5);
		// text.width = modalWidth * 0.6;
		models.push(text);

		this.addChild(...models);
		this.zIndex = 999;
		this.visible = false;
		text.x = modalWidth/2;
		text.y = modalHeight/2;
		this.pivot.x += 0.5 * modalWidth;
		this.pivot.y += 0.5 * modalHeight;

		this.interactive = true;
		this.buttonMode = true;
		this.hitArea = geometry;
	}

	toggle       () { this.visible = !this.visible; }
	getModel     (name = undefined) { return name ? this.getChildByName(name) : this.getChildByName('ModalBox'); }
	set text     (newText) { this.getModel('Text').text = newText; }
	get text     () { return this.getModel('Text').text; }

	getWidth () { return this.width; }
}