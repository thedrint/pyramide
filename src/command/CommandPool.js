import Command from './Command';

export default class CommandPool extends Array {
	// Useful aliases
	add      (com) { super.push(com); }
	get      (n)   { return this[n]; }
	delete   (n)   { super.splice(n,1); }
	clear    ()    { super.length = 0; }
	getFirst ()    { return this.get(0); }
	/** 
	 * Execute command from params or first command from pool
	 * @param  {Command} command object of Command subclass
	 * @return {Command}     executed command
	 */
	execute (command = undefined) {
		let com = (command || this.getFirst()).execute();
		if( !command && (com.isEnded || com.isFailed) ) {
			this.delete(0);
		}
		return com;
	}
}
