
import Command from './Command';
import Utils from './../Utils';

export class doGetCardFromDealer {
	run () {
		let {gui} = this;
		// If Ddeck not empty
		if (this.dealer.length) {
			// Get card from Ddeck
			let newCard = this.dealer.shift();
			// And set it to Dslot
			this.slot.push(newCard);
			gui.showLastCardInSlot();
			// Show empty Ddeck if no more cards there
			if( this.dealer.length === 0 ) {
				gui.showEmptyDealerDeck();
			}
		}
		else {
			if( this.currentRewind > this.maxRewinds-1 ) {
				this.gui.showModal(this.i18n.t('You cannot rewind anymore!'));
				return false;
			}
			// Set all cards from Dslot to Ddeck
			for( let card of this.slot ) {
				this.dealer.push(card);
			}
			// Clear slot;
			this.slot = [];
			gui.showEmptySlot();
			this.currentRewind++;
			// console.log('You rewind dealer deck!');
			gui.showDealerDeckShirt();
		}
	}
}

export class undoGetCardFromDealer {
	run () {
		let {gui} = this;
		let lastSlotCard = this.slot.pop();
		if( lastSlotCard ) {
			this.dealer.unshift(lastSlotCard);
			gui.showDealerDeckShirt();
			gui.showLastCardInSlot();
		}
		// Slot empty, check if dealer deck was rewinded
		else {
			// DDeck is not rewinded yet
			if( this.currentRewind === 0 ) {
				return false;
			}

			// DDeck was rewinded, undo this
			for( let card of this.dealer ) {
				this.slot.push(card);
			}

			this.dealer = [];
			gui.showEmptyDealerDeck();
			this.currentRewind--;
			gui.showLastCardInSlot();
		}
	}
}

export class doDropCards {
	run (arrayOfCards) {
		for( let CardInfo of arrayOfCards )
			this.dropCard(CardInfo.card, CardInfo.from);

		this.dropStack.push(arrayOfCards);

		// Check game win
		if( this.isFieldDeckEmpty() ) {
			this.gui.showModal(this.i18n.t('You win a game!', {count: this.scores}));
			//TODO: Win animation
		}
	}
}

export class undoDropCards {
	run () {
		// Get cards from stack
		let arrayOfCards = this.dropStack.pop();
		// Mo more cards in stack
		if( !arrayOfCards )
			return false;

		for( let CardInfo of arrayOfCards ) {
			// Get card from drop and return it to the place
			let {card, from} = CardInfo;
			this.undropCard(card, from);
		}
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
