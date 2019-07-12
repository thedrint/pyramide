
import * as TWEEN from 'es6-tween';
import Command from './Command';
import Utils from './../Utils';

export class AnimationMove extends Command {
	constructor (scene, name, obj, target, duration = 1000) {
		super(scene, name, obj, target, duration);
		this.obj = obj;
		this.target = target;
		this.duration = duration;
		this.scene = this.rec;
		this.moving = undefined;
		this.start = Utils.toGlobal(this.obj);
		this.end = Utils.toGlobal(this.target);
		// console.log(`AnimationMove`, this.start, this.end);
	}
	run () {
		if( this.moving ) return;
		this.scene.addChild(this.obj);
		this.obj.x = this.start.x;
		this.obj.y = this.start.y;
		this.moving = new TWEEN.Tween(this.start).to(this.end, this.duration)
			.easing(TWEEN.Easing.Linear.None)
			.on('update', (pos) => {
				this.obj.x = pos.x;
				this.obj.y = pos.y;
			})
			.on('complete', () => {
				// console.log('Moving complete');
				TWEEN.remove(this.moving);
				this.moving = undefined;
				this.ended();
			})
			.start();
		return this.moving;
	}
}

export class AnimationToSlot extends AnimationMove {
	constructor (scene, name, card, duration = 1000) {
		let target = scene.dealer.model.Slot;
		super(scene, name, card, target, duration);
		this.card = card;
	}
	post () {
		this.target.addChild(this.card);
		this.card.showFace();
		this.card.x = 0;
		this.card.y = 0;
	}
}
export class AnimationToDeck extends AnimationMove {
	constructor (scene, name, card, duration = 1000) {
		let target = scene.dealer.model.Deck;
		super(scene, name, card, target, duration);
		this.card = card;
	}
	post () {
		this.target.addChild(this.card);
		this.card.showShirt();
		this.card.x = 0;
		this.card.y = 0;
	}
}

export class AnimationDrop extends AnimationMove {
	constructor (scene, name, card, duration = 1000) {
		let drop = scene.drop.model;
		super(scene, name, card, drop, duration);
		this.card = card;
		this.drop = drop;
	}
	post () {
		this.drop.addChild(this.card);
		this.card.x = 0;
		this.card.y = 0;
	}
}
export class AnimationUnDrop extends AnimationMove {
	constructor (scene, name, card, duration = 1000) {
		let target;
		if( card.logic.from == 'field' ) target = scene.field.getCell(card.logic.row, card.logic.index).model;
		else target = scene.dealer.model.Slot;
		super(scene, name, card, target, duration);
		this.card = card;
	}
	post () {
		this.target.addChild(this.card);
		this.card.x = 0;
		this.card.y = 0;
	}
}
