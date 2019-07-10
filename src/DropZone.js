import { Defaults } from './Settings';
import Utils from './Utils';
import DropZoneModel from './model/DropZone';
import DropManager from './DropManager';

export default class DropZone {

	constructor (settings = Defaults.DropZone) {
		this.settings = Utils.cleanOptionsObject(settings, Defaults.DropZone);
		this.cards = new DropManager();
	}

	initModel (scene) { this.model = new DropZoneModel(this, scene); }
}
