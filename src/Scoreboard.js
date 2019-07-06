
import { Defaults } from './Settings';
import Utils from './Utils';
import ScoreboardModel from './model/Scoreboard';

export default class Scoreboard {

	constructor (settings = Defaults.Scoreboard) {
		this.settings = Utils.cleanOptionsObject(settings, Defaults.Scoreboard);
		this.scores = this.settings.attrs.scores;
	}

	initModel (scene) {
		this.model = new ScoreboardModel(this, scene);
	}

	updateScores (newScores) { this.model.updateScores(newScores); }
}
