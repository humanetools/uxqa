import { UXQAConfig } from '../types';

export const defaultConfig: UXQAConfig = {
  apiKey: '',
  endpoint: '',
  modules: {
    performance: true,
    network: true,
    interaction: true,
    resource: true,
  },
  debug: false,
};

export function mergeConfig(userConfig?: Partial<UXQAConfig>): UXQAConfig {
  if (!userConfig) return { ...defaultConfig };

  return {
    ...defaultConfig,
    ...userConfig,
    modules: {
      ...defaultConfig.modules,
      ...userConfig.modules,
    },
  };
}
