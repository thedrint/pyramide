
import * as PIXI from 'pixi.js';
import IntersectHelper from './../IntersectHelper';

import Vector from './../base/Vector';
import Utils from './../Utils';

import Pyramide from './../Pyramide';

import Colors from './../Colors';
import Scene from './../Scene';
import Deck from "./../Deck";
import Card from './../Card';
import CardManager from './../CardManager';
import RegistryManager from './../RegistryManager';

import Scoreboard from './../models/Scoreboard';
import Button from './../models/Button';

import Test from './../Test';

import Functions from "./../utils/Functions";

export default class MainScene extends Scene {

	constructor (name, options = {}) {
		super(name, options);

	}

	init () {
		this.game = this.app.game;
		this.logic = new Pyramide(this);
		this.initGameObjects();
	}

	preload () {}

	create () {
		this.resizeWindowHandlerHack = this.resizeWindowHandler.bind(this);

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
			undo: 'undo',
			disabled: 'disabled',
			help: 'help',
		};

		this.q = {};
		for( let i in this.css ) {
			this.q[i] = `.${this.css[i]}`;
		}

		// css id
		this.id = {
			gameModal: 'gameModal',
		};

		for( let i in this.id ) {
			this.q[i] = `#${this.id[i]}`;
		}

		// Create floor
		let table = new PIXI.TilingSprite(this.app.textures.Table, this.app.screen.width, this.app.screen.height);
		this.addChild(table);
		// CoordiNet
		this.drawCoords(32);
		// Create Dealer
		// Create Buttons
		let buttons = [
			new Button({name:'Undo',model:{textures:{main:this.app.textures.Undo}}}),
			new Button({name:'RestartGame',model:{textures:{main:this.app.textures.RestartGame}}}),
			new Button({name:'StartGame',model:{textures:{main:this.app.textures.StartGame}}}),
			new Button({name:'Fullscreen',model:{textures:{main:this.app.textures.Fullscreen}}}),
			new Button({name:'Help',model:{textures:{main:this.app.textures.Help}}}),
		];
		let bY = 128;
		buttons.forEach(b=>{
			this.drawChild(b, new PIXI.Point(this.app.screen.width - 64, bY));
			bY += 64;
		});
		// Create Field
		// Create Modal
		// Create Scoreboard
		let scoreboard = new Scoreboard();
		scoreboard.spawn = new PIXI.Point(
			this.app.screen.width - 64,
			64,
		);
		this.drawChild(scoreboard, scoreboard.spawnPoint);
	}

	// Main update loop of scene
	update () {
		if( this.logic.pool.length ) {
			let com = this.logic.pool.execute();
			this.logic.trash.add(com);
		}
	}

	/**
	 * Init internal scene objects
	 * @return none
	 */
	initGameObjects () {
		this.cards = new CardManager(this);
		this.registry = new RegistryManager(this);
	}

	createCard (suitrank, position = new PIXI.Point(0,0)) {
		let card = new Card(suitrank);
		card.spawn = position;
		this.drawChild(card, card.spawnPoint);
		this.cards.add(card);
		return card;
	}

	drawHelpers () {
		this.registry.forEach(v => this.drawBounds(v));
	}

	resetGui () {
		this.showDealerDeckShirt();
		this.showEmptySlot();
		this.updateScoreboard();
		this.updateUndoButton();
		// this.showModal(`Победа!<br>Вы набрали<br>123 очка!`);
		// this.showModal(`Количество перемоток колоды исчерпано!`);
	}

	initButtonHandlers () {
		let {game} = this;
		$(document).off('click', this.q.button).on(`click`, this.q.button, event => {
			let $t = $(event.currentTarget);

			//TODO: Settings and other buttons
			if( $t.hasClass(this.css.fullscreen) ) {
				if( Functions.isInFullScreen() ) {
					Functions.fullScreenCancel();
				}
				else {
					Functions.fullScreen(document.querySelector('body'));
				}

				return true;
			}

			if( $t.hasClass(this.css.undo) ) {
				game.undoAction();
				return true;
			}

			if( $t.hasClass(this.css.help) ) {
				this.showModal(game.i18n.t('Rules'));
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

		$(window).off(`resize`, this.resizeWindowHandlerHack).on(`resize`, this.resizeWindowHandlerHack);
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
				game.doAction('DropCards', [{card, from}]);
				this.dropCard(card, from);
			}
			else {
				let fitCard = game.fitCard(card, from);
				if( fitCard.card !== undefined ) {
					game.doAction('DropCards', [{card: fitCard.card, from: fitCard.from}, {card, from}]);
					this.dropCard(fitCard.card, fitCard.from);
					this.dropCard(card, from);
				}
			}

		});

		// Ddeck clicked
		$(document).off(`click`, this.q.ddeck).on(`click`, this.q.ddeck, event => {
			game.doAction('GetCardFromDealer');
		});

	}


	showDecks() {
		let {game} = this;
		let $game = $(this.q.game);
		let $field = $game.find(this.q.field);
		$field.empty();
		// Fill field with cards in rows
		for (let row = 0; row < game.field.length; row++) {
			let $cardRow = $(`<div class="${this.css.cardRow}"></div>`);
			for (let i = 0; i < game.field[row].length; i++) {
				let card = game.field[row][i];
				let $cardImage = card.htmlimg();

				$cardImage.attr('data-row', row);
				$cardImage.attr('data-index', i);
				$cardRow.append($cardImage);
			}
			$cardRow.attr('data-row', row);
			$field.append($cardRow);
		}

		this.fixCardsPosition();

		// Show Ddeck shirt
		this.showDealerDeckShirt();
		this.updateScoreboard();
	}

	resizeWindowHandler () {
		this.fixCardsPosition();
	}

	fixCardsPosition () {
		let {game} = this;
		let $game = $(this.q.game);
		let $field = $game.find(this.q.field);

		let cardWidth = Math.min($game.width(), $game.height()) / 4 * 0.6;
		let cardHeight = cardWidth*1.5;

		// Correct position of cards and rows
		$field.find(this.q.cardRow).each( (row, el) => {
			let $cardRow = $(el);
			let rowIndex = $cardRow.data('row');
			let zIndex = parseInt(rowIndex) + 1;
			$cardRow.css('z-index', zIndex);
			$cardRow.css('top', `${rowIndex*cardHeight/2}px`);

			let rowWidth = cardWidth * game.field[rowIndex].length;
			let rowLeftPos = parseInt(($field.width() - rowWidth) / 2);
			$cardRow.css('left', `${rowLeftPos}px`);

			$cardRow.find(this.q.card).each( (index, cardEl) => {
				let $cardImage = $(cardEl);
				let cardIndex = $cardImage.data('index');
				$cardImage.css('z-index', rowIndex + 1);
				$cardImage.css('left', `${cardIndex*cardWidth}px`);
			});
		});
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

	showLastCardInSlot () {
		let {game} = this;
		this.showEmptySlot();
		let lastSlotCard = game.slot.pop();
		if( !lastSlotCard )
			return true;

		this.showCardInSlot(lastSlotCard);
		game.slot.push(lastSlotCard);
	}

	showCardInField (card, from) {
		let $field = $(this.q.field);
		let $cardImage = card.htmlimg();
		$cardImage.attr('data-row', from.row);
		$cardImage.attr('data-index', from.index);
		let $cardRow = $field.find(`${this.q.cardRow}[data-row="${from.row}"]`);
		$cardRow.append($cardImage);

		this.fixCardsPosition();
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

	updateScoreboard () {
		let $scoreboard = $(this.q.scoreboardText);
		$scoreboard.text(this.game.scores.toString().padStart(3, '0'));
	}

	updateUndoButton () {
		let {game} = this;
		if( game.hasUndo() )
			$(`${this.q.button}${this.q.undo}`).removeClass(this.css.disabled);
		else
			$(`${this.q.button}${this.q.undo}`).addClass(this.css.disabled);
	}

	showModal (html) {
		$(`${this.q.gameModal} .modal-body`).html(html);
		$(this.q.gameModal).modal('show');
	}

	startRound () {
		this.app.start();

		this.resetGui();
		this.initDecks(savedDeck);
		this.app.showDecks();
		this.app.updateUndoButton();
		this.initHandlers();

	}

}