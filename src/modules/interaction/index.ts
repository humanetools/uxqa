import { Module, UXQAConfig } from '../../types';
import { DeadClickModule } from './dead-click';
import { DataLayerSender } from '../../utils/dataLayer';

export class InteractionModule implements Module {
  name = 'Interaction';
  private deadClick: DeadClickModule;

  constructor() {
    this.deadClick = new DeadClickModule();
  }

  init(config: UXQAConfig): void {
    this.deadClick.init(config);
    DataLayerSender.log('Initialized: Interaction Module (QA0301)');
  }

  destroy(): void {
    this.deadClick.destroy?.();
  }
}

export { DeadClickModule } from './dead-click';
