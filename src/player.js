import player from './assets/player.png';
import green from './assets/green.png';
import green_base from './assets/green_base.png';

import {Projectile} from './projectile.js';
import {getBoss} from './boss.js';

export const MaxLife = 16;
const AttackTime = 1000;
const AttackAnimationTime = 200;
const RegenTimeBegin = 10000;
const RegenTime = 3000;
var Life;
var Regen;
var LastRegen = 0;
var LastDamage = -5000;
var Player;
var LastAttack = -AttackTime;

export function loadPlayer(_)
{
  _.load.image('green', green);
  _.load.image('green_base', green_base);
  _.load.spritesheet('player',
    player,
    { frameWidth: 6, frameHeight: 8 }
  );
}

export function createPlayer(_)
{
  Life = MaxLife;
  Regen = false;
  Player = _.physics.add.sprite(400, 200, 'player').setScale(10);
  Player.setName("player");

  // Physics
  Player.setBounce(0.25);
  Player.setCollideWorldBounds(true);

  // Animations
  _.anims.create({
    key: 'p_stand',
    frames: [ { key: 'player', frame: 0 } ],
    frameRate: 20
  });
  _.anims.create({
    key: 'p_left',
    frames: _.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1
  });
  _.anims.create({
    key: 'p_right',
    frames: _.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1
  });
  _.anims.create({
    key: 'p_jump',
    frames: [ { key: 'player', frame: 2 } ],
    frameRate: 20
  });
  _.anims.create({
    key: 'p_attack',
    frames: [ { key: 'player', frame: 3 } ],
    frameRate: 20
  });


  return Player;
}

function couldAttack(_)
{
  const Boss = getBoss();

  return (Math.abs(Boss.y - Player.y) < 50 && Math.abs(Boss.x - Player.x) > 20)
}

var lastDirection = false;
var distance = 0;
function gotDirection(_) // false=right, true=left
{
  const Boss = getBoss();

  if (distance < 50)
    distance = Math.random() * 400;

  if (couldAttack(_))
    return Boss.flipX;

  if (Math.abs(Boss.x - Player.x) < distance)
    return lastDirection;

  lastDirection = (Boss.x < Player.x);

  return lastDirection;
}


export function updatePlayer(_)
{
  var isAttacking = _.time.now - AttackTime <= LastAttack;
  var attackAnimation = _.time.now - AttackAnimationTime <= LastAttack;

  if ((Life <= MaxLife/4 || Regen) && _.time.now - RegenTimeBegin > LastDamage && _.time.now - RegenTime > LastRegen)
  {
    Life += 1;
    Regen = true;
    LastRegen = _.time.now;
    if (Life == MaxLife)
      Regen = false;
  }

  if (_.time.now - LastDamage < 1499)
  {
    const on = (((_.time.now - LastDamage) % 500) < 250);
    if (on)
      Player.setTint("0xff3333");
    else
      Player.setTint("0xffffff");
  }

  if (gotDirection())
  {
    Player.setVelocityX(-140);
    Player.setFlipX(true);
    Player.anims.play('p_left', true);
  }
  else
  {
    Player.setVelocityX(140);
    Player.setFlipX(false);
    Player.anims.play('p_right', true);
  }

  if (couldAttack(_) || attackAnimation)
  {
    Player.anims.play('p_attack');
    if (!isAttacking)
    {
      new Projectile(_, {
        x: Player.x + (Player.flipX ? -1 : 1) * 50,
        y: Player.y + 25,
        asset: 'green',
        assetBase: 'green_base',
        velocity: 500 * (Player.flipX ? -1 : 1)
      });
      LastAttack = _.time.now;
    }
  }
  else if (Player.body.deltaY() < -2)
  {
    Player.anims.play('p_jump');
  }

  if (Player.body.touching.down)
    Player.setVelocityY(-420);
}

export function getPlayer()
{
  return Player;
}

export function getLife()
{
  return Life;
}

export function setLife(life)
{
  Life = life;
}

export function getLifeRegen()
{
  return Regen;
}

export function damage(_, damage)
{
  Regen = false;
  Life -= damage;
  LastDamage = _.time.now;
}
