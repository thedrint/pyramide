import $ from 'jquery';
import Card from './Card.js';
import Deck from './DeckJquery.js';

export default class CardJquery extends Card {

	/**
	 *
	 * @param suit - suit (can be s, c, h, or d) or suit+rank (s10 for spade ten, for example)
	 * @param [rank]
	 */
	constructor (suit, rank = undefined) {
		super(suit, rank);
	}

	htmlsymbol () {
		let {suit, rank} = this;
		let cardSymbol = Deck.getCardSymbol(suit, rank);
		let htmlTag = `<div class="card suit-${suit}" \
			data-suit="${suit}" data-rank="${rank}" data-name="${this.getName()}" data-score="${this.getScore()}" \
			>${cardSymbol}</div>`;
		return $(htmlTag);
	}

	htmlimg () {
		let {suit, rank} = this;
		let htmlTag = `<div class="card img" \
			data-suit="${suit}" data-rank="${rank}" data-name="${this.getName()}" data-score="${this.getScore()}" >\
				<img src="./src/decks/atlas/${this.filename()}"> \
			</div>`;
		return $(htmlTag);
	}

	filename () {
		let {suit, rank} = this;
		let suitname = Card.suitmap[suit];
		let rankname = Card.rankmap[rank];
		return `Atlas_deck_${rankname}_of_${suitname}.svg`;
	}

}
