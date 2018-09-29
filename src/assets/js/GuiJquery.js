import $ from 'jquery';
import Deck from "./DeckJquery";

export default class GuiJquery {
	constructor(gameObject) {
		this.game = gameObject;

		this.deck = new Deck();
		// css classes
		this.css = {
			dealer: 'dealer',
			field: 'field',
			ddeck: 'dealer-deck',
			dslot: 'dealer-slot',
			shirt: 'shirt',
			card: 'card',
			cardRow: 'cardrow',
			cardRowWrapper: 'cardrow-wrapper',
			game: 'game',
			scoreboard: 'scoreboard',
			scoreboardText: 'scoreboard-text',
			button: 'button',
			buttonNewGame: 'newgame',
			buttonRestartGame: 'restartgame',
			fullscreen: 'fullscreen',
		};

		this.q = {};
		for( let i in this.css ) {
			this.q[i] = `.${this.css[i]}`;
		}
	}

	resetGui () {
		this.showDealerDeckShirt();
		this.showEmptySlot();
		this.changeScoreboard('0');
	}

	initButtonHandlers () {
		let {game} = this;
		$(document).off('click', this.q.button).on(`click`, this.q.button, event => {
			let $t = $(event.currentTarget);

			//TODO: Settings and other buttons
			if( $t.hasClass(this.css.fullscreen) ) {
				document.querySelector('body').webkitRequestFullscreen();
				return true;
			}

			// Start new game and restart current game buttons
			if( $t.hasClass(this.css.buttonRestartGame) || $t.hasClass(this.css.buttonNewGame) ) {
				let savedDeck = undefined;

				if( $t.hasClass(this.css.buttonRestartGame) ) {
					let autosave = game.loadGame();
					if( autosave ) {
						savedDeck = autosave.deck.slice(0);
					}
				}

				game.startGame(savedDeck);
				return true;
			}
		});
	}

	initHandlers() {

		let {game} = this;
		// Any card clicked
		$(document).off(`click`, this.q.card).on(`click`, this.q.card, event => {
			let $t = $(event.currentTarget);
			let data = $t.data();
			if( $t.hasClass(this.css.shirt) )
				return true;

			let card = game.cardRegistry[data.name];
			let from = undefined;
			if( data.row !== undefined )
				from = {where: 'field', row: data.row, index: data.index};
			else if( $t.closest(this.q.dslot).length )
				from = {where: 'slot'};

			// If card is not opened - can't click on it
			if( !game.isCardOpened(from) )
				return true;

			//console.log(`Card is opened, let's find pair and drop it`);
			if( data.score === 13 ) {
				game.dropCard(card, from);
				this.dropCard(card, from);
			}
			else {
				let fitCard = game.fitCard(card, from);
				if( fitCard.card !== undefined ) {
					game.dropCard(fitCard.card, fitCard.from);
					this.dropCard(fitCard.card, fitCard.from);
					game.dropCard(card, from);
					this.dropCard(card, from);
				}
			}

		});

		// Ddeck clicked
		$(document).off(`click`, this.q.ddeck).on(`click`, this.q.ddeck, event => {
			game.getCardFromDealer();
		});

	}


	showDecks() {
		let {game} = this;
		let $game = $(this.q.game);
		let $field = $game.find(this.q.field);
		$field.empty();
		let $dealer = $game.find(this.q.dealer);
		// Fill field with cards in rows
		for (let row in game.field) {
			let $cardRow = $(`<div class="${this.css.cardRow}"></div>`);
			for (let i in game.field[row]) {
				let card = game.field[row][i];
				let $cardImage = card.htmlimg();

				$cardImage.attr('data-row', row);
				$cardImage.attr('data-index', i);
				$cardRow.append($cardImage);
			}
			$field.append($cardRow);
		}

		let cardWidth = $(this.q.card).width();
		let cardHeight = cardWidth*1.5;

		// Correct position of cards and rows
		$field.find(this.q.cardRow).each( (row, el) => {
			let $cardRow = $(el);
			let zIndex = parseInt(row) + 1;
			$cardRow.css('z-index', zIndex);
			$cardRow.css('top', `${row*cardHeight/2}px`);

			let rowWidth = cardWidth * game.field[row].length;
			let rowLeftPos = parseInt(($field.width() - rowWidth) / 2);
			$cardRow.css('left', `${rowLeftPos}px`);

			$cardRow.find(this.q.card).each( (index, cardEl) => {
				let $cardImage = $(cardEl);
				$cardImage.css('z-index', row + 1);
				$cardImage.css('left', `${index*cardWidth}px`);
			});
		});

		// Show Ddeck shirt
		this.showDealerDeckShirt();
		this.changeScoreboard('0');
	}

	showDealerDeckShirt() {
		let $dealerDeck = $(this.q.ddeck);
		// For 1st run - add shirt image
		if( !$dealerDeck.find(this.q.card).length ) {
			let $shirtImg = Deck.shirtimg();
			$dealerDeck.append($shirtImg);
		}
		// Make shirt visible
		$dealerDeck.find(this.q.card).css('visibility', 'visible');

	}

	showCardInSlot(card) {
		this.showEmptySlot();
		let $slot = $(this.q.dslot);
		let $cardimg = card.htmlimg();
		$cardimg.attr('data-suit', card.suit);
		$cardimg.attr('data-rank', card.rank);
		$cardimg.attr('data-score', card.score);
		$slot.append($cardimg);
	}

	showEmptySlot () {
		let $slot = $(this.q.dslot);
		$slot.empty();
	}

	showEmptyDealerDeck() {
		//TODO: show something other, maybe red stop symbol or rewind symbol. Need correct svg for this
		let $dealerDeck = $(this.q.ddeck);
		$dealerDeck.find('.card').css('visibility', 'hidden');
	}

	dropCard (card, from) {
		let {game} = this;
		let name = card.getName();
		let $card = $(this.q.card).filter(`[data-name="${name}"]`);
		$card.parent().find($card).remove();
		// If remove from slot - check slot not empty and restore last card from slot
		if( from.where === 'slot' ) {
			let slotCard = game.slot.pop();
			if( slotCard !== undefined ) {
				this.showCardInSlot(slotCard);
				game.slot.push(slotCard);
			}
		}
	}

	changeScoreboard (newScores) {
		let $scoreboard = $(this.q.scoreboardText);
		$scoreboard.text(newScores.toString().padStart(3, '0'));
	}
}