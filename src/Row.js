
import RowModel from './model/Row';
import RowCell from './RowCell';

export default class Row {
	constructor (row) {
		this.row = row;
		this.cells = [];
	}

	initModel (scene) {
		this.model = new RowModel(this, scene);
	}

	createCells () {
		for( let i = 0; i < this.row+1; i++ ) {
			let cell = new RowCell(this.row, i);
			this.cells.push(cell);
		}
	}

	getCell(index) {
		return this.cells[index];
	}
}
