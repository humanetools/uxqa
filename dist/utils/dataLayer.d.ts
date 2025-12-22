import { DataLayerEvent } from '../types';
export declare class DataLayerSender {
    private static ensureDataLayer;
    static push(event: DataLayerEvent): void;
    static log(message: string, ...args: any[]): void;
}
