import { Module, UXQAConfig } from '../../types';
export declare class NetworkModule implements Module {
    name: string;
    private httpError;
    private firstPartyAPI;
    private thirdPartyAPI;
    constructor();
    init(config: UXQAConfig): void;
}
export { HTTPErrorModule } from './http-error';
export { FirstPartyAPIModule } from './first-party-api';
export { ThirdPartyAPIModule } from './third-party-api';
