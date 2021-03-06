
import IEventEmitter from './base/IEventEmitter';

import Utils from './Utils';
import Deck from './Deck';

import { Defaults } from './Settings';
import CardModel from './model/Card';

export default class Card extends IEventEmitter {
	/**
	 * @param suitrank (s10 for spade ten, for example)
	 */
	constructor (suitrank, settings = Defaults.Card) {
		super();
		this.settings = Utils.cleanOptionsObject(settings, Defaults.Card);

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
		this._row = undefined;
		this._index = undefined;
		this._from = undefined;
		this._where = undefined;
	}

	initLogic (logic) { this.logic = logic; }
	initModel (scene) { this.model = new CardModel(this, scene); }

	get score     ()      { return this._score; }
	get name      ()      { return this._name; }
	get isShirted ()      { return this.model.shirt.visible; }
	get inSlot    ()      { return this.attrs.slot; }
	get isOpened  ()      { return this.logic.isCardOpened(this); }
	get row       ()      { return this._row; }
	get index     ()      { return this._index; }
	set row       (row)   { this._row = row; }
	set index     (index) { this._index = index; }
	get from      ()      { return this._from; }
	set from      (from)  { this._from = from; }
	get where     ()      { return this._where; }
	set where     (where) { this._where = where; }

	get symbol () { return Deck.getCardSymbol(this.suit, this.rank); }

	filename () {
		return `Atlas_deck_${this.constructor.rankmap[this.rank]}_of_${this.constructor.suitmap[this.suit]}.svg`;
	}

	static getRankByScore (score) {
		return Utils.getKeyByValue(this.scores, score);
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
