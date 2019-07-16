
import * as PIXI from 'pixi.js';
import Container from './../base/Container';
import Colors from './../Colors';
import FireworkParticle from './FireworkParticle';

export default class WinnerModel extends Container {

	constructor (scene) {
		super();
		this.scene = scene;
		this.logic = scene.logic;
		this.name = 'WinnerMiniScene';
		this.textures = [];
		this.currentTexture = 0;
		this.particles = [];
		this.gravity = 0.01;
		this.init();
	}

	init () {
		let params = this.settings.model;
		for (let i = 1; i < 10; i++) this.textures.push(this.scene.app.textures[`rp${i}`]);

		this.interactive = true;
		this.hitArea = new PIXI.Rectangle(0,0,this.scene.app.screen.width,this.scene.app.screen.height);
		this.zIndex = 999;

		let back = new PIXI.Graphics();
		back.beginFill(Colors.black, 0.2);
		back.drawShape(this.hitArea);
		this.addChild(back);
	}

	getParticle (texture, scale) {
		// get the first particle that has been used
		let particle;
		// check for a used particle (alpha <= 0)
		for (var i = 0, l = this.particles.length; i < l; i++) {
			if (this.particles[i].sprite.alpha <= 0) {
				particle = this.particles[i];
				break;
			}
		}
		// update characteristics of particle
		if( particle ) {
			particle.reset(texture, scale);
			return particle;
		}
		
		// otherwise create a new particle
		particle = new FireworkParticle(texture, scale);
		this.particles.push(particle);
		this.addChild(particle.sprite);
		particle.miniscene = this;
		return particle;
	}

	explode (position, texture, scale) {
		const steps = 8 + Math.round(Math.random()*6);
		const radius = 2 + Math.random()*4;
		for (let i = 0; i < steps; i++) {
			// get velocity
			const x = radius * Math.cos(2 * Math.PI * i / steps);
			const y = radius * Math.sin(2 * Math.PI * i / steps);
			// add particle
			const particle = this.getParticle(texture, scale);
			particle.fade = true;
			particle.setPosition(position);
			particle.setVelocity({x, y});
		}
	}

	launchParticle () {
		const particle = this.getParticle(this.textures[this.currentTexture], Math.random()*0.5);
		this.currentTexture++;
		if( this.currentTexture > 9 ) this.currentTexture = 0;
		particle.setPosition({x: Math.random()*this.scene.app.screen.width, y: this.scene.app.screen.height});
		const speed = this.scene.app.screen.height*0.01;
		particle.setVelocity({x: -speed/2 + Math.random()*speed, y: -speed + Math.random()*-1});
		particle.toExplode = true;
	 
		// launch a new particle
		setTimeout(() => {this.launchParticle()}, 200+Math.random()*600);
	}
}