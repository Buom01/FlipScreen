import boss from './assets/boss.png';
import red from './assets/red.png';
import red_base from './assets/red_base.png';
import {Projectile} from './projectile.js';

export const MaxLife = 16;
const AttackTime = 1000;
const AttackAnimationTime = 200;
var Life;
var Regen;
var LastDamage = -5000;
var Boss;
var Cursors;
var LastAttack = -AttackTime;

export function loadBoss(_)
{
  _.load.image('red', red);
  _.load.image('red_base', red_base);
  _.load.spritesheet('boss',
    boss,
    { frameWidth: 9, frameHeight: 16 }
  );
}

export function createBoss(_)
{
  Life = MaxLife;
  Regen = false;
  Boss = _.physics.add.sprite(200, 400, 'boss').setScale(10);
  Boss.setName("boss");

  // Physics
  Boss.setBounce(0.25);
  Boss.setCollideWorldBounds(true);

  // Animations
  _.anims.create({
    key: 'stand',
    frames: [ { key: 'boss', frame: 0 } ],
    frameRate: 20
  });
  _.anims.create({
    key: 'left',
    frames: _.anims.generateFrameNumbers('boss', { start: 1, end: 4 }),
    frameRate: 10,
    repeat: -1
  });
  _.anims.create({
    key: 'right',
    frames: _.anims.generateFrameNumbers('boss', { start: 1, end: 4 }),
    frameRate: 10,
    repeat: -1
  });
  _.anims.create({
    key: 'jump',
    frames: [ { key: 'boss', frame: 5 } ],
    frameRate: 20
  });
  _.anims.create({
    key: 'attack',
    frames: [ { key: 'boss', frame: 6 } ],
    frameRate: 20
  });

  // Controls
  Cursors = _.input.keyboard.createCursorKeys();

  return Boss;
}

export function updateBoss(_)
{
  var forcedSprite = false;
  var isAttacking = _.time.now - AttackTime <= LastAttack;
  var attackAnimation = _.time.now - AttackAnimationTime <= LastAttack;

  if (_.time.now - LastDamage < 1499)
  {
    const on = (((_.time.now - LastDamage) % 500) < 250);
    if (on)
      Boss.setTint("0xff3333");
    else
      Boss.setTint("0xffffff");
  }

  if (Cursors.space.isDown || attackAnimation)
  {
    forcedSprite = true;
    Boss.anims.play('attack');
    if (!isAttacking)
    {
      new Projectile(_, {
        x: Boss.x + (Boss.flipX ? -1 : 1) * 50,
        y: Boss.y + 25,
        asset: 'red',
        assetBase: 'red_base',
        velocity: 500 * (Boss.flipX ? -1 : 1)
      });
      LastAttack = _.time.now;
    }
  }
  else if (Boss.body.deltaY() < -2)
  {
    forcedSprite = true;
    Boss.anims.play('jump');
  }


  // Left and right are "flipped", like the screen ;)
  if (Cursors.right.isDown && !Cursors.left.isDown)
  {
    Boss.setVelocityX(-160);
    Boss.setFlipX(true);
    if (!forcedSprite)
      Boss.anims.play('left', true);
  }
  else if (Cursors.left.isDown)
  {
    Boss.setVelocityX(160);
    Boss.setFlipX(false);
    if (!forcedSprite)
      Boss.anims.play('right', true);
  }
  else
  {
    Boss.setVelocityX(0);
    if (!forcedSprite)
      Boss.anims.play('stand');
  }


  if (Cursors.up.isDown && Boss.body.touching.down)
    Boss.setVelocityY(-420);
}

export function getBoss()
{
  return Boss;
}

export function getLife()
{
  return Life;
}

export function setLife(life)
{
  Life = life;
}

export function damage(_, damage)
{
  Life -= damage;
  LastDamage = _.time.now;
}
