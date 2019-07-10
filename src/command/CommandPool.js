import ArrayManager from './../base/ArrayManager';
import Command from './Command';

export default class CommandPool extends ArrayManager {
	/** 
	 * Execute command from params or first command from pool
	 * @param  {Command} command object of Command subclass
	 * @return {Command}     executed command
	 */
	execute (command = undefined) {
		let com = command || this.getFirst();
		console.log(com);
		com.execute();
		if( !command && (com.isEnded || com.isFailed) ) {
			this.delete(0);
		}
		return com;
	}
}
