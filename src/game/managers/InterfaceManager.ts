import * as PIXI from 'pixi.js';
import { PlayerData } from '../player/Data';

export class InterfaceManager {
  private app: PIXI.Application;
  private playerData: PlayerData;
  private characterPaneSprite: PIXI.Sprite;
  private backgroundOverlay: PIXI.Container;
  private isOpen: boolean = false;

  constructor(app: PIXI.Application, playerData: PlayerData) {
    this.app = app;
    this.playerData = playerData;
    this.characterPaneSprite = new PIXI.Sprite(
      PIXI.Texture.from('/UI/CharacterPane.png')
    );

    // Create background overlay container
    this.backgroundOverlay = new PIXI.Container();
    this.app.stage.addChild(this.backgroundOverlay);

    // Create background overlay
    const background = new PIXI.Graphics();
    background.beginFill(0x000000, 0.5);
    background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    background.endFill();
    background.interactive = true;
    this.backgroundOverlay.addChild(background);

    // Set character pane position relative to app screen
    this.characterPaneSprite.x = this.app.screen.width * 0.25;
    this.characterPaneSprite.y = this.app.screen.height * 0.05;
    this.backgroundOverlay.addChild(this.characterPaneSprite);

    const nameText = new PIXI.Text('Aragain', {
      fontFamily: 'Halvetica',
      fontSize: 24,
      fontWeight: 'bold',
      fill: 0x000,
      align: 'center',
    });
    nameText.anchor.set(0.5);
    nameText.x = this.app.screen.width * 0.39;
    nameText.y = this.app.screen.height * 0.25;
    this.backgroundOverlay.addChild(nameText);

    this.createText('Strength', this.playerData.strength, 0.41, 0.61);
    this.createText('Health', this.playerData.health, 0.41, 0.66);
    this.createText('Armor Value', this.playerData.armorValue, 0.41, 0.71);
    this.createText('Stamina', this.playerData.stamina, 0.41, 0.76);
    this.createText(
      'Health Potions',
      this.playerData.healthPotionsAmount,
      0.57,
      0.32
    );

    this.createText(
      'Stamina Potions',
      this.playerData.healthPotionsAmount,
      0.57,
      0.37
    );

    this.createText('Coins', this.playerData.coinAmount, 0.57, 0.42);

    const gearText = new PIXI.Text('Current gear', {
      fontFamily: 'Halvetica',
      fontSize: 20,
      fontWeight: 'normal',
      fill: 0x000,
      align: 'center',
    });
    gearText.anchor.set(0.5);
    gearText.x = this.app.screen.width * 0.56;
    gearText.y = this.app.screen.height * 0.49;
    this.backgroundOverlay.addChild(gearText);

    // Hide the overlay initially
    this.backgroundOverlay.visible = false;

    // Add event listener to capture clicks on the background overlay
    background.on('pointerdown', () => this.toggleCharacterPane());
  }

  private createText(text: string, data: number, x: number, y: number) {
    const textToAdd = new PIXI.Text(`${text}: ${data}`, {
      fontFamily: 'Halvetica',
      fontSize: 16,
      fontWeight: 'normal',
      fill: 0x000,
      align: 'center',
    });
    textToAdd.anchor.set(0.5);
    textToAdd.x = this.app.screen.width * x;
    textToAdd.y = this.app.screen.height * y;
    this.backgroundOverlay.addChild(textToAdd);
  }

  public toggleCharacterPane(): void {
    this.isOpen = !this.isOpen;
    this.backgroundOverlay.visible = this.isOpen;
  }

  public setPosition(x: number, y: number): void {
    this.backgroundOverlay.position.set(x, y);
  }
}
