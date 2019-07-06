
import { Defaults } from './Settings';
import Utils from './Utils';
import DealerModel from './model/Dealer';

export default class Dealer {

	constructor (settings = Defaults.Dealer) {
		this.settings = Utils.cleanOptionsObject(settings, Defaults.Dealer);
	}

	initModel (scene) {
		this.model = new DealerModel(this, scene);
	}

	get Shirt () { return this.model.getChildByName('Shirt'); }
	get Slot () { return this.model.getChildByName('Slot'); }
}
