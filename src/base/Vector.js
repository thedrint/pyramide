
import * as PIXI from 'pixi.js';

/*
 * @class Vector
 * @constructor 
 * @param x {Number} position of the point
 * @param y {Number} position of the point
 */
export default class Vector extends PIXI.Point {
	/**
	 * Creates a clone of this point
	 * @method clone
	 * @return {Vector} a copy of the point
	 */
	clone () {
		return new Vector(this.x, this.y);
	}

	point () {
		return new PIXI.Point(this.x, this.y);
	}

	add (...params) {
		if( !params.length ) return this;
		if( params.length == 1 ) {// Vector
			this.x += params[0].x;
			this.y += params[0].y;
		}
		else {// coords
			this.x += params[0];
			this.y += params[1];
		}
		return this;
	}

	sub (...params) {
		if( !params.length ) return this;
		if( params.length == 1 ) {// Vector
			this.x -= params[0].x;
			this.y -= params[0].y;
		}
		else {// Coords
			this.x -= params[0];
			this.y -= params[1];
		}
		return this;
	}

	multiplyScalar (s) {
		this.x *= s;
		this.y *= s;
		return this;
	}

	divideScalar (s) {
		if(s === 0) {
			this.x = 0;
			this.y = 0;
		} 
		else {
			var invScalar = 1 / s;
			this.x *= invScalar;
			this.y *= invScalar;
		}
		return this;
	}

	invert (v) {
		return this.multiplyScalar(-1);
		return this;
	}

	dot (v) {
		return this.x * v.x + this.y * v.y;
	}

	get length () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	lengthSq () {
		return this.x * this.x + this.y * this.y;
	}

	normalize () {
		return this.divideScalar(this.length());
	}

	distanceTo (v) {
		return Math.sqrt(this.distanceToSq(v));
	}

	distanceToSq (v) {
		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;
	}

	set (x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

	set length (l) {
		var oldLength = this.length;
		if(oldLength !== 0 && l !== oldLength) {
			this.multiplyScalar(l / oldLength);
		}
		return this;
	}

	lerp (v, alpha) {
		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;
		return this;
	}

	rad () {
		return Math.atan2(this.x, this.y);
	}

	deg () {
		return this.rad() * 180 / Math.PI;
	}

	equals (v) {
		return this.x === v.x && this.y === v.y;
	}

	rotate (theta) {
		var xtemp = this.x;
		this.x = this.x * Math.cos(theta) - this.y * Math.sin(theta);
		this.y = xtemp * Math.sin(theta) + this.y * Math.cos(theta);
		return this;
	}
}
