
import MapManager from './base/MapManager';
/**
 * Logical structure for manage units in scene.
 * UnitManager works in pair with RegistryManager.
 * UnitManager can add, get and delete units
 */
export default class CardManager extends MapManager {

	constructor (scene) {
		super();
		this.scene = scene;
	}

	add (item) {
		super.add(item);
		this.scene.registry.add(item);
		return this;
	}

	delete (item) {
		this.scene.registry.delete(item);
		return super.delete(item);
	}

	clear () {
		[...this.values()].forEach(v=>this.scene.registry.delete(v));
		return super.clear();
	}

	pack () {
		return [...this.values()].reduce( (a,card) => {
			return [...a, {
				name: card.name,
				row: card.row,
				index: card.index,
				from: card.from,
				where: card.where,
			}];
		}, []);
	}

}