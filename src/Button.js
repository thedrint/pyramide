
import { Defaults } from './Settings';
import Utils from './Utils';
import ButtonModel from './model/Button';

export default class Button {
	constructor (settings = Defaults.Button) {
		this.settings = Utils.cleanOptionsObject(settings, Defaults.Button);
	}

	initModel (scene) {
		this.model = new ButtonModel(this, scene);
	}
}
