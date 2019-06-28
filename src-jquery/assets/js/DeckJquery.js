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

	getCards (deckArray = undefined) {
		let htmlCards = [];
		let cards = [];
		if( deckArray === undefined ) {
			cards = Object.keys(Deck.cards);
			cards = ShuffleArray.knuthShuffle(cards);
		}
		else {
			cards = deckArray.slice(0);
		}

		for( const cardname of cards )
			htmlCards.push(new CardJquery(cardname));

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
