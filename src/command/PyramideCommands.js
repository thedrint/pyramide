
import * as TWEEN from 'es6-tween';
import Command from './Command';
import Utils from './../Utils';

export class doGetCardFromDealerDeck extends Command {
	run () {
		let logic = this.rec;
		let {scene:gui, dealer} = logic;
		// If Ddeck not empty
		if( dealer.deck.length ) {
			// Get card from Ddeck
			let newCard = dealer.deck.pop();
			// And set it to Dslot
			dealer.slot.add(newCard);
			dealer.model.Slot.addChild(newCard.model);
			newCard.model.showFace();
			this.ended();
			return true;
		}
		else {
			if( logic.currentRewind > logic.maxRewinds-1 ) {
				gui.showModal(logic.game.i18n.t('You cannot rewind anymore!'));
				this.ended();
				return false;
			}
			// Set all cards from Dslot to Ddeck
			while( dealer.slot.length ) {
				let card = dealer.slot.pop();
				card.model.showShirt();
				dealer.deck.add(card);
				dealer.model.Deck.addChild(card.model);
			}
			logic.currentRewind++;
			// console.log(`You rewind dealer deck! You rewinded deck ${logic.currentRewind} times`);
			this.ended();
			return true;
		}
	}
}

export class undoGetCardFromDealerDeck extends Command {
	run () {
		let logic = this.rec;
		let {scene:gui, dealer} = logic;
		if( dealer.slot.length ) {
			let lastSlotCard = dealer.slot.pop();
			dealer.deck.add(lastSlotCard);
			dealer.model.Deck.addChild(lastSlotCard.model);
			lastSlotCard.model.showShirt();
			this.ended();
			return true;
		}
		// Slot empty, check if dealer deck was rewinded
		else {
			// DDeck is not rewinded yet
			if( logic.currentRewind === 0 ) {
				// console.log(`You unrewind deck to initial position`);
				this.ended();
				return false;
			}

			// DDeck was rewinded, undo this
			while( dealer.deck.length ) {
				let card = dealer.deck.pop();
				dealer.slot.add(card);
				dealer.model.Slot.addChild(card.model);
				card.model.showFace();
			}
			logic.currentRewind--;
			this.ended();
			return true;
		}
	}
}

export class doDropCards extends Command {
	run () {
		// console.log('doDropCards');
		let logic = this.rec;
		let {scene:gui} = logic;
		let arrayOfCards = this.params;
		for( let card of arrayOfCards ) {
			logic.dropCard(card);
			gui.drop.model.addChild(card.model);
		}

		// Check game win
		if( logic.isFieldDeckEmpty() ) {
			gui.showModal(logic.game.i18n.t('You win a game!', {scores: logic.scoreboard.scores}));
			//TODO: Win animation
		}
		this.ended();
		return true;
	}
}

export class undoDropCards extends Command {
	run () {
		let logic = this.rec;
		let {scene:gui} = logic;
		let cards = this.params;
		if( !logic.drop.cards.length ) {
			this.failed();
			return false;
		}
		// Remove cards from drop
		let indexes = [];
		for( let droppedCard of cards ) {
			let index = logic.drop.cards.findIndex(card => {
				return (card.row == droppedCard.row) && (card.index == droppedCard.index)
			});
			logic.drop.cards.splice(index,1);
		}

		for( let card of cards ) {
			logic.undropCard(card);
			if( card.from == 'field' )
				gui.field.getCell(card.row, card.index).model.addChild(card.model);
			else
				gui.dealer.model.Slot.addChild(card.model);
		}

		this.ended();
		return true;
	}
}

export class AnimationMove extends Command {
	constructor (receiver, name, undo = undefined, ...params) {
		super(receiver, name, undo, ...params);
		let [card, target, duration = 1000] = this.params;
		this.card = card;
		this.target = target;
		this.duration = duration;
		this.logic = this.rec;
		this.moving = undefined;
		this.start = this.card.model.toGlobal(this.card.model);
		this.end = this.target.model.toGlobal(this.target.model);
	}
	pre () { return !this.moving; }
	run () {
		let {scene:gui} = this.logic;
		gui.addChild(this.card.model);
		this.card.model.x = this.start.x;
		this.card.model.y = this.start.y;

		this.moving = new TWEEN.Tween(this.start).to(this.end, this.duration)
			.easing(TWEEN.Easing.Linear.None)
			.on('update', (pos) => {
				this.card.model.x = pos.x;
				this.card.model.y = pos.y;
			})
			.on('complete', () => {
				console.log('Moving complete');
				this.moving = false;
				this.target.model.addChild(this.card.model);
				this.ended();
			})
			.start();
		return this.moving;

		if( this.card.model.moveTo(this.target.model) ) this.ended();
		return result;
	}
}

export class ReturnToSpawnPoint extends Command {
	run () {
		let result = this.rec.followTo(this.rec.spawnPoint);
		if( Utils.distanceBetween(this.rec, this.rec.spawnPoint) <= 2 ) 
			this.ended();
		return result;
	}
}

export class GetPathTo extends Command {
	run () {
		let coords = this.rec.getPathTo(...this.params);
		this.rec.tactic.addCommand(this.rec.tactic.command(`FollowByPath`, coords));
		this.ended();
		return coords;
	}
}

export class WeaponPierce extends Command {
	run () {
		let [enemy] = this.params;
		this.rec.easeRotateTo(this.rec.getWeaponTargetAngle(enemy));
		let result = this.rec.Weapon.pierce(enemy);
		this.ended();// Yes, we can end this command bcoz Weapon.pierce use tween animation
		return result;
	}
}
