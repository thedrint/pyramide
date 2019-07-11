import ArrayManager from './../base/ArrayManager';
import SimpleCommandPool from './SimpleCommandPool';
import Command from './Command';

export default class CommandPool extends SimpleCommandPool {
	constructor (...params) {
		super(...params);
		this.trash = new SimpleCommandPool();
	}
	/** 
	 * Execute command first command from pool
	 * @param  {Command} command object of Command subclass
	 * @return {Command}     executed command
	 */
	execute () {
		let com = super.execute();
		if( (com.isEnded || com.isFailed) && typeof com.undo == 'function' ) 
			this.trash.add(new com.undo(com.rec, com.name, undefined, ...com.params));
		return com;
	}

	undo () {
		if( !this.hasUndo() ) return false;
		let com = this.trash.getLast().execute();
		if( com.isEnded || com.isFailed ) this.trash.pop();
		return com;
	}

	hasUndo () { return this.trash.length; }
}
