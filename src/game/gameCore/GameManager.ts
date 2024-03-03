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
      this.structureLayer
    );
    this.interfaceManager = new InterfaceManager(this.app, this.playerData);
    this.eventListenerManager = new EventListenerManager(this.interfaceManager);
    this.player = new Player(
      this.app,
      this.inputManager,
      this.animationManager
    );
    this.structureLayer.addChild(this.player.getPlayerSprite());

    this.updateInterfacePosition();
  }

  private updateInterfacePosition(): void {
    // Calculate the center of the screen
    const centerX = this.player.getPlayerSprite().x - this.app.screen.width / 2;
    const centerY =
      this.player.getPlayerSprite().y - this.app.screen.height / 2;

    // Update the interface manager's position
    this.interfaceManager.setPosition(centerX, centerY);
  }

  private playerMotion() {
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
    } else {
      this.player.handleStandingAnimation();
    }

    this.updateInterfacePosition();
  }

  private checkCharacterPaneToggle() {
    if (this.inputManager.isKeyPressed('Tab')) {
      this.interfaceManager.toggleCharacterPane();
    }
  }

  private gameLoop(): void {
    this.app.renderer.render(this.app.stage);
    this.playerMotion();
    this.checkCharacterPaneToggle();
  }

  start() {
    this.app.ticker.add(this.gameLoop.bind(this));
    this.eventListenerManager.setupEventListeners();
  }
}
