import * as PIXI from 'pixi.js';
import { InputManager } from '../managers/InputManager';
import { AnimationManager } from '../managers/AnimationManager';

export class Player {
  private inputManager: InputManager;
  private animationManager: AnimationManager;
  private playerSprite: PIXI.AnimatedSprite;
  private idleRightAnimation: PIXI.Texture[];
  private idleLeftAnimation: PIXI.Texture[];
  private idleUpAnimation: PIXI.Texture[];
  private idleDownAnimation: PIXI.Texture[];
  private movingRightAnimation: PIXI.Texture[];
  private movingLeftAnimation: PIXI.Texture[];
  private movingDownAnimation: PIXI.Texture[];
  private movingUpAnimation: PIXI.Texture[];
  private speed: number = 10;

  constructor(inputManager: InputManager, animationManager: AnimationManager) {
    this.inputManager = inputManager;
    this.animationManager = animationManager;
    this.idleRightAnimation =
      this.animationManager.getPlayerIdleRightAnimation();
    this.idleLeftAnimation = this.animationManager.getPlayerIdleLeftAnimation();
    this.idleDownAnimation = this.animationManager.getPlayerIdleDownAnimation();
    this.idleUpAnimation = this.animationManager.getPlayerIdleUpAnimation();
    this.movingRightAnimation =
      this.animationManager.getPlayerMovingRightAnimation();
    this.movingLeftAnimation =
      this.animationManager.getPlayerMovingLeftAnimation();
    this.movingDownAnimation =
      this.animationManager.getPlayerMovingDownAnimation();
    this.movingUpAnimation = this.animationManager.getPlayerMovingUpAnimation();
    this.playerSprite = this.createPlayer();
  }

  private createPlayer(): PIXI.AnimatedSprite {
    const playerTextures = this.idleDownAnimation;
    const player = new PIXI.AnimatedSprite(playerTextures);
    player.x = 2400;
    player.y = 550;
    player.scale.set(1.2);
    player.anchor.set(0.5);
    player.animationSpeed = 0.1;
    player.play();

    return player;
  }

  private playAnimation(animation: PIXI.Texture[]): void {
    if (
      this.playerSprite.textures !== animation ||
      !this.playerSprite.playing
    ) {
      this.playerSprite.textures = animation;
      this.playerSprite.play();
    }
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

  public handleStandingAnimation(): void {
    switch (this.inputManager.getLastKeyPressed()) {
      case 'KeyW':
        this.playAnimation(this.idleUpAnimation);
        break;
      case 'KeyA':
        this.playAnimation(this.idleLeftAnimation);
        break;
      case 'KeyS':
        this.playAnimation(this.idleDownAnimation);
        break;
      case 'KeyD':
        this.playAnimation(this.idleRightAnimation);
        break;
      default:
        this.playAnimation(this.idleDownAnimation);
        break;
    }
  }

  public handlePlayerMovement(): void {
    if (this.inputManager.isKeyPressed('KeyW')) {
      this.moveUp();
      if (
        (!this.inputManager.isKeyPressed('KeyA') ||
          !this.inputManager.isKeyPressed('KeyD')) &&
        !this.inputManager.isKeyPressed('KeyA') &&
        !this.inputManager.isKeyPressed('KeyD')
      ) {
        this.playAnimation(this.movingUpAnimation);
      }
    } else if (this.inputManager.isKeyPressed('KeyS')) {
      this.moveDown();
      if (
        (!this.inputManager.isKeyPressed('KeyA') ||
          !this.inputManager.isKeyPressed('KeyD')) &&
        !this.inputManager.isKeyPressed('KeyA') &&
        !this.inputManager.isKeyPressed('KeyD')
      ) {
        this.playAnimation(this.movingDownAnimation);
      }
    }

    if (this.inputManager.isKeyPressed('KeyA')) {
      this.moveLeft();
      this.playAnimation(this.movingLeftAnimation);
    } else if (this.inputManager.isKeyPressed('KeyD')) {
      this.moveRight();
      this.playAnimation(this.movingRightAnimation);
    }
  }

  public getPlayerSprite(): PIXI.Sprite {
    return this.playerSprite;
  }
}
