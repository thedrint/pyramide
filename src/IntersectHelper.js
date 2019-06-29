import * as PIXI from 'pixi.js';
import YyIntersects from 'yy-intersects';
import Utils from './Utils';

export default class IntersectHelper {
 
	static get Circle () {
		return YyIntersects.Circle;
	}
	static get Rectangle () {
		return YyIntersects.Rectangle;
	}

	static getShapeCenter (displayObject) {
		return Utils.getWorldCenter(displayObject);
		
		let localCenter = new PIXI.Point();
		let worldCenter = new PIXI.Point();
		
		if( displayObject.shape instanceof this.Circle ) {
			localCenter.set(0, 0);
		}
		else if ( displayObject.shape instanceof this.Rectangle ) {
			localCenter.set(displayObject.width/2, displayObject.height/2);
		}

		//TODO: I dont know how but it updates world transform of object and all starts to work
		displayObject.toGlobal(localCenter, worldCenter);

		// console.log(`${displayObject.parent.name}'s ${displayObject.name} localCenter`, localCenter);
		// console.log(`${displayObject.parent.name}'s ${displayObject.name} worldTransform`, displayObject.worldTransform);
		// console.log(`${displayObject.parent.name}'s ${displayObject.name} worldCenter`, worldCenter);

		return worldCenter;
	}

	//TODO: Move it to Game Utils too
	static getShapeTransform (displayObject) {
		let worldTransform = displayObject.worldTransform.decompose(new PIXI.Transform());
		return worldTransform;
	}

	static getShapeRotation (displayObject) {
		let worldTransform = this.getShapeTransform(displayObject);
		return worldTransform.rotation;
	}

	static updateIntersectShape (displayObject) {
		// console.log(`${displayObject.name} sizes`, displayObject.width, displayObject.height);

		let worldCenter = this.getShapeCenter(displayObject);
		let shapeUpdates = {};
		if( displayObject.shape instanceof this.Rectangle ) {
			// Hack for units
			if( displayObject.Body ) {
				// console.log(displayObject.Body);
				worldCenter = this.getShapeCenter(displayObject.Body);
				// console.log(`${displayObject.name} Body wc`, worldCenter);
				shapeUpdates = {
					square         : displayObject.Body.width,
					center         : worldCenter, 
					noRotate       : true,
				};
			}
			else {
				shapeUpdates = {
					center         : worldCenter, 
					rotation       : this.getShapeTransform(displayObject)
				};
			}
		}
		else if( displayObject.shape instanceof this.Circle ) {
			shapeUpdates = {
				positionObject : worldCenter, 
			};
		}

		// console.log(`${displayObject.parent.name}'s ${displayObject.name} shapeUpdates`, shapeUpdates);
		
		// .set() auto-updates AABB of object's shape
		displayObject.shape.set(shapeUpdates);

		// console.log(`${displayObject.name} updated shape`, displayObject.shape);
	}

	static updateShape (...displayObject) {
		displayObject.forEach( (o) => this.updateIntersectShape(o) );
	}
}
