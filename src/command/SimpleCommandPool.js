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
		let com = this.getFirst().execute();
		if( com.isEnded || com.isFailed ) this.shift();
		return com;
	}
}
