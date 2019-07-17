
// import Card from './../../Card';

let Textures = {};

// const buttonTexturePack = [
// 	['Fullscreen'   , './fullscreen.svg'         ],
// 	['Help'         , './help.svg'               ],
// 	['ModalBorder'  , './modal-border.svg'       ],
// 	['RestartGame'  , './restart-game.svg'       ],
// 	['StartGame'    , './start-game.svg'         ],
// 	['Undo'         , './undo.svg'               ],
// 	['SaveGame'     , './save.svg'               ],
// 	['LoadGame'     , './load.svg'               ],
// 	['Table'        , './tables/green-table.jpg' ],
// 	['Shirt'        , './decks/atlas/Atlas_deck_card_back_blue_and_brown.svg'  ],
// ];

// const atlasTexturePack = [];
// for( let rank in Card.rankmap ) {
// 	for( let suit in Card.suitmap ) {
// 		let url = `./decks/atlas/Atlas_deck_${Card.rankmap[rank]}_of_${Card.suitmap[suit]}.svg`;
// 		let name = `Card_${suit}${rank}`;
// 		atlasTexturePack.push([name,url]);
// 	}
// }

// const fireworksTexturePack = [];
// for( let i = 1; i < 10; i++ ) {
// 	let url = `./fireworks/rp-${i}.png`;
// 	let name = `rp${i}`;
// 	fireworksTexturePack.push([name,url]);
// }

// Textures = [].concat(buttonTexturePack, atlasTexturePack, fireworksTexturePack);
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

import Fullscreen   from './fullscreen.svg'         
import Help         from './help.svg'               
import ModalBorder  from './modal-border.svg'       
import RestartGame  from './restart-game.svg'       
import StartGame    from './start-game.svg'         
import Undo         from './undo.svg'               
import SaveGame     from './save.svg'               
import LoadGame     from './load.svg'               
import Table        from './tables/green-table.jpg' 
import Shirt        from './decks/atlas/Atlas_deck_card_back_blue_and_brown.svg'
import Card_sa      from './decks/atlas/Atlas_deck_ace_of_spades.svg'
import Card_ca      from './decks/atlas/Atlas_deck_ace_of_clubs.svg'
import Card_da      from './decks/atlas/Atlas_deck_ace_of_diamonds.svg'
import Card_ha      from './decks/atlas/Atlas_deck_ace_of_hearts.svg'
import Card_s2      from './decks/atlas/Atlas_deck_2_of_spades.svg'
import Card_c2      from './decks/atlas/Atlas_deck_2_of_clubs.svg'
import Card_d2      from './decks/atlas/Atlas_deck_2_of_diamonds.svg'
import Card_h2      from './decks/atlas/Atlas_deck_2_of_hearts.svg'
import Card_s3      from './decks/atlas/Atlas_deck_3_of_spades.svg'
import Card_c3      from './decks/atlas/Atlas_deck_3_of_clubs.svg'
import Card_d3      from './decks/atlas/Atlas_deck_3_of_diamonds.svg'
import Card_h3      from './decks/atlas/Atlas_deck_3_of_hearts.svg'
import Card_s4      from './decks/atlas/Atlas_deck_4_of_spades.svg'
import Card_c4      from './decks/atlas/Atlas_deck_4_of_clubs.svg'
import Card_d4      from './decks/atlas/Atlas_deck_4_of_diamonds.svg'
import Card_h4      from './decks/atlas/Atlas_deck_4_of_hearts.svg'
import Card_s5      from './decks/atlas/Atlas_deck_5_of_spades.svg'
import Card_c5      from './decks/atlas/Atlas_deck_5_of_clubs.svg'
import Card_d5      from './decks/atlas/Atlas_deck_5_of_diamonds.svg'
import Card_h5      from './decks/atlas/Atlas_deck_5_of_hearts.svg'
import Card_s6      from './decks/atlas/Atlas_deck_6_of_spades.svg'
import Card_c6      from './decks/atlas/Atlas_deck_6_of_clubs.svg'
import Card_d6      from './decks/atlas/Atlas_deck_6_of_diamonds.svg'
import Card_h6      from './decks/atlas/Atlas_deck_6_of_hearts.svg'
import Card_s7      from './decks/atlas/Atlas_deck_7_of_spades.svg'
import Card_c7      from './decks/atlas/Atlas_deck_7_of_clubs.svg'
import Card_d7      from './decks/atlas/Atlas_deck_7_of_diamonds.svg'
import Card_h7      from './decks/atlas/Atlas_deck_7_of_hearts.svg'
import Card_s8      from './decks/atlas/Atlas_deck_8_of_spades.svg'
import Card_c8      from './decks/atlas/Atlas_deck_8_of_clubs.svg'
import Card_d8      from './decks/atlas/Atlas_deck_8_of_diamonds.svg'
import Card_h8      from './decks/atlas/Atlas_deck_8_of_hearts.svg'
import Card_s9      from './decks/atlas/Atlas_deck_9_of_spades.svg'
import Card_c9      from './decks/atlas/Atlas_deck_9_of_clubs.svg'
import Card_d9      from './decks/atlas/Atlas_deck_9_of_diamonds.svg'
import Card_h9      from './decks/atlas/Atlas_deck_9_of_hearts.svg'
import Card_s10     from './decks/atlas/Atlas_deck_10_of_spades.svg'
import Card_c10     from './decks/atlas/Atlas_deck_10_of_clubs.svg'
import Card_d10     from './decks/atlas/Atlas_deck_10_of_diamonds.svg'
import Card_h10     from './decks/atlas/Atlas_deck_10_of_hearts.svg'
import Card_sj      from './decks/atlas/Atlas_deck_jack_of_spades.svg'
import Card_cj      from './decks/atlas/Atlas_deck_jack_of_clubs.svg'
import Card_dj      from './decks/atlas/Atlas_deck_jack_of_diamonds.svg'
import Card_hj      from './decks/atlas/Atlas_deck_jack_of_hearts.svg'
import Card_sq      from './decks/atlas/Atlas_deck_queen_of_spades.svg'
import Card_cq      from './decks/atlas/Atlas_deck_queen_of_clubs.svg'
import Card_dq      from './decks/atlas/Atlas_deck_queen_of_diamonds.svg'
import Card_hq      from './decks/atlas/Atlas_deck_queen_of_hearts.svg'
import Card_sk      from './decks/atlas/Atlas_deck_king_of_spades.svg'
import Card_ck      from './decks/atlas/Atlas_deck_king_of_clubs.svg'
import Card_dk      from './decks/atlas/Atlas_deck_king_of_diamonds.svg'
import Card_hk      from './decks/atlas/Atlas_deck_king_of_hearts.svg'
import rp1          from './fireworks/rp-1.png'
import rp2          from './fireworks/rp-2.png'
import rp3          from './fireworks/rp-3.png'
import rp4          from './fireworks/rp-4.png'
import rp5          from './fireworks/rp-5.png'
import rp6          from './fireworks/rp-6.png'
import rp7          from './fireworks/rp-7.png'
import rp8          from './fireworks/rp-8.png'
import rp9          from './fireworks/rp-9.png'

Textures = {
Fullscreen  : Fullscreen  ,
Help        : Help        ,
ModalBorder : ModalBorder ,
RestartGame : RestartGame ,
StartGame   : StartGame   ,
Undo        : Undo        ,
SaveGame    : SaveGame    ,
LoadGame    : LoadGame    ,
Table       : Table       ,
Shirt       : Shirt       ,
Card_sa     : Card_sa     ,
Card_ca     : Card_ca     ,
Card_da     : Card_da     ,
Card_ha     : Card_ha     ,
Card_s2     : Card_s2     ,
Card_c2     : Card_c2     ,
Card_d2     : Card_d2     ,
Card_h2     : Card_h2     ,
Card_s3     : Card_s3     ,
Card_c3     : Card_c3     ,
Card_d3     : Card_d3     ,
Card_h3     : Card_h3     ,
Card_s4     : Card_s4     ,
Card_c4     : Card_c4     ,
Card_d4     : Card_d4     ,
Card_h4     : Card_h4     ,
Card_s5     : Card_s5     ,
Card_c5     : Card_c5     ,
Card_d5     : Card_d5     ,
Card_h5     : Card_h5     ,
Card_s6     : Card_s6     ,
Card_c6     : Card_c6     ,
Card_d6     : Card_d6     ,
Card_h6     : Card_h6     ,
Card_s7     : Card_s7     ,
Card_c7     : Card_c7     ,
Card_d7     : Card_d7     ,
Card_h7     : Card_h7     ,
Card_s8     : Card_s8     ,
Card_c8     : Card_c8     ,
Card_d8     : Card_d8     ,
Card_h8     : Card_h8     ,
Card_s9     : Card_s9     ,
Card_c9     : Card_c9     ,
Card_d9     : Card_d9     ,
Card_h9     : Card_h9     ,
Card_s10    : Card_s10    ,
Card_c10    : Card_c10    ,
Card_d10    : Card_d10    ,
Card_h10    : Card_h10    ,
Card_sj     : Card_sj     ,
Card_cj     : Card_cj     ,
Card_dj     : Card_dj     ,
Card_hj     : Card_hj     ,
Card_sq     : Card_sq     ,
Card_cq     : Card_cq     ,
Card_dq     : Card_dq     ,
Card_hq     : Card_hq     ,
Card_sk     : Card_sk     ,
Card_ck     : Card_ck     ,
Card_dk     : Card_dk     ,
Card_hk     : Card_hk     ,
rp1         : rp1         ,
rp2         : rp2         ,
rp3         : rp3         ,
rp4         : rp4         ,
rp5         : rp5         ,
rp6         : rp6         ,
rp7         : rp7         ,
rp8         : rp8         ,
rp9         : rp9         ,
};

export {Textures};
