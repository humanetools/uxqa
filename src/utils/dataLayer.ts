import { DataLayerEvent } from '../types';

export class DataLayerSender {
  private static debugMode: boolean = false;

  static setDebugMode(debug: boolean): void {
    this.debugMode = debug;
  }

  private static ensureDataLayer(): void {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
    }
  }

  static push(event: DataLayerEvent): void {
    this.ensureDataLayer();
    window.dataLayer.push(event);

    // debug 모드일 때 DataLayer 이벤트 로그 출력
    if (this.debugMode && event.event) {
      console.log(`📊 DataLayer Event: ${event.event}`, event);
    }
  }

  static log(message: string, ...args: any[]): void {
    if (this.debugMode && console && console.log) {
      console.log(`[UXQA] ${message}`, ...args);
    }
  }
}
