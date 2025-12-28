import { Module, UXQAConfig, DeadClickContext } from '../../types';
import { DataLayerSender } from '../../utils/dataLayer';
import { DOMUtils } from '../../utils/dom';

export class DeadClickModule implements Module {
  name = 'DeadClick';

  private OBSERVATION_WINDOW_MS = 800;
  private urlChangeDetected = false;
  private domMutationDetected = false;
  private userActivityDetected = false;  // 새로 추가
  private observerInstance: MutationObserver | null = null;
  private timeoutId: number | null = null;
  private currentClickContext: DeadClickContext | null = null;
  private lastHref = location.href;

  init(config: UXQAConfig): void {
    this.setupClickListener();
    this.setupURLChangeDetection();
    this.setupUserActivityDetection();  // 새로 추가
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
    DataLayerSender.log('Dead Click timer fired. URL changed:', this.urlChangeDetected, 'DOM changed:', this.domMutationDetected, 'User activity:', this.userActivityDetected);

    if (this.urlChangeDetected || this.domMutationDetected || this.userActivityDetected) {
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
    this.userActivityDetected = false;  // 추가
    this.currentClickContext = null;
  }

  destroy(): void {
    this.cleanup();
  }

  private setupUserActivityDetection(): void {
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    const originalPrompt = window.prompt;
    const originalOpen = window.open;
    const originalScrollTo = window.scrollTo;
    const originalScrollBy = window.scrollBy;
    const originalSetItem = Storage.prototype.setItem;

    // alert, confirm, prompt 감지
    window.alert = (...args) => {
      DataLayerSender.log('Dead Click - alert() detected');
      this.userActivityDetected = true;
      return originalAlert.apply(window, args);
    };

    window.confirm = (...args) => {
      DataLayerSender.log('Dead Click - confirm() detected');
      this.userActivityDetected = true;
      return originalConfirm.apply(window, args);
    };

    window.prompt = (...args) => {
      DataLayerSender.log('Dead Click - prompt() detected');
      this.userActivityDetected = true;
      return originalPrompt.apply(window, args);
    };

    // window.open 감지
    window.open = (...args) => {
      DataLayerSender.log('Dead Click - window.open() detected');
      this.userActivityDetected = true;
      return originalOpen.apply(window, args);
    };

    // scroll 감지
    window.scrollTo = (...args) => {
      DataLayerSender.log('Dead Click - scrollTo() detected');
      this.userActivityDetected = true;
      return originalScrollTo.apply(window, args);
    };

    window.scrollBy = (...args) => {
      DataLayerSender.log('Dead Click - scrollBy() detected');
      this.userActivityDetected = true;
      return originalScrollBy.apply(window, args);
    };

    // localStorage/sessionStorage 감지
    Storage.prototype.setItem = function(...args) {
      DataLayerSender.log('Dead Click - storage.setItem() detected');
      if (this === window.localStorage || this === window.sessionStorage) {
        const module = (window as any).__uxqa_deadclick_module__;
        if (module) {
          module.userActivityDetected = true;
        }
      }
      return originalSetItem.apply(this, args);
    };

    // 모듈 인스턴스를 window에 저장 (storage 감지용)
    (window as any).__uxqa_deadclick_module__ = this;
  }
}