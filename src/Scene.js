
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

	drawChild (child, position = new PIXI.Point(0,0)) {
		this.addChild(child);
		child.scene = this;
		let pos = child.spawn || position;
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

	drawPath (o, color = Colors.black, size = 1, ...coords) {
		if( !o.pathHelper ) {
			o.pathHelper = new PIXI.Graphics();
			o.pathHelper.name = 'PathHelper';
		}

		if( !coords.length )
			return this;

		o.pathHelper.clear();
		o.pathHelper.lineStyle(size, color);
		for( let i = 0; i < coords.length-1; i++ ) {
			let coord = coords[i];
			let nextCoord = coords[i+1];
			o.pathHelper.moveTo(coord.x, coord.y);
			o.pathHelper.lineTo(nextCoord.x, nextCoord.y);			
		}

		this.addChild(o.pathHelper);
		return this;
	}

	removePath (o) {
		if( o.pathHelper ) {
			o.pathHelper.destroy();
		}

		return this;
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

	drawLOS (o, t, color = Colors.black, size = 1) {
		if( !o.losHelper ) {
			o.losHelper = new Map();
		}

		if( o.losHelper.has(t) )
			return this;

		let los = o.sensor.getLOS(t);
		let line = Scene.createLine(los.start, los.end, color, size);
		line.target = t;
		line.name = `LOSHelper`;
		o.losHelper.set(t, line);
		this.addChild(line);

		return this;
	}

	removeLOS (o, t = undefined) {
		if( !o.losHelper ) 
			return this;
		
		let tLOS = o.losHelper.get(t);
		o.losHelper.delete(t);
		tLOS.destroy();
	}

}
