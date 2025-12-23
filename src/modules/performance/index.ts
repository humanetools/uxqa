import { Module, UXQAConfig } from '../../types';
import { WebVitalsModule } from './web-vitals';
import { PagePerformanceModule } from './page-performance';
import { DataLayerSender } from '../../utils/dataLayer';

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
    DataLayerSender.log('Initialized: Performance Module (QA0101, QA0102)');
  }
}

export { WebVitalsModule } from './web-vitals';
export { PagePerformanceModule } from './page-performance';
