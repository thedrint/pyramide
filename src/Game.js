
import Application from './Application';

import i18next from 'i18next';
import i18nextXhrBackend from 'i18next-xhr-backend';
import i18nextBrowserLanguagedetector from 'i18next-browser-languagedetector';

export default class Game {

	constructor (options) {
		this.app = new Application(options);
		this.app.game = this;
		document.body.appendChild(this.app.view);
		this.app.stop();

		this.storage = localStorage;

		this.i18n = i18next;
		this.i18n
			.use(i18nextBrowserLanguagedetector)
			.use(i18nextXhrBackend)
			.init({
			fallbackLng: 'ru',
			lng: 'ru',
			ns: ['common'],
			defaultNS: 'common',
			backend: {
				// load from i18next-gitbook repo
				loadPath: './locales/{{lng}}/{{ns}}.json',
				crossDomain: true,
			}
		});
		this.gui = undefined;
		this.deck = undefined;
		this.cardRegistry = {};

		this.field = [];
		this.dealer = [];
		this.slot = [];
		this.maxRewinds = 2;
		this.currentRewind = 0;

		this.drop = [];
		this.dropStack = [];
		this.actionStack = [];

		this.scores = 0;
	}

	initGui (type = 'jquery') {
		this.gui = new Gui(type, this);
		this.deck = this.gui.deck;
	}

	resetGui () {
		this.gui.resetGui();
	}

	initDecks(savedDeck = undefined) {
		// get card deck, new random, or predefined from saveDeck
		let htmlDeck = this.deck.getCards(savedDeck);
		// save it to storage
		this.saveGame({deck:this.deck.getCardsNamesArray(htmlDeck)});
		// Reset cardRegistry
		this.cardRegistry = {};
		this.field = [];
		this.dealer = [];
		this.slot = [];
		this.currentRewind = 0;
		this.drop = [];
		this.dropStack = [];
		this.actionStack = [];
		this.scores = 0;
		for( let card of htmlDeck ) {
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
		this.gui.updateUndoButton();
	}

	initHandlers () {
		this.gui.initHandlers();
	}

	initButtonHandlers() {
		this.gui.initButtonHandlers();
	}

	doAction (action, ...params) {
		this.actionStack.push({action, params});
		let actionMethod = `do${action}`;
		this[actionMethod](...params);
		this.gui.updateUndoButton();
	}

	undoAction () {
		if( !this.hasUndo() )
			return false;

		let lastAction = this.actionStack.pop();
		if( !lastAction ) {
			return false;
		}

		let {action, params} = lastAction;
		let actionMethod = `undo${action}`;
		this[actionMethod](...params);
		this.gui.updateUndoButton();
	}

	hasUndo () {
		return ( this.actionStack.length > 0 );
	}

	doGetCardFromDealer() {
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

	undoGetCardFromDealer () {
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

	doDropCards (arrayOfCards) {
		for( let CardInfo of arrayOfCards )
			this.dropCard(CardInfo.card, CardInfo.from);

		this.dropStack.push(arrayOfCards);

		// Check game win
		if( this.isFieldDeckEmpty() ) {
			this.gui.showModal(this.i18n.t('You win a game!', {count: this.scores}));
			//TODO: Win animation
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
		this.gui.updateScoreboard();
	}

	undoDropCards () {
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

	static playGame(options) {
		let game = new Game(options);
		game.initGui();
		game.resetGui();
		game.initButtonHandlers();
	}

	saveGame (autosave = undefined) {
		if( autosave === undefined ) {
			autosave = {
				deck: Object.keys(this.cardRegistry),
			}
		}
		this.storage.setItem('autosave', JSON.stringify(autosave));

		return true;
	}

	loadGame () {
		return JSON.parse(this.storage.getItem('autosave'));
	}

	startGame () {
		this.resetGui();
		this.initDecks(savedDeck);
		this.showDecks();
		this.initHandlers();

		this.app.init();
		this.app.start();
	}

	stopGame () {
		this.app.stop();
	}
}
