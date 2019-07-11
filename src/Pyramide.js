 
import * as PyramideCommands from './command/PyramideCommands';
import { Game as GameSettings } from './Settings';
import Card from './Card';
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
		
		this.cards = scene.cards;
		this.deck = new Deck();
		this.field = new Field();
		this.dealer = new Dealer();
		this.scoreboard = new Scoreboard();
		this.drop = new DropZone();
		this.pool = new CommandPool();

		this.maxRewinds = GameSettings.maxRewind;
		this.currentRewind = 0;
	}

	initDecks(savedDeck = undefined) {
		// Reset
		this.cards.clear();
		this.dealer.deck.clear();
		this.dealer.slot.clear();
		this.drop.cards.clear();
		this.pool.clear();
		this.pool.trash.clear();
		this.currentRewind = 0;
		// get card deck, new random, or predefined from saveDeck
		let tmpDeck = this.deck.getCards(savedDeck);
		// save it to storage
		this.game.saveRound({deck:this.deck.getCardsNamesArray(tmpDeck)});
		tmpDeck.forEach( card => {
			card.initLogic(this);
			this.cards.add(card);
		});
		this.field.rows.forEach( row => {
			row.cells.forEach( cell => cell.card = tmpDeck.shift() );
		});
		while( tmpDeck.length ) this.dealer.deck.add(tmpDeck.shift());
	}

	action   (name, ...params) { 
		return new PyramideCommands[`do${name}`](this, name, PyramideCommands[`undo${name}`], ...params); 
	}
	unaction (name, ...params) { 
		return new PyramideCommands[`undo${name}`](this, name, ...params); 
	}

	doAction (name, ...params) {
		this.pool.add(this.action(name, ...params));
	}

	undoAction () {
		if( !this.hasUndo() ) return false;
		let {name, params} = this.pool.trash.pop();
		this.pool.add(this.unaction(name, ...params));
	}

	hasUndo () { return this.pool.hasUndo(); }

	dropCard(card) {
		// Remove card from field
		if( card.from == 'field' ) {
			this.field.getCell(card.row, card.index).removeCard();
		}
		// Or remove card from slot
		else
			this.dealer.slot.pop();
		// Add card to drop
		this.drop.cards.add(card);
		this.scoreboard.scores += card.score;
	}

	undropCard(card) {
		if( card.from == 'field' ) {
			this.field.getCell(card.row, card.index).card = card;
		}
		else {
			this.dealer.slot.add(card);
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
		// Fit by rank
		let fitRank = Card.getRankByScore(13 - card.score);
		// Search all possible suits of fit rank - max 4 iterations
		for( let fitSuit in Card.suitmap ) {
			let fitCard = this.cards.get(`${fitSuit}${fitRank}`);
			if( fitCard.isOpened ) return fitCard;// If first possible card opened - we can return
			//TODO: improve, must return all possible fit cards, not only first
		}
		return false;
	}

	isCardOpened (card) {
		// console.log(`isCardOpened`, card.name, card.where, card.row, card.index);
		// Slot card always opened if on top of stack
		if( card.where == 'slot' ) {
			let cardIndex = this.dealer.slot.findIndex( slotCard => {return slotCard.name == card.name});
			return ( cardIndex == this.dealer.slot.length-1 );
		}
		// Check for next row neighbours (with current index and index+1)
		if( card.where == 'field' ) {
			if( card.row == this.field.rows.length-1 ) return true;// Card from last row always opened
			let nextRow = this.field.getRow(card.row+1);
			let leftNeighbourCard  = nextRow.getCell(card.index).card;
			let rightNeighbourCard = nextRow.getCell(card.index+1).card;
			let hasNextRowNeighbours = ( leftNeighbourCard || rightNeighbourCard );
			// console.log('Card ' + (hasNextRowNeighbours?'NOT':'is') + ' opened');
			return !hasNextRowNeighbours;
		}
		return false;
	}
}
