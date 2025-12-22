import { Module, UXQAConfig } from '../../types';
import { DeadClickModule } from './dead-click';

export class InteractionModule implements Module {
  name = 'Interaction';
  private deadClick: DeadClickModule;

  constructor() {
    this.deadClick = new DeadClickModule();
  }

  init(config: UXQAConfig): void {
    this.deadClick.init(config);
  }

  destroy(): void {
    this.deadClick.destroy?.();
  }
}

export { DeadClickModule } from './dead-click';
