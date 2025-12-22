import { UXQAConfig } from '../types';
declare class UXQA {
    private config;
    private modules;
    private initialized;
    constructor(userConfig?: Partial<UXQAConfig>);
    /**
     * Initialize UXQA with configuration
     */
    init(userConfig?: Partial<UXQAConfig>): void;
    /**
     * Register all modules based on configuration
     */
    private registerModules;
    /**
     * Initialize all registered modules
     */
    private initializeModules;
    /**
     * Get current configuration
     */
    getConfig(): UXQAConfig;
    /**
     * Update configuration (requires re-initialization)
     */
    setConfig(newConfig: Partial<UXQAConfig>): void;
    /**
     * Destroy all modules and clean up
     */
    destroy(): void;
}
export default UXQA;
