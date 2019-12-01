import bg_world from './assets/bg_world.png';
import kevin from './assets/kevin.png';
import revertscreen from './assets/revertscreen.png';
import revertscreen_lines from './assets/revertscreen_lines.png';
import {MaxLife, getLife} from './player.js';

var Kevin;
var GameOver;
var Line;
var Line2;

var OldLife;

export function loadPhysical(_)
{
  _.load.image('bg_world', bg_world);
  _.load.spritesheet('kevin',
      kevin,
      { frameWidth: 40, frameHeight: 30 }
  );
  _.load.image('revertscreen', revertscreen);
  _.load.image('revertscreen_lines', revertscreen_lines);
  OldLife = -MaxLife;
}

export function createPhysical(_)
{
  _.add.image(400, 300, 'bg_world').setScale(4);
  Kevin = _.add.sprite(400, 300, 'kevin').setScale(20);
  GameOver = _.add.image(400, 300, 'gameover').setScale(20).setFlipX(true).setCrop(0,0,0,0);
  Line = _.add.image(400, -300, 'revertscreen_lines').setScale(20);
  Line2 = _.add.image(400, -300, 'revertscreen_lines').setScale(20);
  _.add.image(400, 300, 'revertscreen').setScale(20);
}

export function updatePhysical(_)
{
  const Life = getLife();

  // Lines
  Line.setY(900 - ((_.time.now * 0.4) % 900));
  Line2.setY(900 - ((_.time.now * 0.4 + 450) % 900));

  // Real player
  if (OldLife != Life)
  {
    if (Life == 0)
      Kevin.setFrame(3);
    else if (Life < MaxLife/2)
      Kevin.setFrame(2);
    else if (Life < MaxLife)
      Kevin.setFrame(1);
    else
      Kevin.setFrame(0);
  }
}

export function PlayerGameover()
{
  GameOver.setCrop();
}
