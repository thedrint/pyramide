
export default class Card {

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
		return Card.scores[this.rank];
	}

	getName () {
		return `${this.suit}${this.rank}`;
	}
}

Card.suitmap = {
	s: 'spades',
	h: 'hearts',
	d: 'diamonds',
	c: 'clubs',
};

Card.rankmap = {
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

Card.scores = {
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