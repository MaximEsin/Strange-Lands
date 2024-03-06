import { PlayerData } from '../player/Data';

export class InterfaceManager {
  private playerData: PlayerData;
  private overlay: HTMLDivElement;
  private pane: HTMLDivElement;
  private miniUI: HTMLDivElement;
  private paneImage: HTMLImageElement;
  private miniUIImage: HTMLImageElement;

  constructor(playerData: PlayerData) {
    this.playerData = playerData;
    this.overlay = document.createElement('div');
    this.overlay.classList.add('overlay');
    this.overlay.style.display = 'none';

    this.pane = document.createElement('div');
    this.pane.classList.add('pane');
    this.overlay.appendChild(this.pane);

    this.paneImage = document.createElement('img');
    this.paneImage.src = '/UI/CharacterPane.png';
    this.paneImage.classList.add('paneImage');
    this.pane.appendChild(this.paneImage);

    this.miniUI = document.createElement('div');
    this.miniUI.classList.add('mini-ui');
    document.body.appendChild(this.miniUI);

    this.miniUIImage = document.createElement('img');
    this.miniUIImage.src = '/UI/MiniUI.png';
    this.miniUI.appendChild(this.miniUIImage);

    this.createText('Name: Aragain', 'name');
    this.createText(`Strength: ${playerData.strength}`, 'strength');
    this.createText(`Health: ${playerData.health}`, 'health');
    this.createText(`Armor Value: ${playerData.armorValue}`, 'armor-value');
    this.createText(`Stamina: ${playerData.stamina}`, 'stamina');
    this.createText(
      `Health Potions: ${playerData.healthPotionsAmount}`,
      'health-potions'
    );
    this.createText(
      `Stamina Potions: ${playerData.staminaPotionsAmount}`,
      'stamina-potions'
    );
    this.createText(`Coins: ${playerData.coinAmount}`, 'coins');
    this.createText('Current gear', 'gear');

    this.createMiniText(`Health: ${playerData.health}`, 'mini-health');
    this.createMiniText(`Stamina: ${playerData.stamina}`, 'mini-stamina');
    this.createMiniText(
      `HP Pots: ${playerData.healthPotionsAmount}`,
      'mini-health-potions'
    );
    this.createMiniText(
      `Stam Pots: ${playerData.staminaPotionsAmount}`,
      'mini-stamina-potions'
    );

    document.body.appendChild(this.overlay);
  }

  createText(text: string, id: string) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${text}</strong>`;
    p.classList.add(id);
    p.classList.add('text');
    this.pane.appendChild(p);
  }

  createMiniText(text: string, id: string) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${text}</strong>`;
    p.classList.add(id);
    p.classList.add('text');
    this.miniUI.appendChild(p);
  }

  toggleCharacterPane() {
    this.overlay.style.display =
      this.overlay.style.display === 'none' ? 'block' : 'none';
  }

  public updateUIData() {
    const staminaElement = document.querySelector('.stamina');
    if (staminaElement) {
      staminaElement.innerHTML = `<strong>Stamina: ${this.playerData.stamina}</strong>`;
    }

    const miniStaminaElement = document.querySelector('.mini-stamina');
    if (miniStaminaElement) {
      miniStaminaElement.innerHTML = `<strong>Stamina: ${this.playerData.stamina}</strong>`;
    }
  }
}
