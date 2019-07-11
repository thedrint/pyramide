
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

export class FollowTo extends Command {
	run () {
		let [enemy] = this.params;
		let result = this.rec.followTo(enemy);
		if( this.rec.sensor.isEnemyNear(enemy) ) 
			this.ended();
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
