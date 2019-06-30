
import Container from './base/Container';
export default class Row extends Container {
	constructor (row) {
		super();
		this.row = row;
		this.name = 'Row';
	}
}