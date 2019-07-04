
import * as PIXI from 'pixi.js';
import * as TWEEN from 'es6-tween';
import WebFont from 'webfontloader';

import SceneManager from './SceneManager';
import LoadScene from './scenes/LoadScene';
import MainScene from './scenes/MainScene';

export default class Application extends PIXI.Application {

	constructor (options) {
		super(options);
		document.body.appendChild(this.view);
		this.unitWidth = this.screen.width/8;
		this.stop();
	}

	init () {
		this.stage = new SceneManager(this);
		this.fonts = WebFont;
		this.textures = {};

		this.initScenes();

		this.ticker.add((dt) => { TWEEN.update(); this.stage.getCurrentScene().update();});
	}

	initScenes () {
		let loadScene = new LoadScene("LoadScene");
		this.stage.add(loadScene);
		let mainScene = new MainScene("MainScene");
		this.stage.add(mainScene);
		this.stage.switchTo("LoadScene");
	}
}