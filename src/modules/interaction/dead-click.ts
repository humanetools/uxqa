import { Module, UXQAConfig, DeadClickContext } from '../../types';
import { DataLayerSender } from '../../utils/dataLayer';
import { DOMUtils } from '../../utils/dom';

export class DeadClickModule implements Module {
  name = 'DeadClick';

  private OBSERVATION_WINDOW_MS = 800;
  private urlChangeDetected = false;
  private domMutationDetected = false;
  private observerInstance: MutationObserver | null = null;
  private timeoutId: number | null = null;
  private currentClickContext: DeadClickContext | null = null;
  private lastHref = location.href;

  init(config: UXQAConfig): void {
    DataLayerSender.log('Dead Click Detector initializing...');
    this.setupClickListener();
    this.setupURLChangeDetection();
    DataLayerSender.log('Dead Click Detector fully initialized and ready');
  }

  private setupClickListener(): void {
    document.addEventListener('click', (e) => {
      let target = e.target as HTMLElement;

      while (target && target !== document.body) {
        if (this.shouldIgnoreClick(target)) {
          return;
        }

        if (this.isClickableElement(target)) {
          break;
        }

        target = target.parentElement as HTMLElement;
      }

      if (!target || target === document.body) {
        return;
      }

      DataLayerSender.log('Dead Click tracking started:', target.tagName, target.innerText);

      this.cleanup();

      this.currentClickContext = {
        elementPath: DOMUtils.formatElementInfo(target),
        text: DOMUtils.getElementText(target, 50)
      };

      this.startMutationObserver();
      this.timeoutId = window.setTimeout(() => this.reportDeadClickCandidate(), this.OBSERVATION_WINDOW_MS);
    }, true);
  }

  private isClickableElement(element: HTMLElement): boolean {
    return (
      element.tagName === 'BUTTON' ||
      element.tagName === 'A' ||
      !!element.onclick ||
      element.getAttribute('role') === 'button'
    );
  }

  private shouldIgnoreClick(target: HTMLElement): boolean {
    if ((target as any).disabled) return true;

    if (target.tagName === 'A') {
      const href = target.getAttribute('href');
      if (href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
        return true;
      }
    }

    return false;
  }

  private startMutationObserver(): void {
    if (!document.body) return;

    this.observerInstance = new MutationObserver((mutations) => {
      let hasMeaningfulChange = false;

      for (const mutation of mutations) {
        if (mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
          hasMeaningfulChange = true;
          break;
        }
        if (mutation.type === 'attributes') {
          hasMeaningfulChange = true;
          break;
        }
      }

      if (hasMeaningfulChange) {
        DataLayerSender.log('Dead Click - DOM mutation detected');
        this.domMutationDetected = true;
        this.cleanup();
      }
    });

    this.observerInstance.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'hidden', 'aria-hidden']
    });
  }

  private detectUrlChange(): void {
    const currentUrl = location.href.replace(/#$/, '');
    const previousUrl = this.lastHref.replace(/#$/, '');

    if (currentUrl !== previousUrl) {
      DataLayerSender.log('Dead Click - Meaningful URL change');
      this.urlChangeDetected = true;
      this.cleanup();
    }
  }

  private setupURLChangeDetection(): void {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      this.detectUrlChange();
      return originalPushState.apply(history, args);
    };

    history.replaceState = (...args) => {
      this.detectUrlChange();
      return originalReplaceState.apply(history, args);
    };

    window.addEventListener('hashchange', () => this.detectUrlChange());
    window.addEventListener('popstate', () => this.detectUrlChange());

    setInterval(() => {
      const currentHref = location.href;
      if (currentHref !== this.lastHref) {
        this.detectUrlChange();
        this.lastHref = currentHref;
      }
    }, 100);
  }

  private reportDeadClickCandidate(): void {
    DataLayerSender.log('Dead Click timer fired. URL changed:', this.urlChangeDetected, 'DOM changed:', this.domMutationDetected);

    if (this.urlChangeDetected || this.domMutationDetected) {
      DataLayerSender.log('Dead Click - Response detected, not a dead click');
      this.cleanup();
      return;
    }

    if (!this.currentClickContext) {
      this.cleanup();
      return;
    }

    DataLayerSender.log('DEAD CLICK DETECTED!', this.currentClickContext);

    DataLayerSender.push({
      event: 'uxqa_dead_click_candidate',
      interaction_deadClick_element: this.currentClickContext.elementPath,
      interaction_deadClick_text: this.currentClickContext.text
    });

    this.cleanup();
  }

  private cleanup(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.observerInstance) {
      this.observerInstance.disconnect();
      this.observerInstance = null;
    }
    this.urlChangeDetected = false;
    this.domMutationDetected = false;
    this.currentClickContext = null;
  }

  destroy(): void {
    this.cleanup();
  }
}
