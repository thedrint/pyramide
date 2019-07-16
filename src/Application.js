
import * as PIXI from 'pixi.js';
import * as TWEEN from 'es6-tween';
import WebFont from 'webfontloader';
import { WebFont as WebFontConfig, Application as appSettings } from './Settings';
import Utils from './Utils';

import SceneManager from './SceneManager';
import LoadScene    from './scenes/LoadScene';
import ReloadScene  from './scenes/ReloadScene';
import MainScene    from './scenes/MainScene';

export default class Application extends PIXI.Application {

	constructor (options = {}) {
		let appOptions = Utils.deepMerge(appSettings, {
			width  : window.innerWidth,
			height : window.innerHeight,
		}, options);
		super(appOptions);
		this.view.style.display = 'block';
		document.body.appendChild(this.view);
		this.unitWidth  = parseInt(this.screen.width/8);
		this.unitHeight = parseInt(this.screen.height/4.5);
		this.stop();

		this.updateLoopFunction = this.updateLoop.bind(this);

		this.throttle("resize", "optimizedResize");
		window.addEventListener('optimizedResize', () => this.resizeWindowHandler() );
	}

	init () {
		this.stage = new SceneManager(this);
		this.fonts = WebFont;
		this.textures = {};
		this.preloadWebfonts();
	}

	initScenes () {
		let loadScene   = new LoadScene("LoadScene");
		let reloadScene = new ReloadScene("ReloadScene");
		let mainScene   = new MainScene("MainScene");
		this.stage.add(loadScene);
		this.stage.add(reloadScene);
		this.stage.add(mainScene);
		this.stage.switchTo("LoadScene");
	}

	updateLoop (dt) {
		TWEEN.update();
		this.stage.getCurrentScene().update();
	}

	preloadWebfonts () {
		let fonts = this.fonts;
		// Loading fonts first - we need ttf to create progressbar
		let fontsLoading = Object.assign(WebFontConfig, {
			active: () => {
				this.fontsLoaded = true;
				this.initScenes();
				this.ticker.add(this.updateLoopFunction);
			}
		});
		fonts.load(fontsLoading);
	}

	throttle (type, name, obj) {
		obj = obj || window;
		var running = false;
		var func = function() {
			if( running ) return;
			running = true;
			requestAnimationFrame(() => {
				obj.dispatchEvent(new CustomEvent(name));
				running = false;
			});
		};
		obj.addEventListener(type, func);
	}

	resizeWindowHandler () {
		if( PIXI.Loader.shared.loading ) return;
		// console.log(window.innerWidth, window.innerHeight);
		// console.log(this.renderer.gl.canvas.clientWidth, this.renderer.gl.canvas.clientHeight);
		if( this.stage.getCurrentScene().saveState ) {
			let scene = this.stage.getCurrentScene();
			scene.saveState();
			scene.once('created', () => {scene.restoreState()});
		}
		this.stop();
		this.renderer.resize(window.innerWidth, window.innerHeight);
		this.unitWidth  = parseInt(this.screen.width/8);
		this.unitHeight = parseInt(this.screen.height/4.5);
		this.start();
		console.log('Reloading table with new sizes...');
		this.stage.switchTo("ReloadScene");
	}

	resizeApp () {
		let game = {
			element : this.view,
			// width : this.renderer.width,
			// height : this.renderer.height,
			width : this.renderer.options.safeWidth,
			height : this.renderer.options.safeHeight,
			safeWidth : this.renderer.options.safeWidth,
			safeHeight : this.renderer.options.safeHeight,
		}
		let viewport, newGameWidth, newGameHeight, newGameX, newGameY;
		// console.log(this);
					
		// Get the dimensions of the viewport
		viewport = {
			width: window.innerWidth,
			height: window.innerHeight
		};

		// Determine game size
		if (game.height / game.width > viewport.height / viewport.width) {
			if (game.safeHeight / game.width > viewport.height / viewport.width) {
					// A
					newGameHeight = viewport.height * game.height / game.safeHeight;
					newGameWidth = newGameHeight * game.width / game.height;
			} else {
					// B
					newGameWidth = viewport.width;
					newGameHeight = newGameWidth * game.height / game.width;
			}
		} else {
			if (game.height / game.safeWidth > viewport.height / viewport.width) {
				// C
				newGameHeight = viewport.height;
				newGameWidth = newGameHeight * game.width / game.height;
			} else {
				// D
				newGameWidth = viewport.width * game.width / game.safeWidth;
				newGameHeight = newGameWidth * game.height / game.width;
			}
		}
		
		this.renderer.resize(newGameWidth, newGameHeight);			
		newGameX = (viewport.width - newGameWidth) / 2;
		newGameY = (viewport.height - newGameHeight) / 2;
		console.log(newGameWidth, newGameHeight, newGameX, newGameY);
		// Set the new padding of the game so it will be centered
		this.view.style.margin = newGameY + "px " + newGameX + "px";		
	}
}
