import * as PIXI from 'pixi.js';
import { PlayerData } from '../player/Data';

export class InterfaceManager {
  private app: PIXI.Application;
  private playerData: PlayerData;
  private characterPaneSprite: PIXI.Sprite;
  private backgroundOverlay: PIXI.Container;
  private miniUIOverlay: PIXI.Container;
  private miniUI: PIXI.Sprite;
  private isOpen: boolean = false;

  constructor(app: PIXI.Application, playerData: PlayerData) {
    this.app = app;
    this.playerData = playerData;
    this.characterPaneSprite = new PIXI.Sprite(
      PIXI.Texture.from('/UI/CharacterPane.png')
    );
    this.miniUI = new PIXI.Sprite(PIXI.Texture.from('/UI/MiniUI.png'));

    // Create background overlay container
    this.backgroundOverlay = new PIXI.Container();
    this.miniUIOverlay = new PIXI.Container();
    this.app.stage.addChild(this.miniUIOverlay);
    this.app.stage.addChild(this.backgroundOverlay);

    this.miniUI.x = this.app.screen.width * 0.01;
    this.miniUI.y = this.app.screen.height * 0.75;
    this.miniUIOverlay.addChild(this.miniUI);

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

    this.createText(
      'Strength',
      this.playerData.strength,
      0.41,
      0.61,
      this.backgroundOverlay
    );
    this.createText(
      'Health',
      this.playerData.health,
      0.41,
      0.66,
      this.backgroundOverlay
    );
    this.createText(
      'Health',
      this.playerData.health,
      0.07,
      0.79,
      this.miniUIOverlay
    );
    this.createText(
      'Armor Value',
      this.playerData.armorValue,
      0.41,
      0.71,
      this.backgroundOverlay
    );
    this.createText(
      'Stamina',
      this.playerData.stamina,
      0.41,
      0.76,
      this.backgroundOverlay
    );
    this.createText(
      'Stamina',
      this.playerData.stamina,
      0.07,
      0.85,
      this.miniUIOverlay
    );
    this.createText(
      'Health Potions',
      this.playerData.healthPotionsAmount,
      0.57,
      0.32,
      this.backgroundOverlay
    );
    this.createText(
      'Health Potions',
      this.playerData.healthPotionsAmount,
      0.08,
      0.9,
      this.miniUIOverlay
    );

    this.createText(
      'Stamina Potions',
      this.playerData.healthPotionsAmount,
      0.57,
      0.37,
      this.backgroundOverlay
    );
    this.createText(
      'Stam Potions',
      this.playerData.healthPotionsAmount,
      0.08,
      0.95,
      this.miniUIOverlay
    );

    this.createText(
      'Coins',
      this.playerData.coinAmount,
      0.57,
      0.42,
      this.backgroundOverlay
    );

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

  private createText(
    text: string,
    data: number,
    x: number,
    y: number,
    overlay: PIXI.Container
  ) {
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
    overlay.addChild(textToAdd);
  }

  public toggleCharacterPane(): void {
    this.isOpen = !this.isOpen;
    this.backgroundOverlay.visible = this.isOpen;
  }

  public setPosition(x: number, y: number): void {
    this.backgroundOverlay.position.set(x, y);
    this.miniUIOverlay.position.set(x, y);
  }

  public updateStaminaText() {
    const staminaText = this.backgroundOverlay.getChildAt(6) as PIXI.Text;
    staminaText.text = `Stamina: ${this.playerData.stamina}`;
    const miniStaminaText = this.miniUIOverlay.getChildAt(4) as PIXI.Text;
    miniStaminaText.text = `Stamina: ${this.playerData.stamina}`;
  }
}
