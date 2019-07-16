
import IEventEmitter from './base/IEventEmitter';

import RowCellModel from './model/RowCell';

export default class RowCell extends IEventEmitter {
	constructor (row, index) {
		super();
		this.row = row;
		this.index = index;
		this._card = undefined;
	}

	initModel (scene) {
		this.model = new RowCellModel(this, scene);
	}

	get card () { return this._card; }

	set card (card) {
		if( !card )
			this.removeCard();
		else {
			this._card = card;
			card.row   = this.row;
			card.index = this.index;
			card.from  = 'field';
			card.where = 'field';
		}
	}

	clear () { this._card = undefined; }

	removeCard () {
		let card = this.card;
		// card.where = undefined;
		card.emit('removeFromCell', card);
		this._card = undefined;
		return card;
	}
}