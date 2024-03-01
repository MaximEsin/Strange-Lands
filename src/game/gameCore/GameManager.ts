import * as PIXI from 'pixi.js';
import { InputManager } from '../managers/InputManager';
import { Player } from '../player/Player';
import { TileManager } from '../managers/TileManager';

export class GameManager {
  private app: PIXI.Application;
  private inputManager: InputManager;
  private tileManager: TileManager;
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

    this.tileManager = new TileManager(this.groundLayer, this.structureLayer);
    this.inputManager = new InputManager();
    this.player = new Player(this.inputManager);
    this.structureLayer.addChild(this.player.getPlayerSprite());
  }

  private checkStructureCollision(x: number, y: number): boolean {
    const tileSize = this.tileManager.getMap().tilewidth;
    const tileLayer = this.tileManager
      .getMap()
      .layers.find((layer: any) => layer.name === 'Tile Layer 2');

    if (tileLayer) {
      const data = tileLayer.data;
      const width = tileLayer.width;
      const height = tileLayer.height;

      // Convert player's position to tile coordinates
      const tileX = Math.floor(x / tileSize);
      const tileY = Math.floor(y / tileSize);

      // Check if the player's new position overlaps with any tiles from the second layer
      if (tileX >= 0 && tileX < width && tileY >= 0 && tileY < height) {
        const index = tileX + tileY * width;
        const gid = data[index];
        return gid !== 0;
      }
    }

    return false; // No collision
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

      if (this.checkStructureCollision(playerSprite.x, playerSprite.y)) {
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
