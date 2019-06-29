
import * as PIXI from 'pixi.js';
import IntersectHelper from './IntersectHelper';
import Vector from './base/Vector';

import { Unit as UnitSettings, Defaults, FPS } from './Settings';

import Utils from './Utils';

import Container from './base/Container';

import Scene from './Scene';
import Body from './models/Body';
import Helmet from './models/Helmet';
import Weapon from './models/Weapon';
import Shield from './models/Shield';

import Test from './Test';

export default class Unit extends Container {

	constructor (settings = Defaults.unit) {

		super();

		let { 
			name      = Defaults.unit.name, 
			spec      = Defaults.unit.spec, 
			attrs     = Defaults.unit.attrs, 
			skills    = Defaults.unit.skills, 
			equipment = Defaults.unit.equipment,
			model     = Defaults.unit.model, 
		} = settings;
		this.name = name;
		this.spec = spec;
		this.division = undefined;
		this.party = undefined;

		this.init();

		this.initAttrs(attrs);
		this.initSkills(skills);
		this.initEquipment(equipment);
		this.initModel(model);
	}

	init () {
		this._righthand = undefined;
		this._lefthand  = undefined;
	}

	initAttrs (attrs = Defaults.unit.attrs) {
		this.attrs = Utils.cleanOptionsObject(attrs, Defaults.unit.attrs);

		if( this.attrs.hp == undefined ) 
			this.attrs.hp = this.getFullHp();
		if( this.attrs.mp == undefined ) 
			this.attrs.mp = this.getFullMp();
	}

	initSkills (skills = Defaults.unit.skills) {
		this.skills = Utils.cleanOptionsObject(skills, Defaults.unit.skills);
	}

	initEquipment (equipment = Defaults.unit.equipment) {
		this.equipment = Utils.cleanOptionsObject(equipment, Defaults.unit.equipment);
	}

	initModel (model = Defaults.unit.model) {
		let params = Utils.cleanOptionsObject(model, Defaults.unit.model);

		let radius = params.size/2;

		let models = [];
		let body = new Body({model:{color:params.colors.armor}});
		body.spawnPoint = new PIXI.Point(0,0);
		body.setTransform(body.spawnPoint.x, body.spawnPoint.y);
		models.push(body);

		let helmet = new Helmet({model:{color:params.colors.helmet}});
		helmet.spawnPoint = new PIXI.Point(0,0);
		helmet.setTransform(helmet.spawnPoint.x, helmet.spawnPoint.y);
		models.push(helmet);

		let weapon = new Weapon({model:{color:params.colors.weapon, texture: params.textures.weapon}});
		weapon.spawnPoint = new PIXI.Point(0,params.size/2);
		weapon.x = weapon.spawnPoint.x;
		weapon.y = weapon.spawnPoint.y;
		// weapon.setTransform(weapon.spawnPoint.x, weapon.spawnPoint.y);
		// weapon.angle = -10;
		this.rightHand = weapon;
		models.push(weapon);

		let bodyRadius = radius;
		let shieldAngle = 0;
		let shieldDot = {
			x: bodyRadius*Math.sin(shieldAngle),
			y: -bodyRadius*Math.cos(shieldAngle),
		}
		let shield = new Shield({model:{color:params.colors.shield, texture: params.textures.shield}});
		shield.spawnPoint = new PIXI.Point(shieldDot.x,shieldDot.y);
		shield.x = shield.spawnPoint.x;
		shield.y = shield.spawnPoint.y;
		// shield.setTransform(shield.spawnPoint.x, shield.spawnPoint.y);
		shield.angle = shieldAngle;
		this.leftHand = shield;
		models.push(shield);

		this.addChild(...models);

		this.pivot.x += params.size/2;
		this.pivot.y += params.size/2;

		this.shape = new IntersectHelper.Rectangle(this);
	}

	get rightHand () { return this._righthand; }
	set rightHand (item) { this._righthand = item; }
	get leftHand () { return this._lefthand; }
	set leftHand (item) { this._lefthand = item; }

	isReady () { return this.ready; }

	get Body   () { return this.getChildByName('Body'); }
	get Helmet () { return this.getChildByName('Helmet'); }
	get Weapon () { return this.getChildByName('Weapon'); }
	get Shield () { return this.getChildByName('Shield'); }

	hitHp (target) {
		if( target.attrs.immortal ) return;

		let damage = this.calcHpDamage() - this.calcHpDefend();
		target.attrs.hp -= damage;
		// console.log(`${this.name} hitted ${target.name} with ${damage} damage`);
		if( target.isDied() ) {
			//TODO: Event - Target unit dies
			// console.log(`${target.name} killed!`);
		}
	}

	getFullHp () {
		let fullHp = this.attrs.lvl * 10;
		return fullHp;
	}

	isDied () { return this.attrs.hp <= 0; }

	die () {
		this.emit('die');
		this.destroy();
	}

	getFullMp () {
		let fullMp = this.attrs.lvl * 10;
		return fullMp;
	}

	calcHpDamage () {
		//TODO: Make formula better
		let damage = this.attrs.attack;
		return damage;
	}

	calcHpDefend () {
		//TODO: Make formula better
		let defend = this.attrs.defend;
		return defend;
	}

	getSpeed () {
		let baseSpeed = this.attrs.speed*UnitSettings.size;
		let speedMod = baseSpeed*this.skills.agility/10;
		return baseSpeed + speedMod;
	}

	getWeaponSpeed () {
		let baseSpeed = (this.skills.agility+1)/10/2;
		return baseSpeed;
	}

	getWeaponTargetAngle (target) {
		// Distance between unit center and weapon hand
		let distanceToHand = new Vector().copyFrom(this.Weapon.spawnPoint).length;
		// Vector that looks at target's center (in unit local)
		let vecTarget = new Vector().copyFrom(this.toLocal(target));
		// Vector that looks at target point - this point in mirror of unit's weapon
		let vecDestination = vecTarget.clone().rotate(-Math.PI/2);
		vecDestination.length = distanceToHand;
		// This is new point in unit local where unit must look, if he want to pierce target's center
		vecTarget.add(vecDestination);
		let targetPoint = this.toGlobal(vecTarget);
		// Now we can get angle
		return Utils.getPointAngle(this, targetPoint);
	}

	// @deprecated - for compatibility only
	getClosest       () { return this.sensor.getClosest(); }
	getClosestEnemy  () { return this.sensor.getClosestEnemy(); }
	getClosestFriend () { return this.sensor.getClosestFriend(); }

	followTo (target, speedInPixels = undefined) {
		if( !speedInPixels )
			speedInPixels = this.getSpeed()/FPS.target;
		return super.followTo(target, speedInPixels);
	}

	backwardStep (from, speed = undefined) {
		// If enemy too far but friend in close range - make step backward from friend to get more space for moves
		if( !speed )
			speed = this.getSpeed()/FPS.target;
		let backwardPosition = new PIXI.Point(
			this.x - Math.sign(from.x-this.x)*speed, 
			this.y - Math.sign(from.y-this.y)*speed, 
		);
		return this.followTo(backwardPosition, speed);
	}

	/**
	 * Returns "world center" of unit (in fact center of his body for simplify)
	 * @return PIXI.Point {x, y}
	 */
	getCenter () { return IntersectHelper.getShapeCenter(this.Body); }

	getLOS (target, color = Colors.black, size = 1) {
		let los = this.sensor.getLOS(target);
		let line = Scene.createLine(los.start, los.end, color, size);
		line.target = target;
		return line;
	}

	/**
	 * Creates moving graph, calculate path from current position to target and returns array of path points
	 * @param  {Container|PIXI.Container} target Any object has coordinates properties (x and y)
	 * @return {Array}        [description]
	 */
	getPathTo (target) {
		this.scene.getMap();// init scene.map object if not inited before
		this.scene.map.calculatePath(this, target);
		// Test.showMeasures();
		return this.scene.map.getPathNodes();
	}

}