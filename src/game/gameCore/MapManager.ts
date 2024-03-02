import * as PIXI from 'pixi.js';
import { TileManager } from '../managers/TileManager';
import { QuadTree } from '../performance/QuadTree';
import { Player } from '../player/Player';

export class MapManager {
  private app: PIXI.Application;
  private tileManager: TileManager;
  private quadTree: QuadTree;

  constructor(
    app: PIXI.Application,
    groundLayer: PIXI.Container,
    structureLayer: PIXI.Container
  ) {
    this.app = app;
    this.tileManager = new TileManager(groundLayer, structureLayer);
    this.quadTree = new QuadTree(
      0,
      0,
      app.renderer.screen.width,
      app.renderer.screen.height,
      4,
      4
    );
    setTimeout(() => {
      this.initializeQuadTree();
    }, 1000);
  }

  private initializeQuadTree(): void {
    // Initialize the QuadTree with the map dimensions and depth
    const mapWidth =
      this.tileManager.getMap().width * this.tileManager.getMap().tilewidth;
    const mapHeight =
      this.tileManager.getMap().height * this.tileManager.getMap().tileheight;
    this.quadTree = new QuadTree(0, 0, mapWidth, mapHeight, 10, 100);

    // Insert collision tiles into the QuadTree
    const tileSize = this.tileManager.getMap().tilewidth;
    const tileLayer = this.tileManager
      .getMap()
      .layers.find((layer: any) => layer.name === 'Tile Layer 3');
    if (tileLayer) {
      const data = tileLayer.data;
      const width = tileLayer.width;
      const height = tileLayer.height;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = x + y * width;
          const gid = data[index];
          if (gid !== 0) {
            const tileX = x * tileSize;
            const tileY = y * tileSize;
            this.quadTree.insert(tileX, tileY, tileSize, tileSize);
          }
        }
      }
    }
  }

  public checkStructureCollision(
    x: number,
    y: number,
    player: Player
  ): boolean {
    const playerWidth = player.getPlayerSprite().width;
    const playerHeight = player.getPlayerSprite().height;

    // Define the region to query in the QuadTree
    const region = {
      x: x - playerWidth / 2,
      y: y - playerHeight / 2,
      width: playerWidth,
      height: playerHeight,
    };

    // Query the QuadTree for objects within the region
    const objectsInRegion = this.quadTree.queryRegion(
      region.x,
      region.y,
      region.width,
      region.height
    );

    // Check for collisions with each object in the region
    for (const obj of objectsInRegion) {
      if (
        x < obj.x + obj.width &&
        x + playerWidth > obj.x &&
        y < obj.y + obj.height &&
        y + playerHeight > obj.y
      ) {
        return true; // Collision detected
      }
    }

    return false; // No collision
  }

  public adjustMapPosition(playerX: number, playerY: number): void {
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
}
