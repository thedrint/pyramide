
import RowCellModel from './model/RowCell';

export default class RowCell {
	constructor (row, index) {
		this.row = row;
		this.index = index;
	}

	initModel (scene) {
		this.model = new RowCellModel(this, scene);
	}
}