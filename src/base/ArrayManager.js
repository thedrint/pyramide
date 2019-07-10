
export default class ArrayManager extends Array {
	// Useful aliases
	add      (item) { super.push(item); }
	get      (n)   { return this[n]; }
	delete   (n)   { super.splice(n,1); }
	clear    ()    { super.length = 0; }
	getFirst ()    { return this.get(0); }
}
