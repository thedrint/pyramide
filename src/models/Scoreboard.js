
import * as PIXI from 'pixi.js';
import IntersectHelper from './../IntersectHelper';

import { Unit as UnitSettings, Defaults } from './../Settings';
import Utils from './../Utils';

import Graphics from './../base/Graphics';

import Scene from './../Scene';

export default class Scoreboard extends Graphics {

	constructor (settings = {
		name  : Defaults.Scoreboard.name, 
		attrs : Defaults.Scoreboard.attrs, 
		model : Defaults.Scoreboard.model
	}) {

		super();

		let { 
			name  = Defaults.Scoreboard.name, 
			attrs = Defaults.Scoreboard.attrs, 
			model = Defaults.Scoreboard.model 
		} = settings;
		this.name = name;
		this.attrs = Utils.cleanOptionsObject(attrs, Defaults.Scoreboard.attrs);
		this.scores = this.attrs.scores;

		this.initModel(model);
	}

	initModel (model = Defaults.Scoreboard.model) {
		let params = Utils.cleanOptionsObject(model, Defaults.Scoreboard.model);

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

	getModel () { return this.getChildByName('Scoreboard'); }
	getText () { return this.getChildByName('Text'); }
	updateScores (newScores) { this.getText().text = newScores; }

	getWidth () { return this.width; }
}