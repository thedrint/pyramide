
import ArrayManager from './base/ArrayManager';

export default class DealerDeckManager extends ArrayManager {
	add (...cards) {
		super.add(...cards);
		[...cards].forEach( card => {
			card.where = 'deck';
			card.emit('decked', card);
		});
		return this.length;
	}
	pop () {
		let card = super.pop();
		card.where = undefined;
		return card;
	}
	pack () { return this.reduce( (a,c) => {return [...a, c.name]}, []); }
}
