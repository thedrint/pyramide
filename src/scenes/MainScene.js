
import * as PIXI from 'pixi.js';
import IntersectHelper from './../IntersectHelper';

import Vector from './../base/Vector';
import MapManager from './../base/MapManager';
import Utils from './../Utils';

import Pyramide from './../Pyramide';
import * as AnimationCommands from './../command/AnimationCommands';

import Colors from './../Colors';
import Scene from './../Scene';
import Row from "./../Row";
import DropZone from './../DropZone';
import Card from './../Card';
import CardManager from './../CardManager';
import RegistryManager from './../RegistryManager';
import CommandPool from './../command/CommandPool';

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
		this.calculateCardSize();
	}

	calculateCardSize () {
		this.cardWidth = this.app.unitWidth;
		this.cardHeight = this.app.unitHeight;
		this.originalCard = PIXI.Loader.shared.resources['Shirt'].texture.orig;
		let scaleW = this.cardWidth/this.originalCard.width;
		let scaleH = this.cardHeight/this.originalCard.height;
		this.cardScale = Math.min(scaleW, scaleH);
		this.cardSize = {
			width  : parseInt(this.originalCard.width  * this.cardScale), 
			height : parseInt(this.originalCard.height * this.cardScale),
		};
		this.buttonSize = this.cardSize.width/2;
	}

	/**
	 * Init internal scene objects
	 * @return none
	 */
	initGameObjects () {
		this.game       = this.app.game;

		this.cards      = new CardManager(this);
		this.registry   = new RegistryManager(this);
		this.logic      = new Pyramide(this);

		this.deck       = this.logic.deck;
		this.dealer     = this.logic.dealer;
		this.field      = this.logic.field;
		this.pool       = this.logic.pool;
		this.scoreboard = this.logic.scoreboard;
		this.drop       = this.logic.drop;

		this.buttons    = new MapManager();
		this.animations  = new CommandPool();// Special pool for animations
	}

	preload () {}

	create () {
		// this.redrawCoords(50);
		this.redrawGameObjects();
		this.initButtonHandlers();
		this.emit('created');
	}

	// Main update loop of scene
	update () {
		let com = this.pool.execute();
		if( com.isEnded )
			this.logic.saveTable();
		this.animations.executeAll();
	}

	animation (name, ...params) { return new AnimationCommands[`${name}`](this, name, ...params); }

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

	redrawGameObjects () {
		this.redrawTable();
		this.redrawDealer();
		this.redrawButtons();
		this.redrawField();
		this.redrawModal();
		this.redrawScoreboard();
		this.redrawDropzone();
	}

	redrawTable () {
		if( this.table ) this.table.destroy();
		this.table = new PIXI.TilingSprite(this.app.textures.Table, this.app.screen.width, this.app.screen.height);
		this.addChild(this.table);
	}

	redrawButtons () {
		this.buttons.forEach( b => b.model.destroy() );
		this.buttons.clear();
		let buttons = [
			{model:{name:'Undo',        size:this.buttonSize, textures:{main:this.app.textures.Undo}}},
			{model:{name:'RestartGame', size:this.buttonSize, textures:{main:this.app.textures.RestartGame}}},
			{model:{name:'StartGame',   size:this.buttonSize, textures:{main:this.app.textures.StartGame}}},
			{model:{name:'SaveGame',    size:this.buttonSize, textures:{main:this.app.textures.SaveGame}}},
			{model:{name:'LoadGame',    size:this.buttonSize, textures:{main:this.app.textures.LoadGame}}},
		];
		let leftColButtons = [
			{model:{name:'Help',        size:this.buttonSize, textures:{main:this.app.textures.Help}}},
			{model:{name:'Fullscreen',  size:this.buttonSize, textures:{main:this.app.textures.Fullscreen}}},
		];
		buttons.forEach((b,i)=>{
			let bx, by;
			bx = this.app.screen.width - this.buttonSize,
			by = this.buttonSize*2.5 + this.buttonSize*1.5*i;
			let button = this.initUnit(new Button(b), new PIXI.Point(bx, by));
			this.drawUnit(button);
			this.buttons.add(button);
		});
		leftColButtons.forEach((b,i)=>{
			let bx, by;
			bx = this.buttonSize,
			by = this.cardSize.height + this.buttonSize*1.5 + this.buttonSize*1.5*i;
			let button = this.initUnit(new Button(b), new PIXI.Point(bx, by));
			this.drawUnit(button);
			this.buttons.add(button);
		});
	}

	redrawDealer() {
		if( this.dealer.model ) this.dealer.model.destroy();
		this.initUnit(this.dealer, new PIXI.Point(this.buttonSize/2, this.buttonSize/2));
		this.drawUnit(this.dealer);
	}

	redrawField () {
		if( this.field.model ) this.field.model.destroy();
		this.initUnit(this.field);
		this.drawUnit(this.field, new PIXI.Point(0, this.buttonSize/2));
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

	redrawModal () {
		if( this.modal && this.modal.model ) this.modal.model.destroy();
		this.modal = this.initUnit(new ModalBox());
		this.drawUnit(this.modal, new PIXI.Point(this.app.screen.width/2, this.app.screen.height/2));		
	}

	redrawScoreboard () {
		if( this.scoreboard.model ) this.scoreboard.model.destroy();
		this.scoreboard.settings.model.width  = this.buttonSize;
		this.scoreboard.settings.model.height = this.buttonSize;
		this.initUnit(this.scoreboard, new PIXI.Point(this.app.screen.width - this.buttonSize, this.buttonSize));
		this.drawUnit(this.scoreboard);
	}

	redrawDropzone () {
		if( this.drop.model ) this.drop.model.destroy();
		this.initUnit(this.drop, new PIXI.Point(this.app.screen.width - this.buttonSize*2 - this.cardSize.width, this.buttonSize/2));
		this.drawUnit(this.drop);
	}

	drawHelpers () { this.registry.forEach(v => this.drawBounds(v)); }

	redrawDecks () {
		this.field.rows.forEach( row => {
			row.cells.forEach( cell => {
				if( cell.card ) {
					this.initUnit(cell.card);
					cell.model.addChild(cell.card.model);					
				}
			});
		});

		this.dealer.model.Deck.removeChildren();
		// console.log(this.dealer.deck);
		this.dealer.deck.forEach( card => {
			this.initUnit(card);
			card.model.showShirt();
			this.dealer.model.Deck.addChild(card.model);
		});
		this.dealer.model.Slot.removeChildren();
		// console.log(this.dealer.slot);
		this.dealer.slot.forEach( card => {
			this.initUnit(card);
			card.model.showFace();
			this.dealer.model.Slot.addChild(card.model);
		});

		this.drop.model.removeChildren();
		this.drop.cards.forEach( card => {
			this.initUnit(card);
			card.model.showFace();
			this.drop.model.addChild(card.model)
		});
	}


	updateUndoButton () { this.buttons.get('Undo').model.alpha = this.pool.hasUndo() ? 1 : 0.5; }
	hideModal () { this.modal.model.visible = false; }
	showModal (text = undefined) { if( text ) this.modal.model.text = text; this.modal.model.visible = true; }

	startRound (savedDeck = undefined) {
		this.logic.initDecks(savedDeck);
		this.redrawDecks();
		this.initHandlers();
	}

	initButtonHandlers () {
		let {game,logic} = this;
		this.buttons.get('Fullscreen').model.off('click').on('click', () => {
			if( Functions.isInFullScreen() ) 
				Functions.fullScreenCancel();
			else 
				Functions.fullScreen(document.querySelector('body'));
		});
		this.buttons.get('Undo').model.off('click').on('click', () => this.pool.undo() );
		this.buttons.get('Help').model.off('click').on('click', () => {
			if( !this.modal.model.visible ) 
				this.showModal(game.i18n.t('Rules'));
			else
				this.hideModal();
		});
		// Start new game and restart current game buttons
		this.buttons.get('StartGame').model.off('click').on('click', () => this.startRound() );
		// Restart current round
		this.buttons.get('RestartGame').model.off('click').on('click', () => {
			let savedDeck = undefined;
			let autosave = game.loadRound();
			if( autosave ) savedDeck = autosave.deck.slice(0);
			this.startRound(savedDeck);
		});
		this.buttons.get('SaveGame').model.off('click').on('click', () => {
			logic.saveTable();
		});
		this.buttons.get('LoadGame').model.off('click').on('click', () => {
			this.redrawGameObjects();
			this.initButtonHandlers();
			logic.loadTable();
			this.redrawDecks();
			this.initHandlers();
		});
	}

	initHandlers() {
		let {logic} = this;
		
		// Any card clicked
		this.cards.forEach(card => {
			card.model.off('click').on('click', () => {
				if( card.isShirted ) return true;
				if( !card.isOpened ) return true;
				if( card.score === 13 ) {
					logic.pool.add(logic.command('DropCards', card));
					return true;
				}
				else {
					let fitCard = logic.fitCard(card);
					if( fitCard ) logic.pool.add(logic.command('DropCards', fitCard, card));
					return true;
				}
			});
		})

		this.dealer.model.Deck.off('click').on('click', () => {
			logic.pool.add(logic.command('GetCardFromDealerDeck'));
			return true;
		});

		this.modal.model.off('click').on('click', () => { this.hideModal(); });
	}

	saveState () {
		console.log('Saving table state...')
		this.logic.saveTable();
	}
	restoreState () {
		console.log('Restoring table state...')
		this.logic.loadTable();
		this.redrawDecks();
		this.initHandlers();
	}

}