
import * as PIXI from 'pixi.js';
import IntersectHelper from './../IntersectHelper';

import Vector from './../base/Vector';
import Utils from './../Utils';

import Pyramide from './../Pyramide';

import Colors from './../Colors';
import Scene from './../Scene';
import Field from "./../Field";
import Row from "./../Row";
import Deck from "./../Deck";
import Card from './../Card';
import CardManager from './../CardManager';
import RegistryManager from './../RegistryManager';

import Dealer from './../models/Dealer';
import Scoreboard from './../models/Scoreboard';
import Button from './../models/Button';
import ModalBox from './../models/ModalBox';

import Test from './../Test';

import Functions from "./../utils/Functions";

export default class MainScene extends Scene {

	constructor (name, options = {}) {
		super(name, options);
		this.sortableChildren = true;

	}

	init () {
		this.initGameObjects();
	}

	preload () {}

	create () {
		this.resizeWindowHandlerHack = this.resizeWindowHandler.bind(this);

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
		let dealer = new Dealer();
		this.drawChild(dealer, new PIXI.Point(32, 32));
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
		let field = new Field();
		this.drawChild(field, new PIXI.Point(this.app.screen.width/4, this.app.screen.height/4))
		// Create Modal
		let modal = new ModalBox(this);
		this.drawChild(modal, new PIXI.Point(this.app.screen.width/2, this.app.screen.height/2));
		// Create Scoreboard
		let scoreboard = new Scoreboard();
		scoreboard.spawn = new PIXI.Point(
			this.app.screen.width - 64,
			64,
		);
		this.drawChild(scoreboard, scoreboard.spawnPoint);

		this.initButtonHandlers();
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
		this.game = this.app.game;
		this.cards = new CardManager(this);
		this.registry = new RegistryManager(this);
		this.deck = new Deck();
		this.logic = new Pyramide(this);
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
		// this.showEmptySlot();
		this.updateScoreboard();
		this.updateUndoButton();
		// this.showModal(`Победа!<br>Вы набрали<br>123 очка!`);
		// this.showModal(`Количество перемоток колоды исчерпано!`);
	}

	getDealer () { return this.getChildByName('Dealer'); }
	getButton (name) { return this.getChildByName(name); }
	getField () { return this.getChildByName('Field'); }
	getRow (row) { 
		return this.getField().children.filter(child => {return child.name == 'Row' && child.row == row})[0]; 
	}

	showDecks() {
		let {game, logic} = this;
		// let $game = $(this.q.game);
		let field = this.getField();//$game.find(this.q.field);
		field.removeChildren();
		// Fill field with cards in rows
		for (let row = 0; row < logic.field.length; row++) {
			let cardRow = new Row(row);//$(`<div class="${this.css.cardRow}"></div>`);
			for (let i = 0; i < logic.field[row].length; i++) {
				let card = logic.field[row][i];
				console.log(card);

				card.attrs.row = row;
				card.attrs.index = i;
				cardRow.addChild(card);
			}
			field.addChild(cardRow);
		}

		this.fixCardsPosition();

		// Show Ddeck shirt
		this.showDealerDeckShirt();
		this.updateScoreboard();
	}

	drawField () {
		let field = this.getField();//$game.find(this.q.field);
		field.removeChildren();
		// Fill field with rows
		for (let row = 0; row < logic.field.length; row++) {
			let cardRow = new Row(row);
			field.addChild(cardRow);
			cardRow.x = field.width/2;
			cardRow.y = row*160/2;
			cardRow.zIndex = row;
		}

	}

	resizeWindowHandler () {
		this.app.renderer.resize(document.innerWidth, document.innerHeight);
		// this.fixCardsPosition();
	}

	fixCardsPosition () {
		let {game, logic} = this;
		let $field = this.getField();

		let testCard = this.getDealer().Shirt;
		let cardWidth = testCard.width;//Math.min($game.width(), $game.height()) / 4 * 0.6;
		let cardHeight = testCard.height;// width * 1.5

		// Correct position of cards and rows
		$field.children.forEach( (cardRow) => {
			let rowIndex = cardRow.row;
			let zIndex = cardRow.zIndex;
			cardRow.y = cardRow.zIndex * cardHeight/2;

			let rowWidth = cardWidth * logic.field[rowIndex].length;
			let rowLeftPos = parseInt(rowWidth) / 2;
			cardRow.x = rowLeftPos;

			cardRow.children.forEach( (card, index) => {
				let cardIndex = card.attrs.index;
				card.x = cardIndex*cardWidth;
			});
		});
	}

	showDealerDeckShirt() { this.getDealer().Shirt.visible = true; }

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
		this.getDealer().Slot.removeChildren();
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
		this.getChildByName('Scoreboard').text = this.logic.scores.toString().padStart(3, '0');
	}

	updateUndoButton () {
		this.getButton('Undo').alpha = this.logic.hasUndo() ? 1 : 0.5;
	}

	showModal (text = undefined) {
		let modal = this.getChildByName('ModalBox');
		if( text )
			modal.text = text;
		modal.visible = true;
	}
	hideModal () { this.getChildByName('ModalBox').visible = false; }
	toggleModal () { this.getChildByName('ModalBox').toggle(); }

	startRound (savedDeck = undefined) {
		this.resetGui();
		this.logic.initDecks(savedDeck);
		this.showDecks();
		this.updateUndoButton();
		this.initHandlers();
	}

	initButtonHandlers () {
		let {game} = this;
		this.getButton('Fullscreen').off('click').on('click', () => {
			console.log('click!!!');
			if( Functions.isInFullScreen() ) {
				Functions.fullScreenCancel();
			}
			else {
				Functions.fullScreen(document.querySelector('body'));
			}

		});
		this.getButton('Undo').off('click').on('click', () => {
				game.undoAction();
				return true;
		});
		this.getButton('Help').off('click').on('click', () => {
			if( !this.getChildByName('ModalBox').visible ) 
				this.showModal(game.i18n.t('Rules'));
			else
				this.hideModal();
			return true;
		});
		// Start new game and restart current game buttons
		this.getButton('StartGame').off('click').on('click', () => {
			this.startRound();
			return true;
		});
		// Restart current round
		this.getButton('RestartGame').off('click').on('click', () => {
			let savedDeck = undefined;
			let autosave = game.loadRound();
			if( autosave ) 
				savedDeck = autosave.deck.slice(0);
			this.startRound(savedDeck);
			return true;
		});
	}

	initHandlers() {

		let {game, logic} = this;
		// Resize hack
		window
			.removeEventListener('resize', this.resizeWindowHandlerHack)
			.addEventListener('resize', this.resizeWindowHandlerHack);
		
		// Any card clicked
		this.cards.forEach(card => {
			card.off('click').on('click', () => {
				let data = card.attrs;
				if( card.isShirted )
					return true;

				let from = undefined;
				if( card.attrs.row !== undefined )
					from = {where: 'field', row: card.attrs.row, index: card.attrs.index};
				else if( card.inSlot )
					from = {where: 'slot'};

				// If card is not opened - can't click on it
				if( !logic.isCardOpened(from) )
					return true;

				//console.log(`Card is opened, let's find pair and drop it`);
				if( card.score === 13 ) {
					logic.doAction('DropCards', [{card, from}]);
					this.dropCard(card, from);
				}
				else {
					let fitCard = logic.fitCard(card, from);
					if( fitCard.card !== undefined ) {
						logic.doAction('DropCards', [{card: fitCard.card, from: fitCard.from}, {card, from}]);
						this.dropCard(fitCard.card, fitCard.from);
						this.dropCard(card, from);
					}
				}
			});
		})

		this.getDealer().off('click').on('click', () => {
			logic.doAction('GetCardFromDealer');
		});
	}

}