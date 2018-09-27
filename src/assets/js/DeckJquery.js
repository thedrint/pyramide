import $ from "jquery";
import Deck from './Deck.js';
import CardJquery from './CardJquery.js';
import ShuffleArray from './utils/knuthShuffle.js';

export default class DeckJquery extends Deck {
	constructor () {
		super();
	}

	static getCardSymbol (suit, rank) {
		let cardKey = suit.toString().toLowerCase() + rank.toString().toLowerCase();
		return Deck.cards[cardKey];
	}

	getCards () {
		let htmlCards = [];
		let cards = Object.keys(DeckJquery.cards);
		cards = ShuffleArray.knuthShuffle(cards);

		for( let i in cards ) {
			let card = new CardJquery(cards[i]);
			htmlCards.push(card);
		}

		return htmlCards;
	}

	static shirtimg () {
		let htmlTag = `<div class="card img shirt">\
			<img src="./assets/img/decks/atlas/Atlas_deck_card_back_blue_and_brown.svg"></div>`;
		return $(htmlTag);
	}
	static shirtsymbol () {
		let symbol = '&#x01F0A0';
		let htmlTag = `<div class="card symbol">${symbol}</div>`;
		return $(htmlTag);
	}

}
