import { App } from '../../App';

export class StartScreen {
  private overlay: HTMLDivElement;
  private startButton: HTMLButtonElement;
  private backgroundImage: HTMLImageElement;
  private buttonImage: HTMLImageElement;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.style.position = 'fixed';
    this.overlay.style.width = '100%';
    this.overlay.style.height = '100%';
    this.overlay.style.top = '0';
    this.overlay.style.left = '0';
    this.overlay.style.display = 'flex';
    this.overlay.style.alignItems = 'center';
    this.overlay.style.justifyContent = 'center';

    this.backgroundImage = new Image();
    this.backgroundImage.src = '/Screens/Startscreen.webp';
    this.backgroundImage.style.maxWidth = '100%';
    this.backgroundImage.style.maxHeight = '100%';
    this.overlay.appendChild(this.backgroundImage);

    this.startButton = document.createElement('button');
    this.startButton.style.position = 'absolute';
    this.startButton.style.left = `${window.innerWidth / 2 - 120}px`;
    this.startButton.style.top = `${window.innerHeight / 2 - 50}px`;
    this.startButton.style.backgroundColor = 'transparent';
    this.startButton.style.border = 'none';
    this.startButton.style.cursor = 'pointer';
    this.overlay.appendChild(this.startButton);

    this.buttonImage = new Image();
    this.buttonImage.src = '/UI/StartButton.webp';
    this.startButton.appendChild(this.buttonImage);

    this.startButton.addEventListener('click', () => this.onClick());

    document.body.appendChild(this.overlay);

    this.adjustBackgroundImageSize();
    window.addEventListener('resize', () => this.adjustBackgroundImageSize());
  }

  private adjustBackgroundImageSize(): void {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    this.backgroundImage.style.width = `${screenWidth}px`;
    this.backgroundImage.style.height = `${screenHeight}px`;
  }

  private onClick() {
    this.overlay.style.display = 'none';
    const app = new App();
    app.start();
  }

  public init() {}
}
