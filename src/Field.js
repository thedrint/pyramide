
import Row from './Row';
import FieldModel from './model/Field';

export default class Field {
	constructor () {
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

	getRow (row) { return this.rows[row]; }
	getCell (row, index) { return this.rows[row].cells[index]; }
}
