
import * as PIXI from 'pixi.js';
import Scene from './../Scene';
import { Textures as ImageTextures } from './../assets/img/Textures';

export default class ReloadScene extends Scene {

	constructor (name, options = {}) {
		super(name, options);//TODO: options?
	}

	init () {}

	preload () {
		let loader = PIXI.Loader.shared;
		this.svgLoadPromises = [];		
		const textures = {};
		for( let [name, url] of ImageTextures ) {
			let resource = loader.resources[name];
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
		}

		Promise
			.all(this.svgLoadPromises)
			.then( vals => this.app.stage.switchTo("MainScene") )
			.catch( e => console.error(e) );
	}

	create () {
		if( this.table ) this.table.destroy();
		this.table = new PIXI.TilingSprite(this.app.textures.Table, this.app.screen.width, this.app.screen.height);
		this.addChild(this.table);
		this.emit('created');
	}

	update () {}
}
