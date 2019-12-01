import Phaser from 'phaser';
import './phaser.css';
import {width, height} from './config.js';
import gameover from './assets/gameover.png';

import {loadPhysical, createPhysical, updatePhysical, PlayerGameover} from './physical.js';
import {loadGUI, createGUI, updateGUI} from './gui.js';
import {loadWorld, createWorld} from './world.js';
import {loadBoss, createBoss, updateBoss, getLife as getBossLife} from './boss.js';
import {loadPlayer, createPlayer, updatePlayer, getLife as getPlayerLife} from './player.js';
import {updateProjectile} from './projectile.js';
import {createEvent} from './events.js';

const config = {
    type: Phaser.AUTO,
    width,
    height,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 }
        }
    },
    scene: {
        preload,
        create,
        update,
    },
    // antialias: false,
    pixelArt: true
};

window.document.title = "[FlipScreen]";

var game = new Phaser.Game(config);
var GameOver;
var finish = false;

function preload()
{
  this.load.image('gameover', gameover);
  loadPhysical(this);
  loadGUI(this);
  loadWorld(this);
  loadBoss(this);
  loadPlayer(this);
}
function create()
{
  createPhysical(this);
  createGUI(this);
  const World = createWorld(this);
  const Boss = createBoss(this);
  const Player = createPlayer(this);
  GameOver = this.add.image(400, 300, 'gameover').setScale(20).setCrop(0,0,0,0);

  this.physics.add.collider(Boss, World);
  this.physics.add.collider(Player, World);
  this.physics.add.collider(Player, Boss);
  createEvent(this);
}
function update()
{
  if (finish)
    return;
  updateProjectile(this);
  updateBoss(this);
  updatePlayer(this);
  updateGUI(this);
  updatePhysical(this);

  if (getPlayerLife() <= 0 || getBossLife() <= 0)
  {
    if (getPlayerLife() <= 0)
      PlayerGameover();
    else
      GameOver.setCrop();
    setTimeout(()=>{
      window.location = window.location;
    }, 10000);
    finish = true;
  }
}
