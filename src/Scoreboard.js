
import { Defaults } from './Settings';
import Utils from './Utils';
import ScoreboardModel from './model/Scoreboard';

export default class Scoreboard {

	constructor (settings = Defaults.Scoreboard) {
		this.settings = Utils.cleanOptionsObject(settings, Defaults.Scoreboard);
		this._scores = parseInt(this.settings.attrs.scores);
	}

	initModel (scene) {
		this.model = new ScoreboardModel(this, scene);
	}

	get scores () { return this._scores; }
	set scores (newScores) {
		this._scores = newScores;
		this.updateScores();
	}

	updateScores (newScores = undefined) { 
		if( newScores ) this._scores = newScores;
		this.model.updateScores(this._scores.toString().padStart(3, '0')); 
	}
}
