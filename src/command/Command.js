
export default class Command {

	static get STATE () {
		return {
			CREATE  : 'CREATE',
			EXECUTE : 'EXECUTE',
			FINISH  : 'FINISH',
			FAIL    : 'FAIL',
		};
	}
	constructor (receiver, name, ...params) {
		this.rec    = receiver;// Who executes command, receiver, recipient
		this.name   = name;// Command name
		this.params = params;// array of params
		this.result = undefined;// result of command
		this.state  = undefined;// current state of command
		this._undo  = undefined;// Command for undo this command
		this.started();
	}

	get undo ()        { return this._undo }
	set undo (command) { this._undo = command }

	/**
	 * Flow of executing command
	 * @return {Command} This command object with result of run in this.result field
	 */
	execute () {
		if( this.isStarted ) this.executed();
		// Make some pre-actions
		if( !this.pre() ) return this.failed();
		// Run some code, store return result
		this.result = this.run();
		// Make some post-actions after run had finished (ended or failed)
		if( this.isEnded ) this.post();
		return this;
	}

	/**
	 * Main action of command
	 * All inherits must implement this method
	 * @return {Any} Any result of command
	 */
	run () {
		this.finished();// or failed() or still executed() or something else
		return true;
	}

	/**
	 * Pre-run hook
	 * @return {bool} If returns false - main execute will be aborted
	 */
	pre  () { return true; }
	/**
	 * Post-run hook
	 * Can be used for do some actions after run() ended or failed
	 * @return nothing
	 */
	post () {}

	// Aliases for set different states
	started  () { this.state = Command.STATE.CREATE;  return this; }
	executed () { this.state = Command.STATE.EXECUTE; return this; }
	finished () { this.state = Command.STATE.FINISH;  return this; }
	failed   () { this.state = Command.STATE.FAIL;    return this; }
	ended    () { this.state = Command.STATE.FINISH;  return this; }// Alias
	// Aliases for get different states
	get isStarted  () { return this.state == Command.STATE.CREATE;  }
	get isExecuted () { return this.state == Command.STATE.EXECUTE; }
	get isFinished () { return this.state == Command.STATE.FINISH;  }
	get isFailed   () { return this.state == Command.STATE.FAIL;    }
	get isEnded    () { return (this.isFinished || this.isFailed);  }
}
