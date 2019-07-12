import ArrayManager from './../base/ArrayManager';
import Command from './Command';

export default class SimpleCommandPool extends ArrayManager {
	constructor (...params) {
		super(...params);
	}

	/** 
	 * Execute first command from pool
	 * @param  {Command} command object of Command subclass
	 * @return {Command}     executed command
	 */
	execute () {
		if( !this.length ) return false;
		let com = this.getFirst().execute();
		if( com.isEnded ) this.shift();
		return com;
	}

	executeAll () {
		this.forEach( (com,i) => {
			com.execute();
			if( com.isEnded ) this.delete(i);
		})
	}
}
