 
import * as PyramideCommands from './command/PyramideCommands';
import Deck from './Deck';
import Dealer from './Dealer';
import Field from './Field';
import Scoreboard from './Scoreboard';
import DropZone from './DropZone';
import Row from './Row';
import RowCell from './RowCell';
import CommandPool from './command/CommandPool';

/**
 * Describe logic of Pyramide solitaire
 */
export default class Pyramide {
	constructor(scene) {
		this.scene = scene;
		this.app = scene.app;
		this.game = this.app.game;
		
		this.cardRegistry = scene.cards;
		this.deck = new Deck();
		this.field = new Field();
		this.dealer = new Dealer();
		this.scoreboard = new Scoreboard();
		this.drop = new DropZone();

		this.maxRewinds = 2;
		this.currentRewind = 0;

		this.trash = [];
		this.pool = new CommandPool();
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

		// this.field.rows = [];
		this.dealer.deck.clear();
		this.dealer.slot.clear();
		this.currentRewind = 0;
		this.drop.cards.clear();
		this.trash = [];
		this.field.rows.forEach( row => {
			row.cells.forEach( cell => cell.card = tmpDeck.shift() );
		});
		while( tmpDeck.length ) this.dealer.deck.push(tmpDeck.shift());
	}

	action   (name, ...params) { return new PyramideCommands[`do${name}`](this, name, ...params); }
	unaction (name, ...params) { return new PyramideCommands[`undo${name}`](this, name, ...params); }

	doAction (name, ...params) {
		let com = this.pool.execute(this.action(name, ...params));
		this.trash.push(com);
	}

	undoAction () {
		if( !this.hasUndo() ) return false;
		let lastAction = this.trash.pop();

		let {name, params} = lastAction;
		let com = this.pool.execute(this.unaction(name, ...params));
	}

	hasUndo () { return ( this.trash.length > 0 ); }

	dropCard(card) {
		// Remove card from field
		if( card.from() == 'field' ) {
			this.field.getCell(card.attrs.row, card.attrs.index).removeCard();
		}
		// Or remove card from slot
		else
			this.dealer.slot.pop();
		// Add card to drop
		this.drop.cards.push(card);
		this.scoreboard.scores += card.score;
	}

	undropCard(card) {
		if( card.from() == 'slot' ) {
			this.dealer.slot.push(card);
		}
		else {
			this.field.getCell(card.attrs.row, card.attrs.index).card = card;
		}
		this.scoreboard.scores -= card.score;
	}

	isFieldDeckEmpty () {
		let emptyCardCnt = 0;
		this.field.rows.forEach( row => {
			row.cells.forEach( cell => { if( !cell.card ) emptyCardCnt++; });
		});
		return ( emptyCardCnt === 28 );
	}

	fitCard (card) {

		let result = undefined;

		// Check this card is opened
		if( !this.isCardOpened(card) )
				return result;

		// Search fittest card from field
		// Check every row from behind
		for( let row = 6;row >= 0; row--) {
			// Already founded - exit
			if( result !== undefined ) break;
			// Do not search on empty row
			if( this.field.getRow(row).empty() ) continue;

			for( let cell of this.field.rows[row].cells ) {
				// Already founded - exit
				if( result !== undefined ) break;
				// Not search in dropped
				if( cell.card === undefined ) continue;
				// Do not fit card itself
				if( card.attrs.row !== undefined && card.attrs.row === cell.row && card.attrs.index === cell.index ) continue;

				// Is this card ok?
				if( (card.score + cell.card.score) === 13 ) {
					// Check if card opened
					if( !this.isCardOpened(cell.card) ) continue;
					// console.log('Found fittest card', row, i);
					result = cell.card;
					break;
				}				
			}
		}

		// If fit card in field not found - search in slot
		if( !result && card.from() === 'field' && this.dealer.slot.length ) {
			let slotCard = this.dealer.slot[this.dealer.slot.length-1];
			if( (slotCard.score + card.score) === 13 ) {
				result = slotCard;
				// console.log('Found fittest card in slot');
			}
		}

		return result;
	}

	isCardOpened (card) {
		let from = card.from(), row = card.attrs.row, index = card.attrs.index;
		// Slot card always opened
		if( from === 'slot' ) return true;

		// Check for next row neighbours (with current index and index+1)
		if( from === 'field' ) {
			if( row == this.field.rows.length-1 ) return true;// Card from last row always opened
			let nextRow = this.field.getRow(row+1);
			let leftNeighbourCard  = nextRow.getCell(index).card;
			let rightNeighbourCard = nextRow.getCell(index+1).card;
			let hasNextRowNeighbours = ( leftNeighbourCard || rightNeighbourCard );
			// console.log('Card ' + (hasNextRowNeighbours?'NOT':'is') + ' opened');
			return !hasNextRowNeighbours;
		}
	}
}
