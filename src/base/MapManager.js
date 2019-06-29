
/**
 * Logical structure for manage anything like a Map
 * It based on Set() structure, so you may encounter in Set limitations
 */
export default class MapManager extends Map {
	add    (item) { return super.set(item.name || item, item); }
	delete (item) { return super.delete(item.name || item); }
}