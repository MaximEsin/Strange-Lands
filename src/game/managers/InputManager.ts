export class InputManager {
  private keys: { [key: string]: boolean } = {};
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private mouseButtons: { [button: number]: boolean } = {};

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mousedown', this.handleMouseDown.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.keys[event.code] = true;
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keys[event.code] = false;
  }

  private handleMouseMove(event: MouseEvent): void {
    this.mousePosition = { x: event.clientX, y: event.clientY };
  }

  private handleMouseDown(event: MouseEvent): void {
    this.mouseButtons[event.button] = true;
  }

  private handleMouseUp(event: MouseEvent): void {
    this.mouseButtons[event.button] = false;
  }

  public isKeyPressed(key: string): boolean {
    return this.keys[key];
  }

  public isMouseButtonPressed(button: number): boolean {
    return this.mouseButtons[button];
  }

  public getMousePosition(): { x: number; y: number } {
    return this.mousePosition;
  }
}
