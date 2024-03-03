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
  private movingRightReverseAnimation: PIXI.Texture[];
  private movingLeftReverseAnimation: PIXI.Texture[];
  private movingDownReverseAnimation: PIXI.Texture[];
  private movingUpReverseAnimation: PIXI.Texture[];
  private speed: number = 10;

  constructor(inputManager: InputManager, animationManager: AnimationManager) {
    this.inputManager = inputManager;
    this.animationManager = animationManager;
    this.idleRightAnimation =
      this.animationManager.getPlayerIdleRightAnimation();
    this.idleLeftAnimation = this.animationManager.getPlayerIdleLeftAnimation();
    this.idleDownAnimation = this.animationManager.getPlayerIdleDownAnimation();
    this.idleUpAnimation = this.animationManager.getPlayerIdleUpAnimation();
    this.movingRightReverseAnimation =
      this.animationManager.getPlayerMovingRightReverseAnimation();
    this.movingLeftReverseAnimation =
      this.animationManager.getPlayerMovingLeftReverseAnimation();
    this.movingDownReverseAnimation =
      this.animationManager.getPlayerMovingDownReverseAnimation();
    this.movingUpReverseAnimation =
      this.animationManager.getPlayerMovingUpReverseAnimation();

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
    player.x = 100;
    player.y = 100;
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

  private calculateDirection(): string {
    const mousePosition = this.inputManager.getMousePosition();

    // Get the center of the screen
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    // Calculate angle between center of the screen and mouse position
    const dx = mousePosition.x - centerX;
    const dy = mousePosition.y - centerY;
    const angle = Math.atan2(dy, dx);
    // Convert angle to degrees
    const angleDeg = (angle * 180) / Math.PI;

    // Determine the direction the player should face based on the angle
    let direction = 'right';
    if (angleDeg > -45 && angleDeg <= 45) {
      direction = 'right';
    } else if (angleDeg > 45 && angleDeg <= 135) {
      direction = 'down';
    } else if (angleDeg > 135 || angleDeg <= -135) {
      direction = 'left';
    } else {
      direction = 'up';
    }

    return direction;
  }

  public handleStandingAnimation() {
    const direction = this.calculateDirection();

    switch (direction) {
      case 'up':
        this.playAnimation(this.idleUpAnimation);
        break;
      case 'down':
        this.playAnimation(this.idleDownAnimation);
        break;
      case 'left':
        this.playAnimation(this.idleLeftAnimation);
        break;
      case 'right':
        this.playAnimation(this.idleRightAnimation);
        break;
    }
  }

  public handlePlayerMovement(): void {
    const direction = this.calculateDirection();
    // Set the appropriate animation based on the direction and movement
    if (this.inputManager.isKeyPressed('KeyW')) {
      this.moveUp();
      if (
        (!this.inputManager.isKeyPressed('KeyA') ||
          !this.inputManager.isKeyPressed('KeyD')) &&
        !this.inputManager.isKeyPressed('KeyA') &&
        !this.inputManager.isKeyPressed('KeyD')
      ) {
        if (direction === 'down') {
          this.playAnimation(this.movingDownReverseAnimation);
        } else {
          this.playAnimation(this.movingUpAnimation);
        }
      }
    } else if (this.inputManager.isKeyPressed('KeyS')) {
      this.moveDown();
      if (
        (!this.inputManager.isKeyPressed('KeyA') ||
          !this.inputManager.isKeyPressed('KeyD')) &&
        !this.inputManager.isKeyPressed('KeyA') &&
        !this.inputManager.isKeyPressed('KeyD')
      ) {
        if (direction === 'up') {
          this.playAnimation(this.movingUpReverseAnimation);
        } else {
          this.playAnimation(this.movingDownAnimation);
        }
      }
    }

    if (this.inputManager.isKeyPressed('KeyA')) {
      this.moveLeft();
      if (direction === 'right') {
        this.playAnimation(this.movingRightReverseAnimation);
      } else {
        this.playAnimation(this.movingLeftAnimation);
      }
    } else if (this.inputManager.isKeyPressed('KeyD')) {
      this.moveRight();
      if (direction === 'left') {
        this.playAnimation(this.movingLeftReverseAnimation);
      } else {
        this.playAnimation(this.movingRightAnimation);
      }
    }
  }

  public getPlayerSprite(): PIXI.Sprite {
    return this.playerSprite;
  }
}
