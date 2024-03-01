import * as PIXI from 'pixi.js';
import { InputManager } from '../managers/InputManager';

export class Player {
  private inputManager: InputManager;
  private playerSprite: PIXI.Sprite;
  private speed: number = 2;

  constructor(inputManager: InputManager) {
    this.inputManager = inputManager;
    this.playerSprite = this.createPlayer();
  }

  private createPlayer(): PIXI.Sprite {
    const playerTexture = PIXI.Texture.from(
      '/Characters/Main/Frodo/Idle/Frodo_Idle0.png'
    );
    const player = new PIXI.Sprite(playerTexture);
    player.scale.set(0.3);
    player.anchor.set(0.5);
    player.x = 100;
    player.y = 70;

    return player;
  }

  private moveUp(): void {
    this.playerSprite.y -= this.speed;
  }

  private moveDown(): void {
    this.playerSprite.y += this.speed;
  }

  private moveLeft(): void {
    this.playerSprite.x -= this.speed;
  }

  private moveRight(): void {
    this.playerSprite.x += this.speed;
  }

  public handlePlayerMovement(): void {
    if (this.inputManager.isKeyPressed('KeyW')) {
      this.moveUp();
    } else if (this.inputManager.isKeyPressed('KeyS')) {
      this.moveDown();
    }

    if (this.inputManager.isKeyPressed('KeyA')) {
      this.moveLeft();
    } else if (this.inputManager.isKeyPressed('KeyD')) {
      this.moveRight();
    }
  }

  public getPlayerSprite(): PIXI.Sprite {
    return this.playerSprite;
  }
}
