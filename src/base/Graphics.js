
import * as PIXI from 'pixi.js';
import Utils from './../Utils';

export default class Graphics extends PIXI.Graphics {

	moveTo (target, speedInPixels) {
		return Utils.follow(this, speedInPixels);
	}

}
