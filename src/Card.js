
import * as PIXI from 'pixi.js';
import Container from './base/Container';
import Deck from './PixiDeck.js';

export default class Card extends Container {

	/**
	 *
	 * @param suit - suit (can be s, c, h, or d) or suit+rank (s10 for spade ten, for example)
	 * @param [rank]
	 */
	constructor (suit, rank = undefined) {
		if( rank === undefined ) {
			suit = suit.toString().toLowerCase();
			let re = /^([schd]{1})([\dajqk]{1,2})$/;
			let result = re.exec(suit);
			suit = result[1];
			rank = result[2];
		}
		else {
			suit = suit.toString().toLowerCase();
			rank = rank.toString().toLowerCase();
		}
		this.suit = suit;
		this.rank = rank;
		this.score = this.getScore();
	}

	getScore () {
		return this.constructor.scores[this.rank];
	}

	getName () {
		return `${this.suit}${this.rank}`;
	}

	htmlsymbol () {
		let {suit, rank} = this;
		let cardSymbol = Deck.getCardSymbol(suit, rank);
		let htmlTag = `<div class="card suit-${suit}" \
			data-suit="${suit}" data-rank="${rank}" data-name="${this.getName()}" data-score="${this.getScore()}" \
			>${cardSymbol}</div>`;
		return htmlTag;
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
