import Card from './Card.js';
import Chance from 'chance';

export default class Deck {
	constructor () {
		this.chance = new Chance();
	}

	static getCardSymbol (suit, rank) {
		let cardKey = suit.toString().toLowerCase() + rank.toString().toLowerCase();
		return Deck.cards[cardKey];
	}

	getCards () {
		let htmlCards = [];
		let cards = Object.keys(Deck.cards);
		cards = this.chance.shuffle(cards);

		for( let i in cards ) {
			let card = new Card(cards[i]);
			htmlCards.push(card);
		}

		return htmlCards;
	}
}

Deck.cards = {
	// spades
	"sa":  '&#x01F0A1',
	"s2":  '&#x01F0A2',
	"s3":  '&#x01F0A3',
	"s4":  '&#x01F0A4',
	"s5":  '&#x01F0A5',
	"s6":  '&#x01F0A6',
	"s7":  '&#x01F0A7',
	"s8":  '&#x01F0A8',
	"s9":  '&#x01F0A9',
	"s10": '&#x01F0AA',
	"sj":  '&#x01F0AB',
	"sq":  '&#x01F0AD',
	"sk":  '&#x01F0AE',
	// hearts
	"ha":  '&#x01F0B1',
	"h2":  '&#x01F0B2',
	"h3":  '&#x01F0B3',
	"h4":  '&#x01F0B4',
	"h5":  '&#x01F0B5',
	"h6":  '&#x01F0B6',
	"h7":  '&#x01F0B7',
	"h8":  '&#x01F0B8',
	"h9":  '&#x01F0B9',
	"h10": '&#x01F0BA',
	"hj":  '&#x01F0BB',
	"hq":  '&#x01F0BD',
	"hk":  '&#x01F0BE',
	// diamonds
	"da":  '&#x01F0C1',
	"d2":  '&#x01F0C2',
	"d3":  '&#x01F0C3',
	"d4":  '&#x01F0C4',
	"d5":  '&#x01F0C5',
	"d6":  '&#x01F0C6',
	"d7":  '&#x01F0C7',
	"d8":  '&#x01F0C8',
	"d9":  '&#x01F0C9',
	"d10": '&#x01F0CA',
	"dj":  '&#x01F0CB',
	"dq":  '&#x01F0CD',
	"dk":  '&#x01F0CE',
	// clubs
	"ca":  '&#x01F0D1',
	"c2":  '&#x01F0D2',
	"c3":  '&#x01F0D3',
	"c4":  '&#x01F0D4',
	"c5":  '&#x01F0D5',
	"c6":  '&#x01F0D6',
	"c7":  '&#x01F0D7',
	"c8":  '&#x01F0D8',
	"c9":  '&#x01F0D9',
	"c10": '&#x01F0DA',
	"cj":  '&#x01F0DB',
	"cq":  '&#x01F0DD',
	"ck":  '&#x01F0DE',
};