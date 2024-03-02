import * as PIXI from 'pixi.js';
import { InputManager } from '../managers/InputManager';
import { Player } from '../player/Player';
import { MapManager } from './MapManager';

export class GameManager {
  private app: PIXI.Application;
  private inputManager: InputManager;
  private mapManager: MapManager;
  private player: Player;
  private groundLayer: PIXI.Container;
  private faunaLayer: PIXI.Container;
  private structureLayer: PIXI.Container;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.groundLayer = new PIXI.Container();
    this.faunaLayer = new PIXI.Container();
    this.structureLayer = new PIXI.Container();

    this.app.stage.addChild(this.groundLayer);
    this.app.stage.addChild(this.faunaLayer);
    this.app.stage.addChild(this.structureLayer);

    this.inputManager = new InputManager();
    this.mapManager = new MapManager(
      this.app,
      this.groundLayer,
      this.structureLayer
    );
    this.player = new Player(this.inputManager);
    this.structureLayer.addChild(this.player.getPlayerSprite());
  }

  private playerMovement() {
    const playerSprite = this.player.getPlayerSprite();
    if (
      this.inputManager.isKeyPressed('KeyW') ||
      this.inputManager.isKeyPressed('KeyA') ||
      this.inputManager.isKeyPressed('KeyS') ||
      this.inputManager.isKeyPressed('KeyD')
    ) {
      const prevX = playerSprite.x;
      const prevY = playerSprite.y;

      this.player.handlePlayerMovement();
      this.mapManager.adjustMapPosition(playerSprite.x, playerSprite.y);

      if (
        this.mapManager.checkStructureCollision(
          playerSprite.x,
          playerSprite.y,
          this.player
        )
      ) {
        playerSprite.x = prevX;
        playerSprite.y = prevY;
      }
    }
  }

  private gameLoop(): void {
    this.app.renderer.render(this.app.stage);
    this.playerMovement();
  }

  start() {
    this.app.ticker.add(this.gameLoop.bind(this));
  }
}
