import { Module, UXQAConfig } from '../../types';
/**
 * QA0201 - 4xx, 5xx HTTP 에러 감지
 * TODO: 실제 구현 필요
 */
export declare class HTTPErrorModule implements Module {
    name: string;
    init(config: UXQAConfig): void;
    private detectHTTPErrors;
}
