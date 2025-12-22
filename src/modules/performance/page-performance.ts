import { Module, UXQAConfig, PerformanceTiming } from '../../types';
import { DataLayerSender } from '../../utils/dataLayer';

export class PagePerformanceModule implements Module {
  name = 'PagePerformance';

  init(config: UXQAConfig): void {
    this.sendPagePerformance();
  }

  private sendPagePerformance(): void {
    try {
      let navEntry: PerformanceNavigationTiming | null = null;
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];

      if (entries && entries.length > 0) {
        navEntry = entries[0];
      }

      let totalLoadTime: number | null = null;
      let domContentLoadedTime: number | null = null;

      if (navEntry) {
        totalLoadTime = navEntry.loadEventEnd;
        domContentLoadedTime = navEntry.domContentLoadedEventEnd;
      } else if (performance.timing) {
        const t = performance.timing;
        totalLoadTime = t.loadEventEnd - t.navigationStart;
        domContentLoadedTime = t.domContentLoadedEventEnd - t.navigationStart;
      }

      DataLayerSender.push({
        event: 'page_performance',
        performance_total_load_time: totalLoadTime,
        performance_dom_content_loaded_time: domContentLoadedTime,
      });
    } catch (e) {
      // Silent fail
    }
  }
}
