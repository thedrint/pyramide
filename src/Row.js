import * as PIXI from 'pixi.js';
import Colors from './Colors';
import Container from './base/Container';
export default class Row extends Container {
	constructor (row) {
		super();
		this.row = row;
		this.name = 'Row';
	}

	drawCells () {
		this.removeChildren();
		let scene = this.parent.scene;
		let testCard = scene.testCard;
		let cells = [];
		for( let i = 0; i < this.row+1; i++ ) {
			let cell = new PIXI.Graphics();
			cell.lineStyle(1, Colors.white);
			cell.drawShape(new PIXI.RoundedRectangle(0, 0, testCard.width, testCard.height, testCard.width*0.1));
			cell.name = `Cell`;
			cell.row = this.row;
			cell.index = i;
			cell.x = i*testCard.width;
			cells.push(cell);
		}
		this.addChild(...cells);
	}

	getCell(index) {
		return this.children.filter((child) => index == child.index)[0];
	}
}