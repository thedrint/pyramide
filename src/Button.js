
import IEventEmitter from './base/IEventEmitter';

import { Defaults } from './Settings';
import Utils from './Utils';
import ButtonModel from './model/Button';

export default class Button extends IEventEmitter {
	constructor (settings = Defaults.Button) {
		super();
		this.settings = Utils.cleanOptionsObject(settings, Defaults.Button);
		this.name = this.settings.model.name;
	}

	initModel (scene) {
		this.model = new ButtonModel(this, scene);
	}
}
