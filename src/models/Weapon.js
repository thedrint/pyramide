
import * as PIXI from 'pixi.js';
import * as TWEEN from 'es6-tween';
import IntersectHelper from './../IntersectHelper';

import { Unit as UnitSettings, Defaults } from './../Settings';
import Utils from './../Utils';

export default class Weapon extends PIXI.Container {

	constructor (settings = {
		name: Defaults.weapon.name, 
		attrs: Defaults.weapon.attrs, 
		model: Defaults.weapon.model
	}) {

		super();

		let { 
			name = Defaults.weapon.name, 
			attrs = Defaults.weapon.attrs, 
			model = Defaults.weapon.model 
		} = settings;
		this.name = name;

		this.attrs = Utils.cleanOptionsObject(settings, Defaults.weapon.attrs);

		this.initModel(model);

		this.piercing = false;
		this.collider = false;
	}

	initModel (model = Defaults.weapon.model) {
		let params = Utils.cleanOptionsObject(model, Defaults.weapon.model);
		let models = [];

		let bladeLength = params.size * UnitSettings.size;

		let res = params.texture.baseTexture.resource;
		let svgTexture = PIXI.BaseTexture.from(res);
		svgTexture.setSize(bladeLength, res.height * bladeLength/res.width);
		let bladeTexture = new PIXI.Texture(svgTexture);
		let blade = PIXI.Sprite.from(bladeTexture);
		blade.anchor.set(0.2,0.5);// For every texture it must be set individually
		blade.name = `Blade`;
		models.push(blade);

		this.addChild(...models);
		this.shape = new IntersectHelper.Rectangle(this);
	}

	pierce (target, speed = 300) {
		if( this.piercing )
			return;
		
		let pierceLength = this.width;

		const tween = new TWEEN.Tween(this)
			.to({x:pierceLength}, speed)
			.repeat(1)
			.easing(TWEEN.Easing.Linear.None)
			.yoyo(true)
			// .on('update', () => {
			// 	console.log(tween)
			// })
			.on('complete', () => {
				// console.log('Piercing complete');
				this.piercing = false;
				this.collider = false;
			})
			.start()
		;

		this.piercing = tween;
	}

	getModel () { return this.getChildByName(`Blade`); }
	getLength () { return this.width; }
}
