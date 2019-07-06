
import * as PIXI from 'pixi.js';
import SvgLoader from './../utils/SvgLoader';
// Local loading of font - have a bug in rendering, use Webfont instead
// import './../../fonts/PressStart2P.css';
//TODO: Haha, Webfont loads at first time with bug too
import { WebFont as WebFontConfig } from './../Settings';

import Utils from './../Utils';
import Colors from './../Colors';

import Card from './../Card';

import Scene from './../Scene';
// load sprites - we have predefined object list of imported textures
import { Textures as ImageTextures } from './../assets/img/Textures';
// reset styles for html (margins, paddings and other)
import 'reset-css';

export default class LoadScene extends Scene {

	constructor (name, options = {}) {
		super(name, options);//TODO: options?
	}

	init () {}

	preload () {
		this.resourceLoadingProgress = 0;
		console.log('SceneLoad preload()');
		this.preloadWebfonts();
	}

	preloadWebfonts () {
		let fonts = this.app.fonts;
		// Loading fonts first - we need ttf to create progressbar
		let fontsLoading = Object.assign(WebFontConfig, {
			active: () => {
				this.fontsLoaded = true;
				// Then loading other resources
				this.preloadResources();
			}
		});
		fonts.load(fontsLoading);
	}

	preloadResources () {
		let loader = PIXI.Loader.shared;
		// Add svgBaseTexture if svg card or shirt loaded
		loader.use((resource, next) => {
			if( resource.data && resource.extension === 'svg' ) {
				let options = {};
				if( /^Card_*/.test(resource.name) || resource.name == 'Shirt' )// Use scale for cards and shirt
					options.scale = this.app.unitWidth/resource.texture.orig.width;
				resource.svgBaseTexture = new PIXI.BaseTexture(new PIXI.resources.SVGResource(resource.url, options));
			}
			next();
		});
		
		const textures = {};
		// Add to queue textures we need
		for( let [name, url] of ImageTextures ) loader.add(name, `./../assets/img/${url}`);

		loader.load((loader, resources) => {
			for( let name in resources ) textures[name] = resources[name].texture;
			Object.assign(this.app.textures, textures);
		});

		loader.onProgress.add((loader) => {
			// When resources loading will become really slow - uncomment this and remove imitating in update()
			this.resourceLoadingProgress = loader.progress;
			if( this.resourceLoadingProgress >= 100 ) {
				console.log(`Switching to MainScene`);
				//TODO: make switch through animation/fade out/blur/etc
				this.app.stage.switchTo("MainScene");
			}
		});
	}

	create () {
		console.log('SceneLoad create()');
		this.progressbar();
	}

	update () {
		// Imitate long process of loading resources (in future it will become real)
		// this.resourceLoadingProgress += 3;
		this.progressbar(this.resourceLoadingProgress);

		// if( this.resourceLoadingProgress >= 100 ) {
		// 	console.log(`Switching to MainScene`);
		// 	//TODO: make switch through animation/fade out/blur/etc
		// 	this.app.stage.switchTo("MainScene");
		// }
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
