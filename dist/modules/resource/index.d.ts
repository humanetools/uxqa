import { Module, UXQAConfig } from '../../types';
export declare class ResourceModule implements Module {
    name: string;
    private brokenImage;
    constructor();
    init(config: UXQAConfig): void;
}
export { BrokenImageModule } from './broken-image';
