
import Container from './../base/Container';

export default class DropZoneModel extends Container {

	constructor (logic, scene) {
		super(logic.settings);
		this.logic = logic;
		this.scene = scene;
		this.name = this.settings.model.name;
	}
}