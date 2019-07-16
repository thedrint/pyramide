import * as PIXI from 'pixi.js';

export default class FaceModel extends PIXI.Sprite {
	constructor (suitrank, scene) {
		let loader, resourceName, resource, texture;
		loader = PIXI.Loader.shared;
		resourceName = `Card_${suitrank}`;
		resource = loader.resources[resourceName];
		// if( resource.data && resource.extension === 'svg' ) {
		// 	let options = {};
		// 	let scaleW = scene.cardWidth/resource.texture.orig.width;
		// 	let scaleH = scene.cardHeight/resource.texture.orig.height;
		// 	options.scale = Math.min(scaleW, scaleH);
		// 	resource.svgBaseTexture = new PIXI.BaseTexture(new PIXI.resources.SVGResource(resource.url, options));
		// }
		texture = resource.svgBaseTexture ? new PIXI.Texture(resource.svgBaseTexture) : resource.texture;
		super(texture);
		this.name = `Face`;
	}
}
