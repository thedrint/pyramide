import GuiJquery from './GuiJquery.js';

export default class Gui {
	constructor (type, gameObject) {
		switch( type ) {
			default:
				return new GuiJquery(gameObject);
				break;
		}
	}
}