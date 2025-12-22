import { onFCP, onLCP, onCLS, onINP, onTTFB } from 'web-vitals';
import { Module, UXQAConfig, Metric } from '../../types';
import { DataLayerSender } from '../../utils/dataLayer';

export class WebVitalsModule implements Module {
  name = 'WebVitals';

  init(config: UXQAConfig): void {
    this.setupVitalsTracking();
  }

  private setupVitalsTracking(): void {
    const sendToDataLayer = (metric: Metric) => {
      DataLayerSender.push({
        event: 'web_vitals',
        performance_vital_name: metric.name,
        performance_vital_value: metric.value,
        performance_vital_id: metric.id,
      });
    };

    // Metric listeners
    onFCP(sendToDataLayer);
    onLCP(sendToDataLayer);
    onCLS(sendToDataLayer);
    onINP(sendToDataLayer);
    onTTFB(sendToDataLayer);
  }
}
