
import * as TWEEN from 'es6-tween';
import Command from './Command';
import Utils from './../Utils';

export class doGetCardFromDealerDeck extends Command {
	run () {
		let logic = this.rec;
		let {scene:gui, dealer} = logic;
		// If dealer deck not empty - move card to slot
		if( dealer.deck.length ) {
			let newCard = dealer.deck.pop();
			dealer.slot.add(newCard);
			gui.animations.add(gui.animation('AnimationToSlot', newCard.model, 200))
			this.ended(); return true;
		}
		if( logic.currentRewind > logic.maxRewinds-1 ) {
			gui.showModal(logic.game.i18n.t('You cannot rewind anymore!'));
			this.ended(); return false;
		}
		// Set all cards from Dslot to Ddeck
		//TODO: Animation for rewind
		while( dealer.slot.length ) {
			let card = dealer.slot.pop();
			card.model.showShirt();
			dealer.deck.add(card);
			dealer.model.Deck.addChild(card.model);
		}
		logic.currentRewind++;
		this.ended(); return true;
	}
}

export class undoGetCardFromDealerDeck extends Command {
	run () {
		let logic = this.rec;
		let {scene:gui, dealer} = logic;
		if( dealer.slot.length ) {
			let lastSlotCard = dealer.slot.pop();
			dealer.deck.add(lastSlotCard);
			gui.animations.add(gui.animation('AnimationToDeck', lastSlotCard.model, 200))
			this.ended(); return true;
		}
		// Slot empty, check if dealer deck was rewinded
		// DDeck is not rewinded yet
		if( logic.currentRewind === 0 ) { this.ended(); return true; }
		// DDeck was rewinded, undo this
		//TODO: Animation for this
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

export class doDropCards extends Command {
	run () {
		let logic = this.rec;
		let {scene:gui, dealer, drop, field, scoreboard, game} = logic;
		let arrayOfCards = this.params;
		for( let card of arrayOfCards ) {
			if( card.from == 'field' ) field.getCell(card.row, card.index).removeCard();
			else dealer.slot.pop();
			drop.cards.add(card);
			gui.scoreboard.scores += card.score;
			gui.animations.add(gui.animation('AnimationDrop', card.model, 300))
		}
		// Check game win
		//TODO: Win animation
		if( logic.isFieldDeckEmpty() ) gui.showModal(game.i18n.t('You win a game!', {scores: scoreboard.scores}));
		this.ended(); return true;
	}
}

export class undoDropCards extends Command {
	run () {
		let logic = this.rec;
		if( !logic.drop.cards.length ) { this.failed(); return false; }
		let {scene:gui, dealer, drop, field} = logic;
		let cards = this.params;
		// Remove cards from drop
		let indexes = [];
		for( let droppedCard of cards ) {
			let index = drop.cards.findIndex(card => { return (card.name == droppedCard.name) });
			let card = drop.cards.delete(index);
			if( card.from == 'field' ) field.getCell(card.row, card.index).card = card;
			else dealer.slot.add(card);
			gui.scoreboard.scores -= card.score;
			gui.animations.add(gui.animation('AnimationUnDrop', card.model, 300));
		}
		this.ended(); return true;
	}
}
