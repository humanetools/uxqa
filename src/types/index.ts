// Global types for UXQA library

export interface UXQAConfig {
  apiKey?: string;
  endpoint?: string;
  modules?: {
    performance?: boolean;
    network?: boolean;
    interaction?: boolean;
    resource?: boolean;
  };
  debug?: boolean;
}

export interface DataLayerEvent {
  event: string;
  [key: string]: any;
}

export interface Module {
  name: string;
  init(config: UXQAConfig): void;
  destroy?(): void;
}

// Web Vitals types
export interface Metric {
  name: string;
  value: number;
  id: string;
  delta?: number;
  navigationType?: string;
}

// Performance types
export interface PerformanceTiming {
  totalLoadTime: number | null;
  domContentLoadedTime: number | null;
}

// Network types
export interface APIFailure {
  url: string;
  status: number;
  errorType: string;
  timestamp: string;
}

// Interaction types
export interface DeadClickContext {
  elementPath: string;
  text: string;
}

// Resource types
export interface ImageError {
  reason: string;
  src: string;
  page: string;
  areaPx2: number;
  arLn: number | null;
  coverage: number | null;
}

declare global {
  interface Window {
    dataLayer: any[];
    UXQA: any;
  }
}
