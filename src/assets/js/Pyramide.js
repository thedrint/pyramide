import Gui from './Gui.js';
import $ from "jquery";

export default class Pyramide {
	constructor() {
		this.gui = undefined;
		this.deck = undefined;
		this.cardRegistry = {};

		this.field = [];
		this.dealer = [];
		this.slot = [];
		this.maxRewinds = 2;
		this.currentRewind = 0;

		this.drop = [];

		this.scores = 0;
	}

	initGui (type = 'jquery') {
		this.gui = new Gui(type, this);
		this.deck = this.gui.deck;
	}

	initDecks() {
		let htmlDeck = this.deck.getCards();
		for( let i in htmlDeck ) {
			let card = htmlDeck[i];
			this.cardRegistry[ card.getName() ] = card;
		}
		let row = 0;
		for (let i = 0; i < 28; i++) {
			if (this.field[row] === undefined)
				this.field[row] = [];

			let card = htmlDeck[i];

			this.field[row].push(card);

			if (this.field[row].length >= row + 1)
				row++;
		}

		for (let i = 28; i < htmlDeck.length; i++) {
			this.dealer.push(htmlDeck[i]);
		}
	}

	showDecks() {
		this.gui.showDecks();
	}

	initHandlers() {
		this.gui.initHandlers();
	}

	getCardFromDealer() {
		let {gui} = this;
		// If Ddeck not empty
		if (this.dealer.length) {
			// Get card from Ddeck
			let newCard = this.dealer.shift();
			// And set it to Dslot
			this.slot.push(newCard);
			gui.showCardInSlot(newCard);
			// Show empty Ddeck if no more cards there
			if( this.dealer.length === 0 ) {
				gui.showEmptyDealerDeck();
			}
		}
		else {
			if( this.currentRewind > this.maxRewinds-1 ) {
				console.log('You cannot rewind anymore!');
				return false;
			}
			// Set all cards from Dslot to Ddeck
			for( let i in this.slot ) {
				this.dealer.push(this.slot[i]);
			}
			// Clear slot;
			this.slot = [];
			gui.showEmptySlot();
			this.currentRewind++;
			console.log('You rewind dealer deck!');
			gui.showDealerDeckShirt();
		}
	}

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
		this.gui.changeScoreboard(this.scores);
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

					console.log('Found fittest card', row, i);
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
				console.log('Found fittest card in slot');
			}
			// Return card to slot after checking
			this.slot.push(slotCard);
		}

		return result;
	}

	isCardOpened (from) {
		console.log('isCardOpened', from);
		// Slot card always opened
		if( from.where === 'slot' ) {
			console.log('Slot card is opened');
			return true;
		}

		// Check for next row neighbours (with current index and index+1)
		if( from.where === 'field' ) {
			let hasNextRowNeighbours = (
				(this.field[from.row+1] !== undefined && this.field[from.row+1][from.index] !== undefined)
				||
				(this.field[from.row+1] !== undefined && this.field[from.row+1][from.index+1] !== undefined)
			);

			console.log('Card ' + (hasNextRowNeighbours?'NOT':'is') + ' opened');

			return !hasNextRowNeighbours;
		}
	}

	play() {
		$(() => {
			this.initGui();
			this.initDecks();
			this.showDecks();
			this.initHandlers();
		});
	}

	static playGame () {
		let game = new Pyramide();
		game.play();
	}
}