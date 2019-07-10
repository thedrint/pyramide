
import {Unit as UnitSettings} from './../Settings';
import Container from './../base/Container';

export default class FieldModel extends Container {
	constructor (logic, scene) {
		super(logic.settings);
		this.name = 'Field';
		this.logic = logic;
		this.scene = scene;
		this.sortableChildren = true;
	}

	getRow(index) {
		return this.children.filter((child) => (child.name == 'Row') && (index == child.logic.row) )[0];
	}
}