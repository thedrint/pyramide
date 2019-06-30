
import * as PIXI from 'pixi.js';
import IntersectHelper from './IntersectHelper';
import Utils from './Utils';
import Container from './base/Container';
import Deck from './Deck';

import {Unit as UnitSettings, Defaults} from './Settings';

export default class Card extends Container {

	/**
	 *
	 * @param suit - suit (can be s, c, h, or d) or suit+rank (s10 for spade ten, for example)
	 * @param [rank]
	 */
	constructor (suitrank) {
		super();
		this.interactive = true;

		suitrank = suitrank.toString().toLowerCase();
		let re = /^([schd]{1})([\dajqk]{1,2})$/;
		let result = re.exec(suitrank);
		let suit = result[1];
		let rank = result[2];

		this.suit = suit;
		this.rank = rank;
		this.attrs = {};
		this._name = `${this.suit}${this.rank}`;
		this._score = this.constructor.scores[this.rank];

		this.initModel();
	}

	initModel (model = Defaults.Card.model) {
		let params = Utils.cleanOptionsObject(model, Defaults.Card.model);
		let models = [];
		let loader = PIXI.Loader.shared;
		let modelWidth = params.size * UnitSettings.size;
		let resName = `Card_${this.name}`;

		let res = loader.resources[resName].texture.baseTexture.resource;
		let svgTexture = PIXI.BaseTexture.from(res);
		svgTexture.setSize(modelWidth, res.height * modelWidth/res.width);
		let faceTexture = new PIXI.Texture(svgTexture);
		let face = PIXI.Sprite.from(faceTexture);
		// crate.anchor.set(0.5);
		// crate.x -= crateWidth/2;
		// crate.y -= crateHeight/2;
		// crate.pivot.x = 0.5 * crate.width;
		// crate.pivot.y = 0.5 * crate.height;
		// crate.angle = 45;
		face.name = `Face`;
		models.push(face);

		resName = `Shirt`;
		res = loader.resources[resName].texture.baseTexture.resource;
		svgTexture = PIXI.BaseTexture.from(res);
		svgTexture.setSize(modelWidth, res.height * modelWidth/res.width);
		let shirtTexture = new PIXI.Texture(svgTexture);
		let shirt = PIXI.Sprite.from(shirtTexture);
		// crate.anchor.set(0.5);
		// crate.x -= crateWidth/2;
		// crate.y -= crateHeight/2;
		// crate.pivot.x = 0.5 * crate.width;
		// crate.pivot.y = 0.5 * crate.height;
		// crate.angle = 45;
		shirt.name = `Shirt`;
		shirt.visible = false;
		models.push(shirt);

		this.addChild(...models);
		// this.pivot.x += 0;
		// this.pivot.y += 0;

		this.shape = new IntersectHelper.Rectangle(this);
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
