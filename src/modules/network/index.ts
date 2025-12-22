import { Module, UXQAConfig } from '../../types';
import { HTTPErrorModule } from './http-error';
import { FirstPartyAPIModule } from './first-party-api';
import { ThirdPartyAPIModule } from './third-party-api';

export class NetworkModule implements Module {
  name = 'Network';
  private httpError: HTTPErrorModule;
  private firstPartyAPI: FirstPartyAPIModule;
  private thirdPartyAPI: ThirdPartyAPIModule;

  constructor() {
    this.httpError = new HTTPErrorModule();
    this.firstPartyAPI = new FirstPartyAPIModule();
    this.thirdPartyAPI = new ThirdPartyAPIModule();
  }

  init(config: UXQAConfig): void {
    this.httpError.init(config);
    this.firstPartyAPI.init(config);
    this.thirdPartyAPI.init(config);
  }
}

export { HTTPErrorModule } from './http-error';
export { FirstPartyAPIModule } from './first-party-api';
export { ThirdPartyAPIModule } from './third-party-api';
