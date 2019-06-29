
import ItemManager from './base/ItemManager';
/**
 * Logical structure for manage units in scene.
 * UnitManager works in pair with RegistryManager.
 * UnitManager can add, get and delete units
 */
export default class UnitManager extends ItemManager {

	constructor (scene) {
		super();
		this.scene = scene;
	}

	add (unit) {
		super.add(unit);
		unit.once('die', () => this.delete(unit), this);
		this.scene.registry.add(unit);
		return this;
	}

	delete (unit) {
		this.scene.registry.delete(unit);
		return super.delete(unit);
	}

	clear () {
		for( let unit of this )
			this.scene.registry.delete(unit);
		
		return super.clear();
	}

}