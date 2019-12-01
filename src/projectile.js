import {getWorld} from './world.js';
import {getPlayer} from './player.js';
import {getBoss} from './boss.js';

var Projectiles = [];

export function updateProjectile(_)
{
  for (var i = 0; i < Projectiles.length; i++) {
    const pow = Math.abs(Projectiles[i].projectile.body.velocity.x);
    Projectiles[i].emitter.setSpeed(Math.sqrt(pow*70));
    if (pow < 100 || Projectiles[i].projectile.name == "dead")
    {
      Projectiles[i].destroy();
      Projectiles.splice(i, 1);
      i--;
    }
  }
}

export class Projectile {
  constructor(_, options){

    this.projectile = _.physics.add.sprite(options.x, options.y, options.assetBase);
    this.particles = _.add.particles(options.asset);
    this.emitter = this.particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    this.projectile.setVelocity(options.velocity, 0);
    this.projectile.setBounce(0.8);
    this.projectile.setCollideWorldBounds(true);
    this.projectile.setName("projectile");
    this.projectile.body.onCollide = true;
    this.projectile.body.onOverlap = true;
    this.emitter.startFollow(this.projectile);
    _.physics.add.collider(this.projectile, getWorld());
    _.physics.add.collider(this.projectile, getPlayer());
    _.physics.add.collider(this.projectile, getBoss());

    Projectiles.push(this);
  }
  destroy()
  {
    this.emitter.stop();
    this.projectile.destroy();
    setTimeout(this.particles.destroy, 1500);
  }
}
