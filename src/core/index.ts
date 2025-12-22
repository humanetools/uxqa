import UXQA from './uxqa';
import { UXQAConfig } from '../types';

// Auto-initialize if window.uxqaConfig exists
if (typeof window !== 'undefined') {
  const config = (window as any).uxqaConfig as Partial<UXQAConfig> | undefined;
  
  if (config) {
    const instance = new UXQA(config);
    (window as any).UXQA = instance;
  } else {
    // Expose UXQA class for manual initialization
    (window as any).UXQA = UXQA;
  }
}

export default UXQA;
export * from '../types';
