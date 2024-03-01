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

    setTimeout(() => {
      this.adjustMapPosition(
        this.player.getPlayerSprite().x,
        this.player.getPlayerSprite().y
      );
    }, 1000);
  }

  private checkStructureCollision(x: number, y: number): boolean {
    const tileSize = this.tileManager.getMap().tilewidth;
    const tileLayer = this.tileManager
      .getMap()
      .layers.find((layer: any) => layer.name === 'Tile Layer 3');

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
      this.adjustMapPosition(playerSprite.x, playerSprite.y);

      if (this.checkStructureCollision(playerSprite.x, playerSprite.y)) {
        playerSprite.x = prevX;
        playerSprite.y = prevY;
      }
    }
  }

  private adjustMapPosition(playerX: number, playerY: number): void {
    const screenWidth = this.app.renderer.screen.width;
    const screenHeight = this.app.renderer.screen.height;
    const mapWidth =
      this.tileManager.getMap().width * this.tileManager.getMap().tilewidth; // Total width of the map
    const mapHeight =
      this.tileManager.getMap().height * this.tileManager.getMap().tileheight; // Total height of the map
    const offsetX = screenWidth / 2; // Calculate the center of the screen horizontally
    const offsetY = screenHeight / 2; // Calculate the center of the screen vertically

    // Calculate the boundaries to prevent moving the camera outside of the map
    const minX = offsetX;
    const maxX = mapWidth - offsetX;
    const minY = offsetY;
    const maxY = mapHeight - offsetY;

    // Calculate the new position for the map container
    let newX = Math.min(Math.max(playerX, minX), maxX);
    let newY = Math.min(Math.max(playerY, minY), maxY);

    // Adjust the position of the map container
    this.app.stage.position.set(
      screenWidth / 2 - newX,
      screenHeight / 2 - newY
    );
  }

  private gameLoop(): void {
    this.app.renderer.render(this.app.stage);

    this.playerMovement();
  }

  start() {
    this.app.ticker.add(this.gameLoop.bind(this));
  }
}
