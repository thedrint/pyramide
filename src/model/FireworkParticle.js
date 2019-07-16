
import * as PIXI from 'pixi.js';

export default class FireworkParticle {
	constructor(texture, scale) {
		this.texture = texture;
		this.sprite = new PIXI.Sprite(this.texture);
		this.scale = scale;
		this.sprite.scale.x = this.scale;
		this.sprite.scale.y = this.scale;
		this.velocity = {x: 0, y: 0};
		this.explodeHeight = 0.4 + Math.random()*0.5;
	}
	
	reset(texture, scale) {
		this.sprite.alpha = 1;
		this.sprite.scale.x = scale;
		this.sprite.scale.y = scale;
		this.sprite.texture = texture;
		this.velocity.x = 0;
		this.velocity.y = 0;
		this.toExplode = false;
		this.exploded = false;
		this.fade = false;
	}
	
	setPosition(pos) {
		this.sprite.position.x = pos.x;
		this.sprite.position.y = pos.y;
	}
	
	setVelocity(vel) { this.velocity = vel; }
	
	update() {
		this.sprite.position.x += this.velocity.x;
		this.sprite.position.y += this.velocity.y;
		this.velocity.y += this.miniscene.gravity;
		if (this.toExplode && !this.exploded) {
			// explode
			if (this.sprite.position.y < this.miniscene.height*this.explodeHeight) {
				this.sprite.alpha = 0;
				this.exploded = true;
				this.miniscene.explode(this.sprite.position, this.sprite.texture, this.sprite.scale.x);
			}
		}
		
		if (this.fade) {
			this.sprite.alpha -= 0.01;
		}
	}
}
