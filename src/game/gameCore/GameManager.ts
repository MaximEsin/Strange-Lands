import * as PIXI from 'pixi.js';
import { InputManager } from '../managers/InputManager';
import { Player } from '../player/Player';
import { MapManager } from './MapManager';
import { AnimationManager } from '../managers/AnimationManager';
import { InterfaceManager } from '../managers/InterfaceManager';
import { EventListenerManager } from '../managers/EventListenerManager';
import { PlayerData } from '../player/Data';

export class GameManager {
  private app: PIXI.Application;
  private inputManager: InputManager;
  private animationManager: AnimationManager;
  private mapManager: MapManager;
  private interfaceManager: InterfaceManager;
  private eventListenerManager: EventListenerManager;
  private player: Player;
  private playerData: PlayerData;
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
    this.playerData = new PlayerData();
    this.animationManager = new AnimationManager();
    this.mapManager = new MapManager(
      this.app,
      this.groundLayer,
      this.faunaLayer,
      this.structureLayer
    );
    this.interfaceManager = new InterfaceManager(this.playerData);
    this.eventListenerManager = new EventListenerManager(this.interfaceManager);
    this.player = new Player(
      this.app,
      this.inputManager,
      this.animationManager,
      this.playerData
    );
    this.structureLayer.addChild(this.player.getPlayerSprite());
  }

  private playerMotion(delta: number) {
    const playerSprite = this.player.getPlayerSprite();

    if (
      this.inputManager.isKeyPressed('KeyW') ||
      this.inputManager.isKeyPressed('KeyA') ||
      this.inputManager.isKeyPressed('KeyS') ||
      this.inputManager.isKeyPressed('KeyD')
    ) {
      const prevX = playerSprite.x;
      const prevY = playerSprite.y;

      this.player.handlePlayerMovement(delta);
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
    } else {
      this.player.handleStandingAnimation();
    }
  }

  private gameLoop(delta: number): void {
    console.log(this.app.ticker.FPS);
    this.app.renderer.render(this.app.stage);
    this.playerMotion(delta);
    this.player.update();
    this.interfaceManager.updateUIData();
  }

  start() {
    this.app.ticker.add(this.gameLoop.bind(this));
    this.eventListenerManager.setupEventListeners();
  }
}
