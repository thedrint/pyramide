
import * as PIXI from 'pixi.js';
import IntersectHelper from './IntersectHelper';
import Utils from './Utils';
import Colors from './Colors';
import Container from './base/Container';
import Deck from './Deck';

import {Unit as UnitSettings, Defaults} from './Settings';

export default class Card extends Container {

	/**
	 *
	 * @param suit - suit (can be s, c, h, or d) or suit+rank (s10 for spade ten, for example)
	 * @param [rank]
	 */
	constructor (suitrank, settings = Defaults.Card) {
		super(settings);
		this.interactive = true;
		this.buttonMode = true;

		suitrank = suitrank.toString().toLowerCase();
		let re = /^([schd]{1})([\dajqk]{1,2})$/;
		let result = re.exec(suitrank);
		let suit = result[1];
		let rank = result[2];

		this.suit = suit;
		this.rank = rank;
		this._name = `${this.suit}${this.rank}`;
		this._score = this.constructor.scores[this.rank];
		
		let { attrs } = settings;
		this.attrs = Utils.cleanOptionsObject(attrs, Defaults.Card.attrs);
	}

	initModel (model = Defaults.Card.model) {
		let params = Utils.cleanOptionsObject(model, Defaults.Card.model);
		let models = [];
		let loader = PIXI.Loader.shared;
		// let modelWidth = params.size * UnitSettings.size;
		let modelWidth = this.scene.cardWidth;
		let modelHeight;
		let resName = `Card_${this.name}`;

		let res, baseTexture, svgTexture;
		res = loader.resources[resName];
		if( res.svgBaseTexture ) {
			console.log(res.svgBaseTexture);
			baseTexture = res.svgBaseTexture;
		}
		else
			baseTexture = res.texture.baseTexture;
		let resource = baseTexture.resource;
		// console.log(baseTexture);
		modelHeight = resource.height * modelWidth/resource.width;
		console.log(resource.width, resource.height, modelWidth, modelHeight);
		baseTexture.scaleMode =  PIXI.SCALE_MODES.NEAREST;// No need it for good-scaled svg.
		baseTexture.setSize(modelWidth, modelHeight);
		let faceTexture = new PIXI.Texture(baseTexture);
		let face = PIXI.Sprite.from(faceTexture);
		face.name = `Face`;
		models.push(face);

		resName = `Shirt`;
		res = loader.resources[resName];
		if( res.svgTexture ) 
			baseTexture = res.svgBaseTexture;
		else
			baseTexture = res.texture.baseTexture;
		baseTexture.setSize(modelWidth, modelHeight);
		let shirtTexture = new PIXI.Texture(baseTexture);
		let shirt = PIXI.Sprite.from(shirtTexture);
		shirt.name = `Shirt`;
		shirt.visible = false;
		models.push(shirt);

		// let border = new PIXI.Graphics();
		// border.clear();
		// border.lineStyle(2, Colors.black, 0.8);
		// border.drawShape(new PIXI.RoundedRectangle(0, 0, modelWidth, modelHeight, modelWidth*0.1));
		// border.name = `Border`;
		// models.push(border);

		this.addChild(...models);
		// this.pivot.x += 0;
		// this.pivot.y += 0;

		this.shape = new IntersectHelper.Rectangle(this);
		// this.cacheAsBitmap = true;
	}

	showFace () {
		this.face.visible = true;
		this.shirt.visible = false;
	}
	showShirt () {
		this.shirt.visible = true;
		this.face.visible = false;
	}

	get score () { return this._score; }
	get name  () { return this._name; }
	get model () { return this.getChildByName('Face'); }
	get face () { return this.getChildByName('Face'); }
	get shirt () { return this.getChildByName('Shirt'); }

	get isShirted () { return this.shirt.visible; }
	get inSlot () { return this.attrs.slot; }
	isOpened (from) { return this.scene.app.game.isCardOpened(from); }

	get symbol () {
		let {suit, rank} = this;
		return Deck.getCardSymbol(suit, rank);
	}

	htmlimg () {
		let {suit, rank} = this;
		let htmlTag = `<div class="card img" \
			data-suit="${suit}" data-rank="${rank}" data-name="${this.getName()}" data-score="${this.getScore()}" >\
				<img src="./assets/img/decks/atlas/${this.filename()}"> \
			</div>`;
		return $(htmlTag);
	}

	filename () {
		let {suit, rank} = this;
		let suitname = this.constructor.suitmap[suit];
		let rankname = this.constructor.rankmap[rank];
		return `Atlas_deck_${rankname}_of_${suitname}.svg`;
	}

	static get suitmap () {
		return {
			s: 'spades',
			h: 'hearts',
			d: 'diamonds',
			c: 'clubs',
		};
	}

	static get rankmap () {
		return {
			a:  'ace',
			2:  '2',
			3:  '3',
			4:  '4',
			5:  '5',
			6:  '6',
			7:  '7',
			8:  '8',
			9:  '9',
			10: '10',
			j:  'jack',
			q:  'queen',
			k:  'king',
		};
	}

	static get scores () {
		return {
			a:  1,
			2:  2,
			3:  3,
			4:  4,
			5:  5,
			6:  6,
			7:  7,
			8:  8,
			9:  9,
			10: 10,
			j:  11,
			q:  12,
			k:  13,
		};
	}
}
