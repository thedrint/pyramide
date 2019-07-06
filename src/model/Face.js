import * as PIXI from 'pixi.js';

export default class FaceModel extends PIXI.Sprite {
	constructor (suitrank) {
		let loader, resourceName, resource, texture;
		loader = PIXI.Loader.shared;
		resourceName = `Card_${suitrank}`;
		resource = loader.resources[resourceName];
		texture = resource.svgBaseTexture ? new PIXI.Texture(resource.svgBaseTexture) : resource.texture;
		super(texture);
		this.name = `Face`;
	}
}
