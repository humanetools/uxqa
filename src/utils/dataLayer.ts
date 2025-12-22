import { DataLayerEvent } from '../types';

export class DataLayerSender {
  private static ensureDataLayer(): void {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
    }
  }

  static push(event: DataLayerEvent): void {
    this.ensureDataLayer();
    window.dataLayer.push(event);
  }

  static log(message: string, ...args: any[]): void {
    if (console && console.log) {
      console.log(`[UXQA] ${message}`, ...args);
    }
  }
}
