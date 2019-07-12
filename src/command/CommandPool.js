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
		if( !this.length ) return false;
		let com = super.execute();
		if( (com.isEnded || com.isFailed) && com.undo instanceof Command ) this.trash.add(com.undo);
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
