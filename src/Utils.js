
import * as PIXI from 'pixi.js';

export default class Utils {

	constructor() {}

	// https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
	static deepMerge (...objects) {
		const isObject = obj => obj && typeof obj === 'object';
		return objects.reduce((prev, obj) => {
			Object.keys(obj).forEach(key => {
				const pVal = prev[key], oVal = obj[key];
				if (Array.isArray(pVal) && Array.isArray(oVal)) 
					prev[key] = pVal.concat(...oVal);
				else if (isObject(pVal) && isObject(oVal)) 
					prev[key] = this.deepMerge(pVal, oVal);
				else 
					prev[key] = oVal;
			});
			return prev;
		}, {});
	}
	/**
	 * This method filter plain-options object by defaults object by key, than merge filtered with defaults.
	 * @param  {Object} options  any plain object with options, like {a:123, b:456, c: 789}
	 * @param  {Object} defaults default values for allowed options, like {a: 'Allowed A', b: 123}
	 * @return {Object} merged objects where only allowed options, and all non-existent values replaced with defaults
	 */
	static cleanOptionsObject (options = {}, defaults = {}) {
		/* Thanks to https://stackoverflow.com/questions/38750705/filter-object-properties-by-key-in-es6 */
		// Get list of allowed options
		const allowedOptions = Object.keys(defaults);
		// Filter and create new option's object with only allowed options inside
		const filteredOptions = Object.keys(options)
			.filter(key => allowedOptions.includes(key))
			.reduce((obj, key) => {
				return {
					...obj,
					[key]: options[key]
				};
			}, {});
		// Merge default options with filtered and return this new object
		return this.deepMerge(defaults, filteredOptions);
	}

	/*
	distance
	----------------

	Find the distance in pixels between two sprites.
	Parameters: 
	a. A sprite object. 
	b. A sprite object. 
	The function returns the number of pixels distance between the sprites.

		 let distanceBetweenSprites = gu.distance(spriteA, spriteB);

	*/

	static distanceBetween (p1, p2) { return Math.sqrt(Math.pow(p2.x-p1.x, 2) + Math.pow(p2.y-p1.y, 2)); }
	static distance(s1, s2) {
		let vx = (s2.x + this._getCenter(s2, s2.width, "x")) - (s1.x + this._getCenter(s1, s1.width, "x")),
				vy = (s2.y + this._getCenter(s2, s2.height, "y")) - (s1.y + this._getCenter(s1, s1.height, "y"));
		return Math.sqrt(vx * vx + vy * vy);
	}

	static getLocal (o) { return new PIXI.Point(o.x, o.y); }
	static getLocalCenter (o) {
		let localCenter = new PIXI.Point();
		let b = o.getLocalBounds();
		localCenter.set(b.x + b.width/2, b.y + b.height/2);
		return localCenter;
	}
	static getWorldCenter (o) { return o.toGlobal(this.getLocalCenter(o), new PIXI.Point()); }

	/*
	followEase
	----------------

	Make a sprite ease to the position of another sprite.
	Parameters: 
	a. A sprite object. This is the `follower` sprite.
	b. A sprite object. This is the `leader` sprite that the follower will chase.
	c. The easing value, such as 0.3. A higher number makes the follower move faster.

		 gu.followEase(follower, leader, speed);

	Use it inside a game loop.
	*/

	static followEase(follower, leader, speed) {

		//Figure out the distance between the sprites
		/*
		let vx = (leader.x + leader.width / 2) - (follower.x + follower.width / 2),
				vy = (leader.y + leader.height / 2) - (follower.y + follower.height / 2),
				distance = Math.sqrt(vx * vx + vy * vy);
		*/

		let vx = (leader.x + this._getCenter(leader, leader.width, "x")) - (follower.x + this._getCenter(follower, follower.width, "x")),
				vy = (leader.y + this._getCenter(leader, leader.height, "y")) - (follower.y + this._getCenter(follower, follower.height, "y")),
				distance = Math.sqrt(vx * vx + vy * vy);

		//Move the follower if it's more than 1 pixel
		//away from the leader
		if (distance >= 1) {
			follower.x += vx * speed;
			follower.y += vy * speed;
		}
	}

	/*
	followConstant
	----------------

	Make a sprite move towards another sprite at a constant speed.
	Parameters: 
	a. A sprite object. This is the `follower` sprite.
	b. A sprite object. This is the `leader` sprite that the follower will chase.
	c. The speed value, such as 3. The is the pixels per frame that the sprite will move. A higher number makes the follower move faster.

		 gu.followConstant(follower, leader, speed);

	*/

	static followConstant(follower, leader, speed) {

		//Figure out the distance between the sprites
		let vx = (leader.x + this._getCenter(leader, leader.width, "x")) - (follower.x + this._getCenter(follower, follower.width, "x")),
				vy = (leader.y + this._getCenter(leader, leader.height, "y")) - (follower.y + this._getCenter(follower, follower.height, "y")),
				distance = Math.sqrt(vx * vx + vy * vy);

		//Move the follower if it's more than 1 move
		//away from the leader
		if (distance >= speed) {
			follower.x += (vx / distance) * speed;
			follower.y += (vy / distance) * speed;
		}
	}

	static follow (follower, to, speed) {
		//Figure out the distance between the sprites
		let vx = (to.x) - (follower.x),
				vy = (to.y) - (follower.y),
				distance = Math.sqrt(vx * vx + vy * vy);

		//Move the follower if it's more than 1 move
		//away from the leader
		if (distance >= speed) {
			follower.x += (vx / distance) * speed;
			follower.y += (vy / distance) * speed;
		}
		if( distance - speed <= 1 ) {
			return true;
		}

		return false;
	}

	/*
	angle
	-----

	Return the angle in Radians between two sprites.
	Parameters: 
	a. A sprite object.
	b. A sprite object.
	You can use it to make a sprite rotate towards another sprite like this:

			box.rotation = gu.angle(box, pointer);

	*/

	static angle(s1, s2) {
		return Math.atan2(
			//This is the code you need if you don't want to compensate
			//for a possible shift in the sprites' x/y anchor points
			/*
			(s2.y + s2.height / 2) - (s1.y + s1.height / 2),
			(s2.x + s2.width / 2) - (s1.x + s1.width / 2)
			*/
			//This code adapts to a shifted anchor point
			(s2.y + this._getCenter(s2, s2.height, "y")) - (s1.y + this._getCenter(s1, s1.height, "y")),
			(s2.x + this._getCenter(s2, s2.width, "x")) - (s1.x + this._getCenter(s1, s1.width, "x"))
		);
	}

	static getAngle (s1, s2) {
		return Math.atan2(
			//This is the code you need if you don't want to compensate
			//for a possible shift in the sprites' x/y anchor points
			/*
			(s2.y + s2.height / 2) - (s1.y + s1.height / 2),
			(s2.x + s2.width / 2) - (s1.x + s1.width / 2)
			*/
			//This code adapts to a shifted anchor point
			(s2.y) - (s1.y + this._getCenter(s1, s1.height, "y")),
			(s2.x) - (s1.x + this._getCenter(s1, s1.width, "x"))
		);
	}

	static getPointAngle (p1, p2) { return Math.atan2((p2.y - p1.y), (p2.x - p1.x)); }

	/*
	_getCenter
	----------

	A utility that finds the center point of the sprite. If it's anchor point is the
	sprite's top left corner, then the center is calculated from that point.
	If the anchor point has been shifted, then the anchor x/y point is used as the sprite's center
	*/

	static _getCenter(o, dimension, axis) {
		if (o.anchor !== undefined) {
			if (o.anchor[axis] !== 0) {
				return 0;
			} else {
				//console.log(o.anchor[axis])
				return dimension / 2;
			}
		} 
		else if (o.pivot !== undefined) {
			if (o.pivot[axis] !== 0) {
				return o.pivot[axis];
			} else {
				return dimension / 2;
			}
		} 
		else {
			return dimension / 2;
		}
	}
	

	/*
	rotateAroundSprite
	------------
	Make a sprite rotate around another sprite.
	Parameters:
	a. The sprite you want to rotate.
	b. The sprite around which you want to rotate the first sprite.
	c. The distance, in pixels, that the roating sprite should be offset from the center.
	d. The angle of rotations, in radians.

		 gu.rotateAroundSprite(orbitingSprite, centerSprite, 50, angleInRadians);

	Use it inside a game loop, and make sure you update the angle value (the 4th argument) each frame.
	*/

	static rotateAroundSprite(rotatingSprite, centerSprite, distance, angle) {
		rotatingSprite.x
			= (centerSprite.x + this._getCenter(centerSprite, centerSprite.width, "x")) - rotatingSprite.parent.x
			+ (distance * Math.cos(angle))
			- this._getCenter(rotatingSprite, rotatingSprite.width, "x");

		rotatingSprite.y
			= (centerSprite.y + this._getCenter(centerSprite, centerSprite.height, "y")) - rotatingSprite.parent.y
			+ (distance * Math.sin(angle))
			- this._getCenter(rotatingSprite, rotatingSprite.height, "y");
	}

	/*
	rotateAroundPoint
	-----------------
	Make a point rotate around another point.
	Parameters:
	a. The point you want to rotate.
	b. The point around which you want to rotate the first point.
	c. The distance, in pixels, that the roating sprite should be offset from the center.
	d. The angle of rotations, in radians.

		 gu.rotateAroundPoint(orbitingPoint, centerPoint, 50, angleInRadians);

	Use it inside a game loop, and make sure you update the angle value (the 4th argument) each frame.

	*/

	static rotateAroundPoint(pointX, pointY, distanceX, distanceY, angle) {
		let point = {};
		point.x = pointX + Math.cos(angle) * distanceX;
		point.y = pointY + Math.sin(angle) * distanceY;
		return point;
	}



	static randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
	static randomFloat(min, max) { return min + Math.random() * (max - min); }
	/*
	Move
	----

	Move a sprite by adding it's velocity to it's position. The sprite 
	must have `vx` and `vy` values for this to work. You can supply a
	single sprite, or a list of sprites, separated by commas.

			gu.move(sprite);
	*/

	static move(...sprites) {

		//Move sprites that's aren't in an array
		if (!(sprites[0] instanceof Array)) {
			if (sprites.length > 1) {
				sprites.forEach(sprite  => {
					sprite.x += sprite.vx;
					sprite.y += sprite.vy;
				});
			} else {
				sprites[0].x += sprites[0].vx;
				sprites[0].y += sprites[0].vy;
			}
		}

		//Move sprites in an array of sprites
		else {
			let spritesArray = sprites[0];
			if (spritesArray.length > 0) {
				for (let i = spritesArray.length - 1; i >= 0; i--) {
					let sprite = spritesArray[i];
					sprite.x += sprite.vx;
					sprite.y += sprite.vy;
				}
			}
		}
	}


	/*
	World camera
	------------

	The `worldCamera` method returns a `camera` object
	with `x` and `y` properties. It has
	two useful methods: `centerOver`, to center the camera over
	a sprite, and `follow` to make it follow a sprite.
	`worldCamera` arguments: worldObject, theCanvas
	The worldObject needs to have a `width` and `height` property.
	*/

	static worldCamera(world, worldWidth, worldHeight, canvas) {

		//Define a `camera` object with helpful properties
		let camera = {
			width: canvas.width,
			height: canvas.height,
			_x: 0,
			_y: 0,

			//`x` and `y` getters/setters
			//When you change the camera's position,
			//they shift the position of the world in the opposite direction
			get x() {
				return this._x;
			},
			set x(value) {
				this._x = value;
				world.x = -this._x;
				//world._previousX = world.x;
			},
			get y() {
				return this._y;
			},
			set y(value) {
				this._y = value;
				world.y = -this._y;
				//world._previousY = world.y;
			},

			//The center x and y position of the camera
			get centerX() {
				return this.x + (this.width / 2);
			},
			get centerY() {
				return this.y + (this.height / 2);
			},

			//Boundary properties that define a rectangular area, half the size
			//of the game screen. If the sprite that the camera is following
			//is inide this area, the camera won't scroll. If the sprite
			//crosses this boundary, the `follow` function ahead will change
			//the camera's x and y position to scroll the game world
			get rightInnerBoundary() {
				return this.x + (this.width / 2) + (this.width / 4);
			},
			get leftInnerBoundary() {
				return this.x + (this.width / 2) - (this.width / 4);
			},
			get topInnerBoundary() {
				return this.y + (this.height / 2) - (this.height / 4);
			},
			get bottomInnerBoundary() {
				return this.y + (this.height / 2) + (this.height / 4);
			},

			//The code next defines two camera 
			//methods: `follow` and `centerOver`

			//Use the `follow` method to make the camera follow a sprite
			follow: function(sprite) {

				//Check the sprites position in relation to the inner
				//boundary. Move the camera to follow the sprite if the sprite 
				//strays outside the boundary
				if(sprite.x < this.leftInnerBoundary) {
					this.x = sprite.x - (this.width / 4);
				}
				if(sprite.y < this.topInnerBoundary) {
					this.y = sprite.y - (this.height / 4);
				}
				if(sprite.x + sprite.width > this.rightInnerBoundary) {
					this.x = sprite.x + sprite.width - (this.width / 4 * 3);
				}
				if(sprite.y + sprite.height > this.bottomInnerBoundary) {
					this.y = sprite.y + sprite.height - (this.height / 4 * 3);
				}

				//If the camera reaches the edge of the map, stop it from moving
				if(this.x < 0) {
					this.x = 0;
				}
				if(this.y < 0) {
					this.y = 0;
				}
				if(this.x + this.width > worldWidth) {
					this.x = worldWidth - this.width;
				}
				if(this.y + this.height > worldHeight) {
					this.y = worldHeight - this.height;
				}
			},

			//Use the `centerOver` method to center the camera over a sprite
			centerOver: function(sprite) {

				//Center the camera over a sprite
				this.x = (sprite.x + sprite.halfWidth) - (this.width / 2);
				this.y = (sprite.y + sprite.halfHeight) - (this.height / 2);
			}
		};
		
		//Return the `camera` object 
		return camera;
	}

	static unique () {
		return `f${(~~(Math.random()*1e8)).toString(16)}`;
	}

	static range (size = 1, start = 0) {
		return [...Array(size).keys()].map(i => i + start);
	}

	static getKeyByValue (object, value) {
		return Object.keys(object).find(key => object[key] === value);
	}

	/**
	 * Make from flat array new array of coordinate objects
	 * Each letters in dimensions is a one dimension. 'xy' represents 2d, 'xyz' represents 3d coordinates
	 * Possible to use to convert flat matrix arrays, use 'abcdefxyw' for 2d matrix for example
	 * 
	 * @use let coords = Utils.flatToCoords([0,0, 10,10, ...]);// [{x:0,y:0}, {x:10,y:10}, ...];
	 * @use let coords = Utils.flatToCoords([0,0,0, 10,10,10, ...], 'xyz');// [{x:0,y:0,z:0}, {x:10,y:10,z:10}, ...];
	 * 
	 * @param  {Array}  flatCoords - coordinates in flat view. Vertices for example
	 * @param  {String} dimensions - Describes used axis of element of new array. 'xy' by default
	 * @return {Array}            [description]
	 */
	static flatToCoords (flatCoords = [], dims = 'xy') {
		return flatCoords.reduce( (ac, v, i, ar) => {
			if( i%dims.length == 0 ) {
				ac.push(Array.from(dims).reduce((c,d,j) => {return Object.assign(c,{[d]:ar[i+j]})},{}));
			}
			return ac
		}, []);
	}
	//TODO: Make this alias as main function in code
	static atoc (flatCoords = [], dims = 'xy') {
		return flatCoords.reduce( (ac, v, i, ar) => {
			if( i%dims.length == 0 ) {
				ac.push(Array.from(dims).reduce((c,d,j) => {return Object.assign(c,{[d]:ar[i+j]})},{}));
			}
			return ac
		}, []);
	}

	static perfTest (name = 'perfTest', times = 1, code = () => {}, showIterations = false) {
		if( typeof code != 'function' ) return false;

		let test = {n:times,name:name};
		performance.mark(test.name);
		Utils.range(test.n).forEach((iteration) => {
			if( showIterations ) console.log(`${test.name} #${iteration+1}`);
			code(iteration);
		});
		performance.measure(`${test.name} measure`, test.name);
		test.result = performance.getEntriesByName(`${test.name} measure`)[0];
		return test;
	}

	static sumPerf (name) {
		return performance.getEntriesByName(name).reduce((a,v) => {return a + v.duration}, 0);
	}

	static avgPerf (name) {
		let perf = performance.getEntriesByName(name);
		return perf.reduce((a,v) => {return a + v.duration}, 0)/perf.length;
	}

}
