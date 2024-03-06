import * as PIXI from 'pixi.js';

export class TileManager {
  private groundLayer: PIXI.Container;
  private faunaLayer: PIXI.Container;
  private structureLayer: PIXI.Container;
  private map: any;
  private tilesets: any[] = [];

  constructor(
    groundLayer: PIXI.Container,
    faunaLayer: PIXI.Container,
    structurelayer: PIXI.Container
  ) {
    this.groundLayer = groundLayer;
    this.faunaLayer = faunaLayer;
    this.structureLayer = structurelayer;

    this.loadAssets();
  }

  private loadAssets(): void {
    PIXI.Loader.shared
      .add('map', '/Levels/GrassLands/jsons/GrassLandsMap.json')
      .add('DecorJson', '/Levels/GrassLands/jsons/Decor.json')
      .add('MainJson', '/Levels/GrassLands/jsons/main.json')
      .add('ShipsJson', '/Levels/GrassLands/jsons/Ships.json')
      .add('TowersJson', '/Levels/GrassLands/jsons/Towers.json')
      .load(this.setup.bind(this));
  }

  private setup(
    loader: PIXI.Loader,
    resources: Partial<Record<string, PIXI.LoaderResource>>
  ): void {
    // Check if all resources are loaded successfully
    if (
      !resources.map ||
      !resources.DecorJson ||
      !resources.MainJson ||
      !resources.ShipsJson ||
      !resources.TowersJson
    ) {
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
            if (gid < 26001) {
              this.groundLayer.addChild(sprite);
            } else {
              this.structureLayer.addChild(sprite);
            }
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

  public getMap() {
    return this.map;
  }
}
