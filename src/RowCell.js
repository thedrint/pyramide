
import RowCellModel from './model/RowCell';

export default class RowCell {
	constructor (row, index) {
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
			card.attrs.row = this.row;
			card.attrs.index = this.index;
		}
	}

	removeCard () {
		let card = this.card;
		card.emit('removeFromCell', card);
		this._card = undefined;
		return card;
	}
}