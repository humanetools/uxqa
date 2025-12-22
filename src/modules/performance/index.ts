import { Module, UXQAConfig } from '../../types';
import { WebVitalsModule } from './web-vitals';
import { PagePerformanceModule } from './page-performance';

export class PerformanceModule implements Module {
  name = 'Performance';
  private webVitals: WebVitalsModule;
  private pagePerformance: PagePerformanceModule;

  constructor() {
    this.webVitals = new WebVitalsModule();
    this.pagePerformance = new PagePerformanceModule();
  }

  init(config: UXQAConfig): void {
    this.webVitals.init(config);
    this.pagePerformance.init(config);
  }
}

export { WebVitalsModule } from './web-vitals';
export { PagePerformanceModule } from './page-performance';
