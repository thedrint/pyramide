
import Container from './base/Container';
export default class Field extends Container {
	constructor () {
		super();
		this.name = 'Field';
		this.sortableChildren = true;
	}
}