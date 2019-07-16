
import * as PIXI from 'pixi.js';
import Utils from './../Utils';
import Colors from './../Colors';

import Scene from './../Scene';
import { Textures as ImageTextures } from './../assets/img/Textures';
import 'reset-css';

export default class LoadScene extends Scene {

	constructor (name, options = {}) {
		super(name, options);//TODO: options?
	}

	init () {}

	preload () {
		this.resourceLoadingProgress = 0;

		let loader = PIXI.Loader.shared;
		this.svgLoadPromises = [];
		// Add svgBaseTexture if svg card or shirt loaded
		loader.use((resource, next) => {
			if( resource.data && resource.extension === 'svg' ) {
				let options = {};
				if( /^Card_*/.test(resource.name) || resource.name == 'Shirt' ) {// Use scale for cards and shirt
					let scaleW = this.app.unitWidth/resource.texture.orig.width;
					let scaleH = this.app.unitHeight/resource.texture.orig.height;
					options.scale = Math.min(scaleW, scaleH);
				}
				resource.svgResource = new PIXI.resources.SVGResource(resource.url, options);
				this.svgLoadPromises.push(resource.svgResource.load());
				resource.svgBaseTexture = new PIXI.BaseTexture(resource.svgResource);
			}
			next();
		});
		
		const textures = {};
		// Add to queue textures we need
		for( let [name, url] of ImageTextures ) loader.add(name, `./../assets/img/${url}`);
		loader.load((loader, resources) => {
			Promise
				.all(this.svgLoadPromises)
				.then(vals=>{
					for( let name in resources ) textures[name] = resources[name].texture;
					Object.assign(this.app.textures, textures);
					if( loader.progress >= 100 ) this.app.stage.switchTo("MainScene");				
				})
				.catch(e=>console.error(e));				
		});

		loader.onLoad.add( (loader, resource) => {this.resourceLoadingProgress = loader.progress} );
	}

	create () {
		this.progressbar();
		this.emit('created');
	}

	update () {
		this.progressbar(this.resourceLoadingProgress);
	}

	/**
	 * Very very simple progressbar redraw
	 * @param  {Number} loadingProgress current progress percentage
	 * @return {Null}   Nothing
	 */
	progressbar (loadingProgress = 0) {
		if( !this.progressBar ) {
			let progressBar = new PIXI.Container();
			progressBar.name = 'Progressbar';
			let w = this.app.screen.width*0.6;
			let h = 40;
			let r = 10;
			let backShape = new PIXI.RoundedRectangle(0, 0, w, h, r);
			let progShape = new PIXI.RoundedRectangle(0, 0, 1, h, r);
			let background = Scene.createShape(backShape, Colors.brown);
			background.name = 'Background';
			let progress = Scene.createShape(progShape, Colors.green);
			progress.name = 'Progress';

			let text = new PIXI.Text(`${loadingProgress}%`, {
				fontFamily : 'Pacifico', fontWeight: 400, fontSize: h/2, lineHeight: h/2, 
				fill : Colors.black, 
				align : `center`,
			});
			text.name = 'Text';
			text.anchor.set(0.5);

			progressBar.addChild(background, progress, text);
			this.addChild(progressBar);

			progress.visible = false;

			progressBar.x = (this.app.screen.width - w) / 2;
			progressBar.y = this.app.screen.height/2 - h/2;
			text.y = h/2;
			text.x = w/2;

			this.progressBar = progressBar;
			this.lastProgress = loadingProgress;
		}

		// Redraw progress only if changed
		if( loadingProgress != this.lastProgress && loadingProgress <= 100 ) {
			let progress = this.progressBar.getChildByName('Progress');
			let w = this.progressBar.width * loadingProgress/100;
			let h = this.progressBar.height;
			let r = 10;
			let progShape = new PIXI.RoundedRectangle(0, 0,  w, h, r);

			progress.clear();
			progress.beginFill(Colors.green);
			progress.drawShape(progShape);
			progress.endFill();
			progress.visible = true;

			// Redraw only for tens
			if( true || loadingProgress%10 == 0 ) {
				let text = this.progressBar.getChildByName('Text');
				text.text = `${Number.parseInt(loadingProgress)}%`;
				text.visible = true;
			}

			this.lastProgress = loadingProgress;
		}

		return;
	}
}
