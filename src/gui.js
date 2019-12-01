import {width, height} from './config.js';
import {MaxLife, setLife, getLife, getLifeRegen} from './player.js';
import hearts from './assets/hearts.png';

const HeartWidth = 7*5;
const HeartY = 30;
var Hearts;
var OldLife = -1;
var OldAnimateLife = false;

export function loadGUI(_)
{
  _.load.spritesheet('hearts',
    hearts,
    { frameWidth: 7, frameHeight: 6 }
  );
}

export function createGUI(_)
{
  Hearts = [];
  for (var i = 0; i < MaxLife/2; i++) {
    Hearts.push(
      _.add.sprite((width - HeartWidth * (i + 1)), HeartY, 'hearts').setScale(4).setFlipX(true)
    )
  }
}

export function updateGUI(_)
{
  const Life = getLife();
  const AnimateLife = getLifeRegen();

  // Update life
  if (OldLife != Life)
  {
    for (var i = 0; i < MaxLife/2; i++) {
      Hearts[i].setFrame(
        (Life > i * 2 + 1) ?
          0
        :
          (
            (Life > i*2) ? 1 : 2
          )
      )
    }
    OldLife = Life;
  }

  if (Life < MaxLife/4)
  {
    for (var i = 0; i < MaxLife/2; i++) {
      var Heart = Hearts[i];
      Heart.setX((width - HeartWidth * (i + 1)) + (Math.random() * 4 - 2))
      Heart.setY(HeartY + (Math.random() * 4 - 2))
    }
  }

  // Life regen effect
  if (OldAnimateLife != AnimateLife)
  {
    if (!AnimateLife)
      for (var i = 0; i < MaxLife/2; i++)
        Hearts[i].setY(HeartY);
    OldAnimateLife = AnimateLife;
  }
  if (AnimateLife)
  {
    for (var i = 0; i < MaxLife/2; i++) {
      var Heart = Hearts[i];
      Heart.setY(Math.sin(Heart.x/HeartWidth + (_.time.now/100))*8 + HeartY)
    }
  }
}
