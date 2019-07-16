
import Card from './../../Card';

let Textures = {};

const buttonTexturePack = [
	['Fullscreen'   , './fullscreen.svg'         ],
	['Help'         , './help.svg'               ],
	['ModalBorder'  , './modal-border.svg'       ],
	['RestartGame'  , './restart-game.svg'       ],
	['StartGame'    , './start-game.svg'         ],
	['Undo'         , './undo.svg'               ],
	['SaveGame'     , './save.svg'               ],
	['LoadGame'     , './load.svg'               ],
	['Table'        , './tables/green-table.jpg' ],
	['Shirt'        , './decks/atlas/Atlas_deck_card_back_blue_and_brown.svg'  ],
];

const atlasTexturePack = [];
for( let rank in Card.rankmap ) {
	for( let suit in Card.suitmap ) {
		let url = `./decks/atlas/Atlas_deck_${Card.rankmap[rank]}_of_${Card.suitmap[suit]}.svg`;
		let name = `Card_${suit}${rank}`;
		atlasTexturePack.push([name,url]);
	}
}

const fireworksTexturePack = [];
for( let i = 1; i < 10; i++ ) {
	let url = `./fireworks/rp-${i}.png`;
	let name = `rp${i}`;
	fireworksTexturePack.push([name,url]);
}

Textures = [].concat(buttonTexturePack, atlasTexturePack, fireworksTexturePack);
// let promises = [];
// [].concat(buttonTexturePack, atlasTexturePack).forEach(v=>{
// 	let [name,url] = v;
// 	//ALERT: Very important to use webpackMode:"eager" to dynamically imported resources. But i don't know why:)
// 	let p = import(/*webpackMode:"eager"*/`${url}`)
// 		.then(m=>{return [name,m.default]})
// 		.catch(e=>console.error(e));
// 	promises.push(p);
// });
// Promise.all(promises)
// 	.then(vals=>{Textures = vals.reduce((a,v)=>{a[v[0]]=v[1];return a},{})})
// 	.catch(e=>console.error(e));
export {Textures};
