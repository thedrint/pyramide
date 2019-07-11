import * as PIXI from 'pixi.js';
import Colors from './../Colors';
import {Unit as UnitSettings} from './../Settings';

export default class RowCellModel extends PIXI.Graphics {
	constructor (logic, scene) {
		super();
		this.name = 'Cell';
		this.logic = logic;
		this.scene = scene;
		this.init();
	}

	init () {
		let testCard = this.scene.cardSize;
		this.lineStyle(1, Colors.black, 0);
		this.drawShape(new PIXI.RoundedRectangle(0, 0, testCard.width, testCard.height, testCard.width*0.1));
	}
}
