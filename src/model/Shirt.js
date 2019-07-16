import * as PIXI from 'pixi.js';

export default class ShirtModel extends PIXI.Sprite {
	constructor (scene) {
		let loader = PIXI.Loader.shared,
			resourceName = `Shirt`,
			resource = loader.resources[resourceName],
			texture;
		// if( resource.data && resource.extension === 'svg' ) {
		// 	let options = {};
		// 	let scaleW = scene.cardWidth/resource.texture.orig.width;
		// 	let scaleH = scene.cardHeight/resource.texture.orig.height;
		// 	options.scale = Math.min(scaleW, scaleH);
		// 	resource.svgBaseTexture = new PIXI.BaseTexture(new PIXI.resources.SVGResource(resource.url, options));
		// }
		texture = resource.svgBaseTexture ? new PIXI.Texture(resource.svgBaseTexture) : resource.texture;
		super(texture);
		this.name = `Shirt`;
	}
}
