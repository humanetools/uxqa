import { Module, UXQAConfig } from '../../types';
/**
 * QA0202 - First Party API 에러 감지
 * TODO: 실제 구현 필요
 */
export declare class FirstPartyAPIModule implements Module {
    name: string;
    init(config: UXQAConfig): void;
    private monitorFirstPartyAPI;
}
