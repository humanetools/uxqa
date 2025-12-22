import { Module, UXQAConfig, APIFailure } from '../../types';
import { DataLayerSender } from '../../utils/dataLayer';

export class ThirdPartyAPIModule implements Module {
  name = 'ThirdPartyAPI';
  
  private queue: any[] = [];
  private gtmLoaded = false;
  private originalFetch: typeof fetch;
  private originalXHR: typeof XMLHttpRequest;
  private currentDomain: string;
  
  // 제외할 패턴 (블랙리스트)
  private blacklistPatterns = [
    /\.(jpg|jpeg|png|gif|webp|svg|ico|bmp)(\?|$)/i,
    /\.(woff|woff2|ttf|eot|otf)(\?|$)/i,
    /\.css(\?|$)/i,
    /cdn\.jsdelivr\.net/,
    /cdnjs\.cloudflare\.com/,
    /unpkg\.com/,
    /fonts\.googleapis\.com/,
    /fonts\.gstatic\.com/,
    /\.(mp4|webm|ogg|mp3|wav)(\?|$)/i
  ];

  constructor() {
    this.originalFetch = window.fetch;
    this.originalXHR = window.XMLHttpRequest;
    this.currentDomain = window.location.hostname;
  }

  init(config: UXQAConfig): void {
    this.setupGTMDetection();
    this.monitorFetch();
    this.monitorXHR();
    this.monitorScriptErrors();
  }

  private isExternal(url: string): boolean {
    if (!url) return false;
    try {
      const urlObj = new URL(url, window.location.href);
      return urlObj.hostname !== this.currentDomain;
    } catch (e) {
      return false;
    }
  }

  private isBlacklisted(url: string): boolean {
    return this.blacklistPatterns.some(p => p.test(url));
  }

  private shouldTrack(url: string): boolean {
    return this.isExternal(url) && !this.isBlacklisted(url);
  }

  private shouldIgnore(url: string, status: number): boolean {
    if (url.indexOf('_dbg=1') > -1 || url.indexOf('gtm_debug=') > -1) return true;
    if (status === 0 && url.indexOf('google-analytics.com/g/collect') > -1) return true;
    if (url.indexOf('gtag/js?id=DUMMY') > -1) return true;
    if (url.indexOf('googletagmanager.com/gtag/js') > -1 && url.indexOf('id=DUMMY') > -1) return true;
    return false;
  }

  private trackFailure(url: string, status: number, errorType: string): void {
    if (this.shouldIgnore(url, status)) return;

    const event = {
      event: 'third_party_api_failure',
      api_url: url,
      status_code: status,
      error_type: errorType,
      timestamp: new Date().toISOString()
    };

    if (this.gtmLoaded) {
      DataLayerSender.push(event);
    } else {
      this.queue.push(event);
    }
  }

  private flushQueue(): void {
    this.gtmLoaded = true;
    while (this.queue.length > 0) {
      DataLayerSender.push(this.queue.shift());
    }
  }

  private setupGTMDetection(): void {
    const checkGTM = setInterval(() => {
      if ((window as any).google_tag_manager || (window.dataLayer && window.dataLayer.push)) {
        clearInterval(checkGTM);
        this.flushQueue();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkGTM);
      if (!this.gtmLoaded) this.flushQueue();
    }, 10000);
  }

  private monitorFetch(): void {
    const self = this;
    window.fetch = function(...args: any[]) {
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      const trackThis = self.shouldTrack(url);

      return self.originalFetch.apply(this, args)
        .then((res: Response) => {
          if (trackThis && !res.ok) {
            self.trackFailure(url, res.status, 'fetch_error');
          }
          return res;
        })
        .catch((err: Error) => {
          if (trackThis) {
            self.trackFailure(url, 0, 'fetch_exception');
          }
          throw err;
        });
    };
  }

  private monitorXHR(): void {
    const self = this;
    const OriginalXHR = this.originalXHR;

    window.XMLHttpRequest = function(this: XMLHttpRequest) {
      const xhr = new OriginalXHR();
      let url: string;

      const origOpen = xhr.open;
      xhr.open = function(...args: any[]) {
        url = args[1];
        return origOpen.apply(this, args);
      };

      xhr.addEventListener('error', function() {
        if (self.shouldTrack(url)) self.trackFailure(url, 0, 'xhr_error');
      });

      xhr.addEventListener('load', function() {
        if (self.shouldTrack(url) && xhr.status >= 400) {
          self.trackFailure(url, xhr.status, 'xhr_http_error');
        }
      });

      return xhr;
    } as any;

    window.XMLHttpRequest.prototype = OriginalXHR.prototype;
  }

  private monitorScriptErrors(): void {
    window.addEventListener('error', (e) => {
      const target = e.target as HTMLScriptElement;
      if (target && target.tagName === 'SCRIPT' && target.src && this.shouldTrack(target.src)) {
        this.trackFailure(target.src, 0, 'script_load_error');
      }
    }, true);
  }
}
