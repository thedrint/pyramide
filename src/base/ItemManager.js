
/**
 * Logical structure for manage anything in scene
 * It based on Set() structure, so you may encounter in Set limitations
 */
export default class ItemManager extends Set {

	constructor (...args) {
		super(...args);
	}

	get (item) {
		return super.get(item);
	}

	add (item) {
		return super.add(item);
	}

	delete (item) {
		return super.delete(item);
	}

	clear () {
		return super.clear();
	}

}