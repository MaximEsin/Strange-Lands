import * as PIXI from 'pixi.js';

export class AnimationManager {
  private createAnimation(
    char: string,
    action: string,
    firstFrame: number,
    framesCount: number
  ): PIXI.Texture[] {
    const texturePaths: PIXI.Texture[] = [];

    for (let i = firstFrame; i <= framesCount; i++) {
      const texturePath = PIXI.Texture.from(
        `/${char}/${action}/${action}${i}.png`
      );
      texturePaths.push(texturePath);
    }

    return texturePaths;
  }

  private createReverseAnimation(
    char: string,
    action: string,
    firstFrame: number,
    framesCount: number
  ): PIXI.Texture[] {
    const texturePaths: PIXI.Texture[] = [];

    for (let i = firstFrame; i >= framesCount; i--) {
      const texturePath = PIXI.Texture.from(
        `/${char}/${action}/${action}${i}.png`
      );
      texturePaths.push(texturePath);
    }

    return texturePaths;
  }

  public getPlayerIdleRightAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'idle', 1, 10);
  }

  public getPlayerIdleLeftAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'idle', 11, 20);
  }

  public getPlayerIdleDownAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'idle', 21, 30);
  }

  public getPlayerIdleUpAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'idle', 31, 40);
  }

  public getPlayerMovingRightAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'moving', 1, 8);
  }

  public getPlayerMovingLeftAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'moving', 13, 20);
  }

  public getPlayerMovingDownAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'moving', 25, 32);
  }

  public getPlayerMovingUpAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'moving', 37, 44);
  }

  public getPlayerMovingRightReverseAnimation(): PIXI.Texture[] {
    return this.createReverseAnimation('Player', 'moving', 8, 1);
  }

  public getPlayerMovingLeftReverseAnimation(): PIXI.Texture[] {
    return this.createReverseAnimation('Player', 'moving', 20, 13);
  }

  public getPlayerMovingDownReverseAnimation(): PIXI.Texture[] {
    return this.createReverseAnimation('Player', 'moving', 32, 25);
  }

  public getPlayerMovingUpReverseAnimation(): PIXI.Texture[] {
    return this.createReverseAnimation('Player', 'moving', 44, 37);
  }

  public getPlayerDaggerAttackRightAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'daggerAttack', 1, 6);
  }

  public getPlayerDaggerAttackLeftAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'daggerAttack', 7, 12);
  }

  public getPlayerDaggerAttackDownAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'daggerAttack', 13, 18);
  }

  public getPlayerDaggerAttackUpAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'daggerAttack', 19, 24);
  }

  public getPlayerSwordAttackRightAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'swordAttack', 1, 10);
  }

  public getPlayerSwordAttackLeftAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'swordAttack', 11, 20);
  }

  public getPlayerSwordAttackDownAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'swordAttack', 21, 30);
  }

  public getPlayerSwordAttackUpAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'swordAttack', 31, 40);
  }

  public getPlayerUltimateAttackAnimation(): PIXI.Texture[] {
    return this.createAnimation('Player', 'swordAttack', 41, 44);
  }
}
