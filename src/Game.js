
import Application from './Application';

import i18next from 'i18next';
import i18nextXhrBackend from 'i18next-xhr-backend';
import i18nextBrowserLanguagedetector from 'i18next-browser-languagedetector';

export default class Game {

	constructor (options) {
	
		this.storage = localStorage;

		this.i18n = i18next;
		this.i18n
			.use(i18nextBrowserLanguagedetector)
			.use(i18nextXhrBackend)
			.init({
				fallbackLng: 'ru',
				lng: 'ru',
				ns: ['common'],
				defaultNS: 'common',
				backend: {
					// load from i18next-gitbook repo
					loadPath: './locales/{{lng}}/{{ns}}.json',
					crossDomain: true,
				}
			});

		this.app = new Application(options);
		this.app.game = this;
	}

	static playGame(options) {
		let game = new Game(options);
		game.app.init();
		game.app.start();
	}

	saveRound (autosave = undefined) {
		if( autosave === undefined ) autosave = { deck: Object.keys(this.cardRegistry) };
		this.storage.setItem('autosave', JSON.stringify(autosave));
		return true;
	}

	loadRound () { return JSON.parse(this.storage.getItem('autosave')); }

	stopGame () { this.app.stop(); }
}
