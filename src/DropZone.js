
import IEventEmitter from './base/IEventEmitter';

import { Defaults } from './Settings';
import Utils from './Utils';
import DropZoneModel from './model/DropZone';
import DropManager from './DropManager';

export default class DropZone extends IEventEmitter {
	constructor (settings = Defaults.DropZone) {
		super();
		this.settings = Utils.cleanOptionsObject(settings, Defaults.DropZone);
		this.cards = new DropManager();
	}

	initModel (scene) { this.model = new DropZoneModel(this, scene); }
}
