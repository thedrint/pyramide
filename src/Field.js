
import IEventEmitter from './base/IEventEmitter';

import Row from './Row';
import FieldModel from './model/Field';

export default class Field extends IEventEmitter {
	constructor () {
		super();
		// this.settings = Utils.cleanOptionsObject(settings, Defaults.Field);
		this.rows = new Array();
		this.createRows();
	}

	initModel (scene) {
		this.model = new FieldModel(this, scene);
	}

	createRows () {
		for( let r = 0; r < 7; r++) this.rows.push(new Row(r));
	}
	
	clearRows () { this.rows.forEach( row => row.clearCells() ); }

	getRow (row) { return this.rows[row]; }
	getCell (row, index) { return this.rows[row].cells[index]; }

	pack () {
		return this.rows.reduce( (acc, row) => {
			return [...acc, row.cells.reduce( (a,c) => {
				return [...a, c.card ? c.card.name : undefined];
			}, [])]
		}, []);
	}
}
