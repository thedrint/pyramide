
import ArrayManager from './base/ArrayManager';

export default class DealerSlotManager extends ArrayManager {
	add (...cards) {
		super.add(...cards);
		[...cards].forEach( card => {
			card.where = 'slot';
			card.emit('sloted', card);
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
