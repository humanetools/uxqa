import { Module, UXQAConfig } from '../../types';
export declare class PagePerformanceModule implements Module {
    name: string;
    init(config: UXQAConfig): void;
    private sendPagePerformance;
}
