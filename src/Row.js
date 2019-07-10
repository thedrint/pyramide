
import RowModel from './model/Row';
import RowCell from './RowCell';

export default class Row {
	constructor (row) {
		this.row = row;
		this.cells = [];
		this.createCells();
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

	addCard (card) {
		for( let cell of this.cells ) {
			if( cell.card ) continue;
			cell.addCard(card);
			return true;
		}
		return false;
	}

	empty () {
		let emptyCells = this.cells.reduce( (a,c) => { return a + parseInt(!c.card) }, 0);
		return emptyCells == this.cells.length;
	}
}
