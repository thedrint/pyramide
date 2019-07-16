 
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
		this.initGameObjects();
	}

	initGameObjects () {
		this.cards         = this.scene.cards;
		this.deck          = new Deck();
		this.field         = new Field();
		this.dealer        = new Dealer();
		this.scoreboard    = new Scoreboard();
		this.drop          = new DropZone();
		this.pool          = new CommandPool();

		this.maxRewinds    = GameSettings.maxRewind;
		this.currentRewind = 0;
	}

	initDecks(savedDeck = undefined) {
		this.reset();
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

	reset () {
		this.cards.clear();
		this.field.clearRows();
		this.dealer.deck.clear();
		this.dealer.slot.clear();
		this.drop.cards.clear();
		this.pool.clear();
		this.pool.trash.clear();
		this.currentRewind = 0;		
	}

	saveTable () {
		let data = {
			deck   : this.cards.pack(),
			field  : this.field.pack(),
			dealer : {
				deck : this.dealer.deck.pack(),
				slot : this.dealer.slot.pack(),
			},
			drop   : this.drop.cards.pack(),
			trash  : [],
			scores : this.scoreboard.scores,
		};
		let trash = [];
		this.pool.trash.forEach( com => {
			let name = com.name;
			let params = [];
			if( com.params )// Array of cards
				params = com.params.reduce( (a,c) => { return [...a,c.name]}, []);
			trash.push({name, params});
		});
		data.trash = trash;
		return this.game.saveTable(data);
	}
	loadTable () {
		this.reset();
		let {deck, field, dealer, drop, trash, scores} = this.game.loadTable();
		deck.forEach( cardData => {
			let card   = new Card(cardData.name);
			card.initLogic(this);
			card.row   = cardData.row;
			card.index = cardData.index;
			card.from  = cardData.from;
			card.where = cardData.where;
			this.cards.add(card)
		});
		field.forEach( (row,r) => {
			row.forEach( (cardName,i) => {
				if( !cardName ) return;
				let card = this.cards.get(cardName);
				this.field.rows[r].cells[i].card = card;
			});
		});
		dealer.deck.forEach( cardName => {
			let card = this.cards.get(cardName);
			this.dealer.deck.add(card);
		})
		dealer.slot.forEach( cardName => {
			let card = this.cards.get(cardName);
			this.dealer.slot.add(card);
		})
		drop.forEach( cardName => {
			let card = this.cards.get(cardName);
			this.drop.cards.add(card);
		})
		trash.forEach( comData => {
			let name = comData.name;
			let params = [];
			if( comData.params )
				params = comData.params.reduce( (a,cname) => {return [...a, this.cards.get(cname)]}, []);
			this.pool.trash.add(this.unaction(name, ...params));
		});
		this.scoreboard.scores = scores;
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
