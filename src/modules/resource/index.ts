import { Module, UXQAConfig } from '../../types';
import { BrokenImageModule } from './broken-image';

export class ResourceModule implements Module {
  name = 'Resource';
  private brokenImage: BrokenImageModule;

  constructor() {
    this.brokenImage = new BrokenImageModule();
  }

  init(config: UXQAConfig): void {
    this.brokenImage.init(config);
  }
}

export { BrokenImageModule } from './broken-image';
