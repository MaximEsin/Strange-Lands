export class InputManager {
  private keys: { [key: string]: boolean } = {};
  private lastKeyPressed: string | null = null;

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.keys[event.code] = true;
    this.lastKeyPressed = event.code;
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keys[event.code] = false;
  }

  public isKeyPressed(key: string): boolean {
    return this.keys[key];
  }

  public getLastKeyPressed(): string | null {
    return this.lastKeyPressed;
  }
}
