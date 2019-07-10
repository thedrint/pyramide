
import ArrayManager from './base/ArrayManager';

export default class DropManager extends ArrayManager {
	push (card) {
		super.push(card);
		card.emit('dropped', card);
	}
}