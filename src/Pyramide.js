 
 import * as PyramideCommands from './command/PyramideCommands';

/**
 * Describe logic of Pyramide solitaire
 */
export default class Pyramide {
	constructor(scene) {
		this.scene = scene;
		this.app = scene.app;
		this.game = this.app.game;
		
		this.deck = scene.deck;
		this.cardRegistry = scene.cards;

		this.field = [];
		this.dealer = [];
		this.slot = [];
		this.maxRewinds = 2;
		this.currentRewind = 0;

		this.drop = [];
		this.dropStack = [];
		this.trash = [];
		this.pool = [];

		this.scores = 0;
		// console.log(this.deck);
	}

	initDecks(savedDeck = undefined) {
		// get card deck, new random, or predefined from saveDeck
		let tmpDeck = this.deck.getCards(savedDeck);
		// save it to storage
		this.game.saveRound({deck:this.deck.getCardsNamesArray(tmpDeck)});
		// Reset cardRegistry
		this.cardRegistry.clear();
		for( let card of tmpDeck ) 
			this.cardRegistry.add(card);

		this.field = [];
		this.dealer = [];
		this.slot = [];
		this.currentRewind = 0;
		this.drop = [];
		this.dropStack = [];
		this.trash = [];
		this.scores = 0;

		let row = 0;
		for (let i = 0; i < 28; i++) {
			if (this.field[row] === undefined) this.field[row] = [];

			let card = tmpDeck.shift();
			this.field[row].push(card);

			if (this.field[row].length >= row + 1) row++;
		}

		while( tmpDeck.length ) this.dealer.push(tmpDeck.shift());

		// console.log(this.field, this.dealer);
	}

	action (name, ...params) { return new PyramideCommands[name](this, name, ...params); }

	doAction (action, ...params) {
		let actionMethod = `do${action}`;
		let com = this.pool.execute(this.action(actionMethod, ...params));
		// this.gui.updateUndoButton();
		this.trash.push(com);
	}

	undoAction () {
		if( !this.hasUndo() ) return false;
		let lastAction = this.trash.pop();

		let {name, params} = lastAction;
		let actionMethod = `undo${action}`;
		this[actionMethod](...params);
		// this.gui.updateUndoButton();
	}

	hasUndo () { return ( this.trash.length > 0 ); }

	dropCard(card, from) {
		// Remove card from field
		if( from.where === 'field' )
			this.field[from.row][from.index] = undefined;
		// Or remove card from slot
		else if( from.where === 'slot' )
			this.slot.pop();
		// Add card to drop
		this.drop.push({card: card, from: from});
		this.scores += card.score;
		this.gui.updateScoreboard();
	}

	undropCard(card, from) {
		if( from.where === 'slot' ) {
			this.slot.push(card);
			this.gui.showLastCardInSlot();
		}
		else if (from.where === 'field' ) {
			this.field[from.row][from.index] = card;
			this.gui.showCardInField(card, from);
		}

		this.scores -= card.score;
		this.gui.updateScoreboard();
	}

	isFieldDeckEmpty () {
		let emptyCardCnt = 0;
		for (let row = 0; row < this.field.length; row++) {
			for (let card of this.field[row]) {
				if (card === undefined)
					emptyCardCnt++;
			}
		}

		return ( emptyCardCnt === 28 );
	}

	fitCard (card, from) {

		let result = {
			card: undefined,
			from: undefined,
		};

		// Check this card is opened
		if( !this.isCardOpened(from) )
				return result;

		// Search fittest card from field
		// Check every row from behind
		for( let row = 6;row >= 0; row--) {
			// Already founded - exit
			if( result.card !== undefined )
				break;

			// Do not search on empty row
			if( this.field[row] === [] )
				continue;

			this.field[row].forEach( (curCard, i) => {
				// Already founded - exit
				if( result.card !== undefined )
					return;
				// Not search in dropped
				if( curCard === undefined )
					return;
				// Do not fit card itself
				if( from.row !== undefined && from.row === row && from.index === i )
					return;

				// Is this card ok?
				if( (card.score + curCard.score) === 13 ) {
					// Check if card opened
					if( !this.isCardOpened({where:'field', row, index: i}) )
						return;

					// console.log('Found fittest card', row, i);
					result.card = curCard;
					result.from = {where: 'field', row, index: i};
				}
			});
		}

		// If fit card in field not found - search in slot
		if( from.where === 'field' && result.card === undefined ) {
			// get card from slot for checking
			let slotCard = this.slot.pop();
			if( (slotCard !== undefined) && ( (slotCard.score + card.score) === 13 ) ) {
				result.card = slotCard;
				result.from = {where: 'slot'};
				// console.log('Found fittest card in slot');
			}
			// Return card to slot after checking
			this.slot.push(slotCard);
		}

		return result;
	}

	isCardOpened (from) {
		// console.log('isCardOpened', from);
		// Slot card always opened
		if( from.where === 'slot' ) {
			// console.log('Slot card is opened');
			return true;
		}

		// Check for next row neighbours (with current index and index+1)
		if( from.where === 'field' ) {
			let hasNextRowNeighbours = (
				(this.field[from.row+1] !== undefined && this.field[from.row+1][from.index] !== undefined)
				||
				(this.field[from.row+1] !== undefined && this.field[from.row+1][from.index+1] !== undefined)
			);

			// console.log('Card ' + (hasNextRowNeighbours?'NOT':'is') + ' opened');

			return !hasNextRowNeighbours;
		}
	}

}