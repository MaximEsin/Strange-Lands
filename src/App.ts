import * as PIXI from 'pixi.js';
import { GameManager } from './game/gameCore/GameManager';
import { StartScreen } from './game/Screens/StartScreen';

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

window.onload = () => {
  const startScreen = new StartScreen();
  startScreen.init();
};
