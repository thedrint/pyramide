
import {Unit as UnitSettings} from './../Settings';
import Container from './../base/Container';
import RowCell from './../RowCell';

export default class RowModel extends Container {
	constructor (logic, scene) {
		super();
		this.name = 'Row';
		this.logic = logic;
		this.scene = scene;
	}

	drawCells () {
		this.removeChildren();
		let testCard = this.scene.cardSize;
		for( let cell of this.logic.cells ) {
			cell.initModel(this.scene);
			cell.model.x = cell.index*(testCard.width+UnitSettings.margin);
			this.addChild(cell.model);
		}
	}

	getCell(index) {
		return this.children.filter((child) => index == child.logic.index)[0];
	}
}