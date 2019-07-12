
import IntersectHelper from './../IntersectHelper';
import Utils from './../Utils';
import Container from './../base/Container';

import FaceModel from './Face';
import ShirtModel from './Shirt';

import { Defaults } from './../Settings';

export default class CardModel extends Container {

	/**
	 * @param suitrank (s10 for spade ten, for example)
	 */
	constructor (logic, scene) {
		super(logic.settings);
		this.name = logic.name;
		this.logic = logic;
		this.scene = scene;
		this.interactive = true;
		this.buttonMode = true;
		this.init();
	}

	init () {
		let models = [];

		let face = new FaceModel(this.logic.name);
		models.push(face);

		let shirt = new ShirtModel();
		shirt.visible = false;
		models.push(shirt);

		this.addChild(...models);
		this.shape = new IntersectHelper.Rectangle(this);
		// this.cacheAsBitmap = true;
	}

	showFace () {
		this.face.visible = true;
		this.shirt.visible = false;
	}
	showShirt () {
		this.shirt.visible = true;
		this.face.visible = false;
	}

	get face () { return this.getChildByName('Face'); }
	get shirt () { return this.getChildByName('Shirt'); }
}
