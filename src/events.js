import {damage as damagePlayer} from './player.js';
import {damage as damageBoss} from './boss.js';

function collide(gameObject1, gameObject2, body1, body2) {
  if (gameObject1.name == "projectile" && gameObject2.name != ""
      || gameObject2.name == "projectile" && gameObject1.name != "")
  {
    const Projectile = gameObject1.name == "projectile" ? body1 : body2;
    const Target = gameObject1.name == "projectile" ? body2 : body1;
    const isPlayer = Target.gameObject.name == "player";
    const isBoss = Target.gameObject.name == "boss";
    const pow = Math.abs(Projectile.velocity.x);
    const damage = Math.round(Math.sqrt(pow)/2);
    if (isPlayer)
      damagePlayer(this, damage)
    if (isBoss)
      damageBoss(this, damage)
    if (gameObject1.name == "projectile")
      gameObject1.setName("dead");
    if (gameObject2.name == "projectile")
      gameObject1.setName("dead");
  }
}

export function createEvent(_)
{
  _.physics.world.on('collide', collide.bind(_))
  _.physics.world.on('overlap', collide.bind(_))
}
