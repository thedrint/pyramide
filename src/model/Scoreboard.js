
import * as PIXI from 'pixi.js';
import IntersectHelper from './../IntersectHelper';

import { Unit as UnitSettings, Defaults } from './../Settings';
import Utils from './../Utils';

import Container from './../base/Container';
import Scene from './../Scene';

export default class ScoreboardModel extends Container {

	constructor (logic, scene) {

		super(logic.settings);
		let { model } = logic.settings;
		this.name = model.name;
		this.init();
	}

	init () {
		let params = this.settings.model;

		let modelWidth = params.width * UnitSettings.size;
		let modelHeight = params.height * UnitSettings.size;

		let models = [];

		let board = Scene.createShape(new PIXI.Rectangle(0, 0, modelWidth, modelHeight), params.backgroundColor);
		board.name = `Scoreboard`;
		models.push(board);

		let text = new PIXI.Text(`000`, {
			fontFamily : 'Pacifico', fontWeight: 400, fontSize: modelHeight/2, lineHeight: modelHeight/2, 
			fill : params.fontColor, 
			align : `center`,
		});
		text.name = 'Text';
		text.anchor.set(0.5);
		models.push(text);

		this.addChild(...models);
		text.x = modelWidth/2;
		text.y = modelHeight/2;
		this.pivot.x += 0.5 * modelWidth;
		this.pivot.y += 0.5 * modelHeight;
		this.shape = new IntersectHelper.Rectangle(this);
	}

	getText () { return this.getChildByName('Text'); }
	updateScores (newScores) { this.getText().text = newScores; }

	getWidth () { return this.width; }
}