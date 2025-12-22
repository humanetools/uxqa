import { Module, UXQAConfig } from '../../types';
export declare class PerformanceModule implements Module {
    name: string;
    private webVitals;
    private pagePerformance;
    constructor();
    init(config: UXQAConfig): void;
}
export { WebVitalsModule } from './web-vitals';
export { PagePerformanceModule } from './page-performance';
