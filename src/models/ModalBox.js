
import * as PIXI from 'pixi.js';

import { Unit as UnitSettings, Defaults } from './../Settings';
import Utils from './../Utils';

import Container from './../base/Container';

import Scene from './../Scene';

export default class ModalBox extends Container {

	constructor (settings = Defaults.ModalBox) {
		super(settings);

		let { 
			name  = Defaults.ModalBox.name, 
			attrs = Defaults.ModalBox.attrs, 
		} = settings;
		this.name = name;
		this.attrs = Utils.cleanOptionsObject(attrs, Defaults.ModalBox.attrs);
		this._text = this.attrs.text;
	}

	initModel (model = Defaults.ModalBox.model) {
		let params = Utils.cleanOptionsObject(model, Defaults.ModalBox.model);

		let modalWidth  = this.scene.app.screen.width * 0.8;
		let modalHeight = this.scene.app.screen.height * 0.8;

		let models = [];

		let background = Scene.createShape(new PIXI.RoundedRectangle(0, 0, modalWidth, modalHeight, modalWidth*0.1), params.backgroundColor);
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
	}

	toggle       () { this.visible = !this.visible; }
	getModel     (name = undefined) { return name ? this.getChildByName(name) : this.getChildByName('ModalBox'); }
	set text     (newText) { this.getModel('Text').text = newText; }
	get text     () { return this.getModel('Text').text; }

	getWidth () { return this.width; }
}