let width = window.innerWidth;
let height = window.innerHeight;
const renderer = PIXI.autoDetectRenderer(width, height, {
  transparent: true
});
const stage = new PIXI.Container();
document.body.appendChild(renderer.view);
const textures = [];
let currentTexture = 0;
const particles = [];
const gravity = 0.03;

const initTextures = () => {
  for (let i = 0; i < 10; i++) {
    textures.push(PIXI.Texture.fromImage(`https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/rp-${i}.png?123`));
  }
}

const getParticle = (texture, scale) => {
  // get the first particle that has been used
  let particle;
  // check for a used particle (alpha <= 0)
  for (var i = 0, l = particles.length; i < l; i++) {
    if (particles[i].sprite.alpha <= 0) {
      particle = particles[i];
      break;
    }
  }
  // update characteristics of particle
  if (particle) {
    particle.reset(texture, scale);
    return particle;
  }
  
  // otherwise create a new particle
  particle = new Particle(texture, scale);
  particles.push(particle);
  stage.addChild(particle.sprite);
  return particle;
}

class Particle {
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
  
  setVelocity(vel) {
    this.velocity = vel;
  }
  
  update() {
    this.sprite.position.x += this.velocity.x;
    this.sprite.position.y += this.velocity.y;
    this.velocity.y += gravity;
    if (this.toExplode && !this.exploded) {
      // explode
      if (this.sprite.position.y < height*this.explodeHeight) {
        this.sprite.alpha = 0;
        this.exploded = true;
        explode(this.sprite.position, this.sprite.texture, this.sprite.scale.x);
      }
    }
    
    if (this.fade) {
      this.sprite.alpha -= 0.01;
    }
  }
}

const explode = (position, texture, scale) => {
  const steps = 8 + Math.round(Math.random()*6);
  const radius = 2 + Math.random()*4;
  for (let i = 0; i < steps; i++) {
    // get velocity
    const x = radius * Math.cos(2 * Math.PI * i / steps);
    const y = radius * Math.sin(2 * Math.PI * i / steps);
    // add particle
    const particle = getParticle(texture, scale);
    particle.fade = true;
    particle.setPosition(position);
    particle.setVelocity({x, y});
  }
}

const launchParticle = () => {
  const particle = getParticle(textures[currentTexture], Math.random()*0.5);
  currentTexture++;
  if (currentTexture > 9) currentTexture = 0;
  particle.setPosition({x: Math.random()*width, y: height});
  const speed = height*0.01;
  particle.setVelocity({x: -speed/2 + Math.random()*speed, y: -speed + Math.random()*-1});
  particle.toExplode = true;
 
  // launch a new particle
  setTimeout(launchParticle, 200+Math.random()*600);
}

const loop = () => {
  requestAnimationFrame(loop);
  for (var i = 0, l = particles.length; i < l; i++) {
    particles[i].update();  
  }
  renderer.render(stage);
}

const onResize = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.view.style.width = width + "px";    
  renderer.view.style.height = height + "px";   
  renderer.resize(width,height);
}

initTextures();
launchParticle();
loop();

window.addEventListener('resize', onResize);
