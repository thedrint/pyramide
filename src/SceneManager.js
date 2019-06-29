
import * as PIXI from 'pixi.js';

export default class SceneManager extends PIXI.Container {

	constructor (app) {
		super();

		this.app = app;
		this.scenes = new Set();
		this.current = undefined;
	}

	get (name) {
		return this.getChildByName(name);
	}

	add (scene) {
		let name = scene.name;
		if( name == undefined ) {
			return false;
		}
		if( this.scenes.has(name) ) {
			return false;
		}

		this.scenes.add(name);
		this.addChild(scene);
		scene.app = this.app;

		if( this.scenes.size == 1 ) {
			this.current = name;
		}

		return this;
	}

	delete (name) {
		if( !this.scenes.has(name) ) {
			return false;
		}

		let scene = this.get(name);
		if( this.removeChild(scene) ) {
			return this.scenes.delete(name);
		}
		else {
			return false;
		}
	}

	clear () {
		if( this.removeChildren() ) {
			return this.scenes.clear();
		}
		else {
			return false;
		}
	}

	getCurrentScene () {
		return this.get(this.current);
	}

	showScene (name) {
		let scene = this.get(name);
		scene.visible = true;
		this.bootScene(name);
		return scene;
	}
	hideScene (name) {
		let scene = this.get(name);
		scene.visible = false;
		return scene;
	}

	switchTo (name) {
		this.scenes.forEach( sceneName => {
			if( name != sceneName ) {
				this.hideScene(sceneName);
			}
		});

		this.current = name;
		return this.showScene(name);
	}

	bootScene (name = undefined) {
		if( !name ) {
			name = this.current;
		}
		let scene = this.get(name);
		if( !scene )
			return false;

		if( scene.init ) {
			scene.init.call(scene);
		}

		let loader = PIXI.Loader.shared;
		let fonts = this.app.fonts;

		if( loader && scene.preload ) {
			scene.preload.call(scene);

			// if nothing loaded or all loaded - go to creating scene
			if( !loader.loading ) {
				console.log('Nothing to load, lets create scene');
				scene.create.call(scene);
			}
			else {
				console.log('Wait for loading...')
				loader.onComplete.add(() => {
					console.log('All resources are loaded, lets create scene now');
					scene.create.call(scene);
				});				
			}
		}
		else {
			scene.create.call(scene);
		}
	}

}