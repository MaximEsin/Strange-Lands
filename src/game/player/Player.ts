import * as PIXI from 'pixi.js';
import { InputManager } from '../managers/InputManager';
import { AnimationManager } from '../managers/AnimationManager';

export class Player {
  private app: PIXI.Application;
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
  private daggerRightAnimation: PIXI.Texture[];
  private daggerLeftAnimation: PIXI.Texture[];
  private daggerUpAnimation: PIXI.Texture[];
  private daggerDownAnimation: PIXI.Texture[];
  private speed: number = 10;
  private isAttackingWithDagger: boolean = false;

  constructor(
    app: PIXI.Application,
    inputManager: InputManager,
    animationManager: AnimationManager
  ) {
    this.app = app;
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

    this.daggerRightAnimation =
      this.animationManager.getPlayerDaggerAttackRightAnimation();
    this.daggerLeftAnimation =
      this.animationManager.getPlayerDaggerAttackLeftAnimation();
    this.daggerUpAnimation =
      this.animationManager.getPlayerDaggerAttackUpAnimation();
    this.daggerDownAnimation =
      this.animationManager.getPlayerDaggerAttackDownAnimation();

    this.playerSprite = this.createPlayer();
  }

  private createPlayer(): PIXI.AnimatedSprite {
    const playerTextures = this.idleDownAnimation;
    const player = new PIXI.AnimatedSprite(playerTextures);
    player.x = this.app.screen.width / 2;
    player.y = this.app.screen.height / 2;
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

  private handleDaggerAttack(): void {
    const direction = this.calculateDirection();
    switch (direction) {
      case 'up':
        this.playAnimation(this.daggerUpAnimation);
        break;
      case 'down':
        this.playAnimation(this.daggerDownAnimation);
        break;
      case 'left':
        this.playAnimation(this.daggerLeftAnimation);
        break;
      case 'right':
        this.playAnimation(this.daggerRightAnimation);
        break;
    }
  }

  private handleDaggerAttackAction(): void {
    if (this.inputManager.isMouseButtonPressed(2)) {
      this.isAttackingWithDagger = true;
      this.handleDaggerAttack();
    } else {
      this.isAttackingWithDagger = false;
    }
  }

  public handleStandingAnimation() {
    const direction = this.calculateDirection();

    if (!this.isAttackingWithDagger) {
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
          if (!this.isAttackingWithDagger) {
            this.playAnimation(this.movingDownReverseAnimation);
          }
        } else {
          if (!this.isAttackingWithDagger) {
            this.playAnimation(this.movingUpAnimation);
          }
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
          if (!this.isAttackingWithDagger) {
            this.playAnimation(this.movingUpReverseAnimation);
          }
        } else {
          if (!this.isAttackingWithDagger) {
            this.playAnimation(this.movingDownAnimation);
          }
        }
      }
    }

    if (this.inputManager.isKeyPressed('KeyA')) {
      this.moveLeft();
      if (direction === 'right') {
        if (!this.isAttackingWithDagger) {
          this.playAnimation(this.movingRightReverseAnimation);
        }
      } else {
        if (!this.isAttackingWithDagger) {
          this.playAnimation(this.movingLeftAnimation);
        }
      }
    } else if (this.inputManager.isKeyPressed('KeyD')) {
      this.moveRight();
      if (direction === 'left') {
        if (!this.isAttackingWithDagger) {
          this.playAnimation(this.movingLeftReverseAnimation);
        }
      } else {
        if (!this.isAttackingWithDagger) {
          this.playAnimation(this.movingRightAnimation);
        }
      }
    }
  }

  public getPlayerSprite(): PIXI.Sprite {
    return this.playerSprite;
  }

  public getIsAttackingWithDagger(): boolean {
    return this.isAttackingWithDagger;
  }

  public update() {
    this.handleDaggerAttackAction();
  }
}
