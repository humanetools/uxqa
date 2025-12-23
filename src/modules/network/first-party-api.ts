import { Module, UXQAConfig } from '../../types';
import { DataLayerSender } from '../../utils/dataLayer';

/**
 * QA0202 - First Party API 에러 감지
 * TODO: 실제 구현 필요
 */
export class FirstPartyAPIModule implements Module {
  name = 'FirstPartyAPI';

  init(config: UXQAConfig): void {
    DataLayerSender.log('  - QA0202 (First Party API Error): Implementation pending');
    // TODO: First Party API 에러 감지 로직 구현
    // - 동일 도메인 API 요청 모니터링
    // - fetch/XHR interception
    // - 응답 시간 및 에러 추적
  }

  // TODO: Implement actual API monitoring logic
  private monitorFirstPartyAPI(): void {
    // Implementation will be added
  }
}
