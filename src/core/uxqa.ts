import { UXQAConfig, Module } from '../types';
import { mergeConfig } from './config';
import { PerformanceModule } from '../modules/performance';
import { NetworkModule } from '../modules/network';
import { InteractionModule } from '../modules/interaction';
import { ResourceModule } from '../modules/resource';
import { DataLayerSender } from '../utils/dataLayer';

class UXQA {
  private config: UXQAConfig;
  private modules: Map<string, Module> = new Map();
  private initialized = false;

  constructor(userConfig?: Partial<UXQAConfig>) {
    this.config = mergeConfig(userConfig);
    
    // Auto-initialize if config is provided
    if (userConfig) {
      this.init();
    }
  }

  /**
   * Initialize UXQA with configuration
   */
  init(userConfig?: Partial<UXQAConfig>): void {
    if (this.initialized) {
      DataLayerSender.log('UXQA already initialized');
      return;
    }

    if (userConfig) {
      this.config = mergeConfig(userConfig);
    }

    DataLayerSender.log('UXQA initializing with config:', this.config);

    this.registerModules();
    this.initializeModules();

    this.initialized = true;
    DataLayerSender.log('UXQA initialization complete');
  }

  /**
   * Register all modules based on configuration
   */
  private registerModules(): void {
    if (this.config.modules?.performance) {
      this.modules.set('performance', new PerformanceModule());
    }

    if (this.config.modules?.network) {
      this.modules.set('network', new NetworkModule());
    }

    if (this.config.modules?.interaction) {
      this.modules.set('interaction', new InteractionModule());
    }

    if (this.config.modules?.resource) {
      this.modules.set('resource', new ResourceModule());
    }
  }

  /**
   * Initialize all registered modules
   */
  private initializeModules(): void {
    this.modules.forEach((module, name) => {
      try {
        module.init(this.config);
        DataLayerSender.log(`Module initialized: ${name}`);
      } catch (error) {
        console.error(`Failed to initialize module: ${name}`, error);
      }
    });
  }

  /**
   * Get current configuration
   */
  getConfig(): UXQAConfig {
    return { ...this.config };
  }

  /**
   * Update configuration (requires re-initialization)
   */
  setConfig(newConfig: Partial<UXQAConfig>): void {
    this.config = mergeConfig(newConfig);
    DataLayerSender.log('Configuration updated. Call init() to apply changes.');
  }

  /**
   * Destroy all modules and clean up
   */
  destroy(): void {
    this.modules.forEach((module) => {
      if (module.destroy) {
        module.destroy();
      }
    });
    this.modules.clear();
    this.initialized = false;
    DataLayerSender.log('UXQA destroyed');
  }
}

export default UXQA;
