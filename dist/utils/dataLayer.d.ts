import { DataLayerEvent } from '../types';
export declare class DataLayerSender {
    private static debugMode;
    static setDebugMode(debug: boolean): void;
    private static ensureDataLayer;
    static push(event: DataLayerEvent): void;
    static log(message: string, ...args: any[]): void;
}
