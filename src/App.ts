import * as PIXI from 'pixi.js';
import { GameManager } from './game/gameCore/GameManager';

export class App {
  private app: PIXI.Application;
  private gameManager: GameManager;

  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    document.body.appendChild(this.app.view);

    this.gameManager = new GameManager(this.app);
  }

  start() {
    this.gameManager.start();
  }
}

const app = new App();
app.start();
