
export default class ArrayManager extends Array {
	// Useful aliases
	add      (...items) { super.push(...items); }
	get      (n)        { return this[n]; }
	delete   (n)        { super.splice(n,1); }
	clear    ()         { super.length = 0; }
	getFirst ()         { return this.get(0); }
	getLast  ()         { return this.get(this.length-1); }
}
