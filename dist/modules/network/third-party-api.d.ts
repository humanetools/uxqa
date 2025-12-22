import { Module, UXQAConfig } from '../../types';
export declare class ThirdPartyAPIModule implements Module {
    name: string;
    private queue;
    private gtmLoaded;
    private originalFetch;
    private originalXHR;
    private currentDomain;
    private blacklistPatterns;
    constructor();
    init(config: UXQAConfig): void;
    private isExternal;
    private isBlacklisted;
    private shouldTrack;
    private shouldIgnore;
    private trackFailure;
    private flushQueue;
    private setupGTMDetection;
    private monitorFetch;
    private monitorXHR;
    private monitorScriptErrors;
}
