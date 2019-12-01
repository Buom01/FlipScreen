import ground from './assets/ground.png'
import platform from './assets/platform.png'

var World;

export function loadWorld(_)
{
  _.load.image('ground', ground);
  _.load.image('platform', platform);
}
export function createWorld(_)
{
  World = _.physics.add.staticGroup();

  World.create(400, 625, 'ground').setScale(10).refreshBody();

  World.create(550, 400, 'platform').setScale(10).refreshBody();
  World.create(50, 250, 'platform').setScale(10).refreshBody();
  World.create(750, 220, 'platform').setScale(10).refreshBody();

  return World;
}
export function getWorld()
{
  return World;
}
