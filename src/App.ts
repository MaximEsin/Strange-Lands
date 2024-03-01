import * as PIXI from 'pixi.js';

export class Game {
  private app: PIXI.Application;
  private map: any;
  private tilesets: any[] = [];

  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xaaaaaa,
    });

    document.body.appendChild(this.app.view);

    this.loadAssets();

    this.gameLoop();
  }

  private loadAssets(): void {
    PIXI.Loader.shared
      .add('map', '/Backgrounds/testmap.json')
      .add('GrassJson', '/Backgrounds/Grass.json')
      .add('TreeJson', '/Backgrounds/Tree.json')
      .load(this.setup.bind(this));
  }

  private setup(
    loader: PIXI.Loader,
    resources: Partial<Record<string, PIXI.LoaderResource>>
  ): void {
    // Check if all resources are loaded successfully
    if (!resources.map || !resources.GrassJson || !resources.TreeJson) {
      console.error('Failed to load resources.');
      console.log(loader);
      return;
    }

    // Load the map data
    this.map = resources.map.data;

    // Load tileset textures
    const tilesets = this.map.tilesets;
    for (const tileset of tilesets) {
      const textureResource = resources[tileset.name];
      if (!textureResource || !textureResource.data.image) {
        console.error(`Failed to load texture for tileset: ${tileset.source}`);
        continue;
      }
      const texture = PIXI.Texture.from(textureResource.data.image);
      this.tilesets.push({ ...tileset, img: texture });
    }

    this.createMap();
  }

  private createMap(): void {
    const layers = this.map.layers;

    for (const layer of layers) {
      if (layer.type === 'tilelayer') {
        this.renderTileLayer(layer);
      }
    }
  }

  private renderTileLayer(layer: any): void {
    const data = layer.data;
    const width = layer.width;
    const height = layer.height;
    const tileWidth = this.map.tilewidth;
    const tileHeight = this.map.tileheight;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = x + y * width;
        const gid = data[index];
        if (gid !== 0) {
          const texture = this.getTileTexture(gid);
          if (texture) {
            const sprite = new PIXI.Sprite(texture);
            sprite.x = x * tileWidth;
            sprite.y = y * tileHeight;
            this.app.stage.addChild(sprite);
          }
        }
      }
    }
  }

  private getTileTexture(gid: number): PIXI.Texture | null {
    for (const tileset of this.map.tilesets) {
      if (
        gid >= tileset.firstgid &&
        gid < tileset.firstgid + tileset.tilecount
      ) {
        const tileIndex = gid - tileset.firstgid;
        const textureObject = this.tilesets.find(
          (item) => item.name === tileset.name
        );

        if (textureObject) {
          const tileSize = this.map.tilewidth;
          const columns = textureObject.columns;
          const row = Math.floor(tileIndex / columns);
          const col = tileIndex % columns;
          return new PIXI.Texture(
            textureObject.img,
            new PIXI.Rectangle(
              col * tileSize,
              row * tileSize,
              tileSize,
              tileSize
            )
          );
        }
      }
    }
    return null;
  }

  private gameLoop(): void {
    this.app.renderer.render(this.app.stage);

    requestAnimationFrame(() => this.gameLoop());
  }
}

const game = new Game();
