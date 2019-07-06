import * as PIXI from 'pixi.js';

export default class ShirtModel extends PIXI.Sprite {
	constructor () {
		let loader = PIXI.Loader.shared,
			resourceName = `Shirt`,
			resource = loader.resources[resourceName],
			texture;
		if( resource.svgBaseTexture ) {
			texture = new PIXI.Texture(resource.svgBaseTexture);
		}
		else
			texture = resource.texture;
		super(texture);
		this.name = `Shirt`;
	}
}
