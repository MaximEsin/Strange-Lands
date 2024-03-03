export class PlayerData {
  private _strength: number = 1;
  private _health: number = 3;
  private _armorValue: number = 1;
  private _stamina: number = 50;
  private _healthPotionsAmount: number = 0;
  private _staminaPotionsAmount: number = 0;
  private _coinAmount: number = 0;

  get strength() {
    return this._strength;
  }

  get health() {
    return this._health;
  }
  get stamina() {
    return this._stamina;
  }
  get armorValue() {
    return this._armorValue;
  }
  get healthPotionsAmount() {
    return this._healthPotionsAmount;
  }
  get staminaPotionsAmount() {
    return this._staminaPotionsAmount;
  }
  get coinAmount() {
    return this._coinAmount;
  }
}
