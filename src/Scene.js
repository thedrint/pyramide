
import * as PIXI from 'pixi.js';
import Utils from './Utils';
import Colors from './Colors';
import Container from './base/Container';

export default class Scene extends Container {

	constructor (name, options = {}) {
		super();
		this.app = undefined;
		this.name = name;
	}

	init () {
		console.log('Init Scene...');
	}

	preload () {}

	create () {}

	update () {
		console.log('Updating...');
	}

	drawChild (child, position = undefined) {
		this.addChild(child);
		child.scene = child.scene || this;
		let pos = position || child.spawn || new PIXI.Point(0,0);
		child.x = pos.x;
		child.y = pos.y;
		// child.setTransform(pos.x, pos.y);
	}

	static createEllipse (x, y, width, height, color) {
		let graphics = new PIXI.Graphics();
		graphics.clear();
		graphics.beginFill(color);
		graphics.drawEllipse(x, y, width, height);
		graphics.endFill();
		return graphics;
	}

	static createLine (start = new PIXI.Point(0, 0), end = new PIXI.Point(10, 0), color = Colors.black, size = 1) {
		let graphics = new PIXI.Graphics();
		graphics.clear();
		graphics.lineStyle(size, color)
		graphics.moveTo(start.x, start.y);
		graphics.lineTo(end.x, end.y);
		return graphics;
	}

	static createShape (shape, color) {
		let graphics = new PIXI.Graphics();
		graphics.beginFill(color);
		graphics.drawShape(shape);
		graphics.endFill();
		return graphics;
	}

	drawBounds (o, color = Colors.red) {
		if( !o.boundsHelper ) {
			o.boundsHelper = new PIXI.Graphics();
			o.boundsHelper.name = 'BoundsHelper';
			this.addChild(o.boundsHelper);		
		}

		o.boundsHelper.clear();
		o.boundsHelper.lineStyle(1, color);
		o.toGlobal(new PIXI.Point(o.x, o.y));
		let b = o.getLocalBounds();
		let d = o.worldTransform.decompose(new PIXI.Transform());
		o.boundsHelper.drawShape(b);
		o.boundsHelper.setTransform(d.position.x, d.position.y, d.scale.x, d.scale.y, d.rotation, d.skew.x, d.skew.y, d.pivot.x, d.pivot.y);

		return this;
	}

	removeBounds (...obj) {
		obj.forEach( o => {
			if( o.boundsHelper ) o.boundsHelper.destroy();
		});
		return this;
	}

	drawCoords (step = 64) {
		this.coordHelper = new PIXI.Graphics();
		this.coordHelper.name = 'CoordHelper';
		this.addChild(this.coordHelper);		
		this.coordHelper.clear();
		this.coordHelper.lineStyle(1, Colors.red);
		// Draw x
		let x = 0;
		while( x <= this.app.screen.width ) {
			this.coordHelper.moveTo(x, 0);
			this.coordHelper.lineTo(x, this.app.screen.height);
			x += step;
		}
		// Draw y
		let y = 0;
		while( y <= this.app.screen.height ) {
			this.coordHelper.moveTo(0, y);
			this.coordHelper.lineTo(this.app.screen.width, y);
			y += step;
		}

		return this;
	}

	removeCoords () {
		if( this.coordHelper ) {
			this.coordHelper.destroy();
		}

		return this;
	}
}
