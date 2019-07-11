
import IEventEmitter from './base/IEventEmitter';

import { Defaults } from './Settings';
import Utils from './Utils';
import ModalBoxModel from './model/ModalBox';

export default class ModalBox extends IEventEmitter {
	constructor (settings = Defaults.ModalBox) {
		super();
		this.settings = Utils.cleanOptionsObject(settings, Defaults.ModalBox);
	}

	initModel (scene) {
		this.model = new ModalBoxModel(this, scene);
	}

	toggle       () { return this.model.toggle(); }
	set text     (newText) { this.model.text = newText; }
	get text     () { return this.model.text; }
}
