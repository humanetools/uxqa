import { Module, UXQAConfig } from '../../types';
export declare class DeadClickModule implements Module {
    name: string;
    private OBSERVATION_WINDOW_MS;
    private urlChangeDetected;
    private domMutationDetected;
    private userActivityDetected;
    private observerInstance;
    private timeoutId;
    private currentClickContext;
    private lastHref;
    init(config: UXQAConfig): void;
    private setupClickListener;
    private isClickableElement;
    private shouldIgnoreClick;
    private startMutationObserver;
    private detectUrlChange;
    private setupURLChangeDetection;
    private reportDeadClickCandidate;
    private cleanup;
    destroy(): void;
    private setupUserActivityDetection;
}
