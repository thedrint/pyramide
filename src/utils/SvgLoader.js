import * as PIXI from 'pixi.js';

export default class SvgLoader extends PIXI.TextureLoader {
	static pre (resource, next) {
		// console.log(resource);
		next();
	}
	static use (resource, next) {
		// create a new texture if the data is an Image object
		// console.log(resource);
		if( resource.data && resource.extension === 'svg' ) {
			let options = {};
			if( /^Card_*/.test(resource.name) || resource.name == 'Shirt' )// Use scale for cards
				options.scale = 0.33;
			resource.svgBaseTexture = new PIXI.BaseTexture(new PIXI.resources.SVGResource(resource.url, options));
		}
		next();
	}
}