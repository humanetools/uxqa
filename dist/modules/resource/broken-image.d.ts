import { Module, UXQAConfig } from '../../types';
export declare class BrokenImageModule implements Module {
    name: string;
    private SENT_FLAG;
    init(config: UXQAConfig): void;
    private getViewportArea;
    private getImageDimensions;
    private safeLn;
    private pushImageIssue;
    private setupImageErrorListener;
    private scanNaturalSizeZero;
    private setupNaturalSizeScanner;
}
