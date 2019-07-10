
import * as PIXI from 'pixi.js';
import IntersectHelper from './../IntersectHelper';

import Vector from './../base/Vector';
import MapManager from './../base/MapManager';
import Utils from './../Utils';

import Pyramide from './../Pyramide';

import Colors from './../Colors';
import Scene from './../Scene';
import Row from "./../Row";
import DropZone from './../DropZone';
import Card from './../Card';
import CardManager from './../CardManager';
import RegistryManager from './../RegistryManager';

import Scoreboard from './../Scoreboard';
import Button from './../Button';
import ModalBox from './../ModalBox';

import {Unit as UnitSettings} from './../Settings';

import Test from './../Test';

import Functions from "./../utils/Functions";

import ShirtModel from './../model/Shirt';

export default class MainScene extends Scene {

	constructor (name, options = {}) {
		super(name, options);
		this.sortableChildren = true;
	}

	init () {
		this.initGameObjects();
		this.cardWidth = this.app.unitWidth;
		this.cardSize = new ShirtModel().texture.orig;
	}

	preload () {}

	create () {
		this.resizeWindowHandlerHack = this.resizeWindowHandler.bind(this);

		// Create floor
		let table = new PIXI.TilingSprite(this.app.textures.Table, this.app.screen.width, this.app.screen.height);
		this.addChild(table);
		// CoordiNet
		this.drawCoords(50);
		// Create Dealer
		let dealer = this.initUnit(this.dealer, new PIXI.Point(32, 32));
		this.drawUnit(dealer);
		// Create Buttons
		let buttons = [
			{model:{name:'Undo',textures:{main:this.app.textures.Undo}}},
			{model:{name:'RestartGame',textures:{main:this.app.textures.RestartGame}}},
			{model:{name:'StartGame',textures:{main:this.app.textures.StartGame}}},
			{model:{name:'Fullscreen',textures:{main:this.app.textures.Fullscreen}}},
			{model:{name:'Help',textures:{main:this.app.textures.Help}}},
		];
		let bY = 128;
		buttons.forEach(b=>{
			let button = this.initUnit(new Button(b), new PIXI.Point(this.app.screen.width - 64, bY));
			this.drawUnit(button);
			this.buttons.add(button);
			bY += 64;
		});
		// Create Field
		let field = this.initUnit(this.field);
		this.drawUnit(field, new PIXI.Point(0, UnitSettings.size/2));
		this.drawField();
		// Create Modal
		this.modal = this.initUnit(new ModalBox());
		this.drawUnit(this.modal, new PIXI.Point(this.app.screen.width/2, this.app.screen.height/2));
		// Create Scoreboard
		let scoreboard = this.initUnit(this.scoreboard, new PIXI.Point(this.app.screen.width - 64, 64));
		this.drawUnit(scoreboard);
		// Activate buttons
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
		this.logic = new Pyramide(this);

		this.deck = this.logic.deck;
		this.dealer = this.logic.dealer;
		this.field = this.logic.field;

		this.buttons = new MapManager();
		
		this.scoreboard = this.logic.scoreboard;

	}

	initUnit (unitObject, spawn = undefined) {
		if( unitObject.initModel ) {
			unitObject.initModel(this);
			unitObject.model.spawn = spawn;
		}
		return unitObject;
	}

	drawUnit (unitObject, position = undefined) {
		this.drawChild(unitObject.model, position);
		this.registry.add(unitObject);
	}

	drawCard (suitrank, position = new PIXI.Point(0,0)) {
		let card = this.initUnit(new Card(suitrank), position);
		this.drawUnit(card, card.model.spawn);
		this.cards.add(card);
		return card;
	}

	drawHelpers () { this.registry.forEach(v => this.drawBounds(v)); }

	resetGui () {}

	drawDecks () {
		// Draw cards in F-cells
		this.field.rows.forEach( row => {
			row.cells.forEach( cell => {
				this.initUnit(cell.card);
				cell.model.addChild(cell.card.model);
			});
		});
		// Draw cards in D-deck
		this.dealer.deck.forEach( card => {
			this.initUnit(card);
			card.model.showShirt();
			this.dealer.model.Deck.addChild(card.model);
		});
	}

	drawField () {
		this.field.model.removeChildren();
		this.field.rows.forEach( row => {
			row.initModel(this);
			this.field.model.addChild(row.model);
			row.model.drawCells();
			row.model.x = this.app.screen.width/2 - (this.cardSize.width+4)*(row.row+1)/2;
			row.model.y = row.row*this.cardSize.height/2;
			row.model.zIndex = row.row;
		});
	}

	resizeWindowHandler () {
		this.app.renderer.resize(document.innerWidth, document.innerHeight);
	}

	dropCard (card, from) {
		let {game,logic} = this;
		let name = card.name;
		card.visible = false;//$card.parent().find($card).remove();
		// If remove from slot - check slot not empty and restore last card from slot
		if( from.where === 'slot' ) {
			let slotCard = logic.slot.pop();
			if( slotCard !== undefined ) {
				this.showCardInSlot(slotCard);
				logic.slot.push(slotCard);
			}
		}
	}

	updateUndoButton () { this.buttons.get('Undo').model.alpha = this.logic.hasUndo() ? 1 : 0.5; }
	hideModal () { this.modal.model.visible = false; }
	showModal (text = undefined) { if( text ) this.modal.model.text = text; this.modal.model.visible = true; }

	startRound (savedDeck = undefined) {
		this.resetGui();
		this.logic.initDecks(savedDeck);
		this.drawDecks();
		this.initHandlers();
	}

	initButtonHandlers () {
		let {game} = this;
		this.buttons.get('Fullscreen').model.off('click').on('click', () => {
			console.log('click!!!');
			if( Functions.isInFullScreen() ) {
				Functions.fullScreenCancel();
			}
			else {
				Functions.fullScreen(document.querySelector('body'));
			}

		});
		this.buttons.get('Undo').model.off('click').on('click', () => {
				game.undoAction();
				return true;
		});
		this.buttons.get('Help').model.off('click').on('click', () => {
			if( !this.modal.model.visible ) 
				this.showModal(game.i18n.t('Rules'));
			else
				this.hideModal();
			return true;
		});
		// Start new game and restart current game buttons
		this.buttons.get('StartGame').model.off('click').on('click', () => {
			this.startRound();
			return true;
		});
		// Restart current round
		this.buttons.get('RestartGame').model.off('click').on('click', () => {
			let savedDeck = undefined;
			let autosave = game.loadRound();
			if( autosave ) 
				savedDeck = autosave.deck.slice(0);
			this.startRound(savedDeck);
			return true;
		});
	}

	initHandlers() {
		let {logic} = this;
		// Resize hack
		// window.removeEventListener('resize', this.resizeWindowHandlerHack)
		// window.addEventListener('resize', this.resizeWindowHandlerHack);
		
		// Any card clicked
		this.cards.forEach(card => {
			card.model.off('click').on('click', () => {
				let data = card.attrs;
				if( card.isShirted )
					return true;

				// If card is not opened - can't click on it
				if( !logic.isCardOpened(card) ) {
					console.log(`Card isn't opened`);
					return true;
				}

				console.log(`Card is opened, let's find pair and drop it`);
				if( card.score === 13 ) {
					logic.pool.add(logic.action('DropCards', card));
					// logic.dropCard(card);
					return true;
				}
				else {
					let fitCard = logic.fitCard(card);
					if( fitCard ) {
						console.log(`Found fit card`, fitCard);
						logic.pool.add(logic.action('DropCards', fitCard, card));
						// logic.dropCard(fitCard);
						// logic.dropCard(card);
						return true;
					}
				}
			});
		})

		this.dealer.model.Deck.off('click').on('click', () => {
			console.log(`GetCardFromDealer clicked!`);
			logic.pool.add(logic.action('GetCardFromDealerDeck'));
		});
	}

}