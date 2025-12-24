import { Module, UXQAConfig, PerformanceTiming } from '../../types';
import { DataLayerSender } from '../../utils/dataLayer';

export class PagePerformanceModule implements Module {
  name = 'PagePerformance';

  init(config: UXQAConfig): void {
    // load 이벤트 후에 측정
    if (document.readyState === 'complete') {
      // 이미 로드 완료된 경우
      this.sendPagePerformance();
    } else {
      // 로드 완료 대기
      window.addEventListener('load', () => {
        // load 이벤트 직후에는 값이 아직 0일 수 있으므로 약간 지연
        setTimeout(() => {
          this.sendPagePerformance();
        }, 0);
      });
    }
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