import { Module, UXQAConfig } from '../../types';
export declare class InteractionModule implements Module {
    name: string;
    private deadClick;
    constructor();
    init(config: UXQAConfig): void;
    destroy(): void;
}
export { DeadClickModule } from './dead-click';
