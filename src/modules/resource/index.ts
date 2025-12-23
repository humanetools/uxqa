import { Module, UXQAConfig } from '../../types';
import { BrokenImageModule } from './broken-image';
import { DataLayerSender } from '../../utils/dataLayer';

export class ResourceModule implements Module {
  name = 'Resource';
  private brokenImage: BrokenImageModule;

  constructor() {
    this.brokenImage = new BrokenImageModule();
  }

  init(config: UXQAConfig): void {
    this.brokenImage.init(config);
    DataLayerSender.log('Initialized: Resource Module (QA0401)');
  }
}

export { BrokenImageModule } from './broken-image';
