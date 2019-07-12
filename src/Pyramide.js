 
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

	action   (name, ...params) { return new PyramideCommands[`do${name}`](this, name, ...params); }
	unaction (name, ...params) { return new PyramideCommands[`undo${name}`](this, name, ...params); }
	command  (name, ...params) {
		let com = this.action(name, ...params);
		com.undo = this.unaction(name, ...params);
		return com;
	}
	hasUndo () { return this.pool.hasUndo(); }

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
		// Slot card is opened if on top of stack
		if( card.where == 'slot' ) return ( card.name == this.dealer.slot[this.dealer.slot.length-1].name );
		// Check for next row neighbours (with current index and index+1)
		if( card.where == 'field' ) {
			let nextRow = card.row+1;
			if( nextRow > 6 ) return true;// Card from last row always opened
			let leftNeighbourCard  = this.field.getRow(nextRow).getCell(card.index).card;
			let rightNeighbourCard = this.field.getRow(nextRow).getCell(card.index+1).card;
			let hasNextRowNeighbours = ( leftNeighbourCard || rightNeighbourCard );
			return !hasNextRowNeighbours;
		}
		return false;
	}
}
