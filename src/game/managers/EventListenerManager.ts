import { InterfaceManager } from './InterfaceManager';

export class EventListenerManager {
  private interfaceManager: InterfaceManager;
  constructor(interfaceManager: InterfaceManager) {
    this.interfaceManager = interfaceManager;
  }

  setupEventListeners() {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.interfaceManager.toggleCharacterPane();
      }
    });
  }
}
