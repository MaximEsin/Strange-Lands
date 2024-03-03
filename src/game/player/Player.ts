import * as PIXI from 'pixi.js';
import { InputManager } from '../managers/InputManager';
import { AnimationManager } from '../managers/AnimationManager';
import { PlayerData } from './Data';

export class Player {
  private app: PIXI.Application;
  private inputManager: InputManager;
  private animationManager: AnimationManager;
  private playerData: PlayerData;
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
  private swordRightAnimation: PIXI.Texture[];
  private swordLeftAnimation: PIXI.Texture[];
  private swordUpAnimation: PIXI.Texture[];
  private swordDownAnimation: PIXI.Texture[];
  private swordUltimateAnimation: PIXI.Texture[];
  private speed: number = 10;
  private isAttackingWithDagger: boolean = false;
  private isAttackingWithSword: boolean = false;
  private swordAttackStaminaCost: number = 5;
  private swordAttackStaminaPenalty: number = 1000;
  private lastPenaltyTimer: number = 0;

  constructor(
    app: PIXI.Application,
    inputManager: InputManager,
    animationManager: AnimationManager,
    playerData: PlayerData
  ) {
    this.app = app;
    this.inputManager = inputManager;
    this.animationManager = animationManager;
    this.playerData = playerData;
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

    this.swordRightAnimation =
      this.animationManager.getPlayerSwordAttackRightAnimation();
    this.swordLeftAnimation =
      this.animationManager.getPlayerSwordAttackLeftAnimation();
    this.swordUpAnimation =
      this.animationManager.getPlayerSwordAttackUpAnimation();
    this.swordDownAnimation =
      this.animationManager.getPlayerSwordAttackDownAnimation();
    this.swordUltimateAnimation =
      this.animationManager.getPlayerUltimateAttackAnimation();

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

  private handleSwordAttack(): void {
    const direction = this.calculateDirection();
    switch (direction) {
      case 'up':
        this.playAnimation(this.swordUpAnimation);
        break;
      case 'down':
        this.playAnimation(this.swordDownAnimation);
        break;
      case 'left':
        this.playAnimation(this.swordLeftAnimation);
        break;
      case 'right':
        this.playAnimation(this.swordRightAnimation);
        break;
    }
  }

  private handleDaggerAttackAction(): void {
    if (!this.isAttackingWithSword) {
      if (this.inputManager.isMouseButtonPressed(2)) {
        this.isAttackingWithDagger = true;
        this.handleDaggerAttack();
      } else {
        this.isAttackingWithDagger = false;
      }
    }
  }

  private handleSwordAttackAction(): void {
    const currentTime = Date.now();

    // Check if the player is not already attacking with a sword
    if (!this.isAttackingWithSword) {
      // Check if the stamina is sufficient for the sword attack
      if (this.playerData.stamina >= this.swordAttackStaminaCost) {
        // Check if the left mouse button is pressed
        if (this.inputManager.isMouseButtonPressed(0)) {
          // Check if enough time has passed since the last stamina reduction
          if (
            currentTime - this.lastPenaltyTimer >=
            this.swordAttackStaminaPenalty
          ) {
            // Reduce stamina by the sword attack cost
            this.playerData.stamina = this.swordAttackStaminaCost;
            // Start the sword attack animation
            this.handleSwordAttack();
            // Update the last penalty timer
            this.lastPenaltyTimer = currentTime;
            // Set the flag indicating that the player is attacking with a sword
            this.isAttackingWithSword = true;
          }
        }
      }
    } else {
      // If the player is already attacking with a sword, check if it's time to stop
      if (
        currentTime - this.lastPenaltyTimer >=
        this.swordAttackStaminaPenalty
      ) {
        // Reset the flag indicating that the player is attacking with a sword
        this.isAttackingWithSword = false;
      }
    }
  }

  public handleStandingAnimation() {
    const direction = this.calculateDirection();
    if (!this.isAttackingWithSword) {
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
          if (!this.isAttackingWithSword) {
            if (!this.isAttackingWithDagger) {
              this.playAnimation(this.movingDownReverseAnimation);
            }
          }
        } else {
          if (!this.isAttackingWithSword) {
            if (!this.isAttackingWithDagger) {
              this.playAnimation(this.movingUpAnimation);
            }
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
          if (!this.isAttackingWithSword) {
            if (!this.isAttackingWithDagger) {
              this.playAnimation(this.movingUpReverseAnimation);
            }
          }
        } else {
          if (!this.isAttackingWithSword) {
            if (!this.isAttackingWithDagger) {
              this.playAnimation(this.movingDownAnimation);
            }
          }
        }
      }
    }

    if (this.inputManager.isKeyPressed('KeyA')) {
      this.moveLeft();
      if (direction === 'right') {
        if (!this.isAttackingWithSword) {
          if (!this.isAttackingWithDagger) {
            this.playAnimation(this.movingRightReverseAnimation);
          }
        }
      } else {
        if (!this.isAttackingWithSword) {
          if (!this.isAttackingWithDagger) {
            this.playAnimation(this.movingLeftAnimation);
          }
        }
      }
    } else if (this.inputManager.isKeyPressed('KeyD')) {
      this.moveRight();
      if (direction === 'left') {
        if (!this.isAttackingWithSword) {
          if (!this.isAttackingWithDagger) {
            this.playAnimation(this.movingLeftReverseAnimation);
          }
        }
      } else {
        if (!this.isAttackingWithSword) {
          if (!this.isAttackingWithDagger) {
            this.playAnimation(this.movingRightAnimation);
          }
        }
      }
    }
  }

  public getPlayerSprite(): PIXI.Sprite {
    return this.playerSprite;
  }

  public update() {
    this.handleDaggerAttackAction();
    this.handleSwordAttackAction();
  }
}
