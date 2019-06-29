
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
		this.started();
	}

	/**
	 * Flow of executing command
	 * @return {Command} This command object with result of run in this.result field
	 */
	execute () {
		this.executed();
		// Make some pre-actions
		if( !this.pre() ) {
			this.failed();
			return this;
		}
		// Run some code that return result
		this.result = this.run();
		return this;
	}

	/**
	 * Main action of command
	 * All inherits must implement this method
	 * @return {Any} Any result of command
	 */
	run () {
		this.ended();// or failed() or still executed() or pended() or something else
		return true;
	}

	/**
	 * Pre-run hook
	 * @return {bool} If returns false - main execute will be aborted
	 */
	pre () { return true; }

	// Aliases for set different states
	started  () { this.state = Command.STATE.CREATE; }
	executed () { this.state = Command.STATE.EXECUTE; }
	ended    () { this.state = Command.STATE.FINISH; }
	failed   () { this.state = Command.STATE.FAIL; }
	// Aliases for get different states
	get isStarted  () { return this.state == Command.STATE.CREATE; }
	get isExecuted () { return this.state == Command.STATE.EXECUTE; }
	get isEnded    () { return this.state == Command.STATE.FINISH; }
	get isFailed   () { return this.state == Command.STATE.FAIL; }
}
