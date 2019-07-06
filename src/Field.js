
import Container from './base/Container';

export default class Field {
	constructor () {
		this.model = new Container();
		this.model.name = 'Field';
		this.model.sortableChildren = true;
		this.model.logic = this;
	}
}
