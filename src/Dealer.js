
import { Defaults } from './Settings';
import Utils from './Utils';
import DealerModel from './model/Dealer';
import DealerDeckManager from './DealerDeckManager';
import DealerSlotManager from './DealerSlotManager';

export default class Dealer {

	constructor (settings = Defaults.Dealer) {
		this.settings = Utils.cleanOptionsObject(settings, Defaults.Dealer);
		this.deck = new DealerDeckManager();
		this.slot = new DealerSlotManager();
	}

	initModel (scene) { this.model = new DealerModel(this, scene); }
}
