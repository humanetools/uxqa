import { Module, UXQAConfig } from '../../types';
export declare class WebVitalsModule implements Module {
    name: string;
    init(config: UXQAConfig): void;
    private setupVitalsTracking;
}
