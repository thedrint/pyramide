
import * as PIXI from 'pixi.js';
import * as Angle from 'yy-angle';

import {ONE_DEGREE} from './../Constants';
import { FPS } from './../Settings';
import Utils from './../Utils';

export default class Container extends PIXI.Container {

	constructor (settings = {}) {
		super();
		this.settings = settings;
	}

	moveTo (target, speedInPixels = 1) {
		let lastCoords = {x:this.x, y:this.y};
		Utils.follow(this, target, speedInPixels);
	}

	rotateTo (rad) {
		this.rotation = Angle.normalize(rad);
	}

	rotateBy (rad) {
		this.rotation += rad;
		// Don't forget about normalizing angle
		if( Math.abs(this.rotation) > Angle.PI_2 ) {
			this.rotation = Angle.normalize(this.rotation);
		}
	}

	followTo (target, speedInPixels = undefined) {		
		if( !this.discreteRotate(Utils.getPointAngle(this, target)) )
			this.moveTo(target, speedInPixels);
		return this;
	}

	easeRotateTo(targetRotation) {
		this.discreteRotate(targetRotation);
		return this;
	}

	discreteRotate (targetRotation) {
		let angularVelocity = this.getAngularVelocity();
		let diff = Angle.differenceAngles(targetRotation, this.rotation);
		if( diff < ONE_DEGREE*2 ) 
			return false;// No need to rotate
		if( diff >= angularVelocity ) 
			this.rotateBy(Angle.differenceAnglesSign(targetRotation, this.rotation)*angularVelocity);
		else 
			this.rotateTo(targetRotation);
		return true;// Some rotate was doing
	}

	//TODO: Get current angular velocity (calc based on current fps)
	getAngularVelocity () { return Angle.PI_2/FPS.target; }
}
