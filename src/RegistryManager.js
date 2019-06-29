
import ItemManager from './base/ItemManager';
/**
 * Logical structure for manage all objects in scene
 * It can add, get and delete objects (and even clear registry from all objects)
 */
export default class RegistryManager extends ItemManager {

	constructor (scene) {
		super();
		this.scene = scene;
	}

}