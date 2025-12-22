import { Module, UXQAConfig, ImageError } from '../../types';
import { DataLayerSender } from '../../utils/dataLayer';

export class BrokenImageModule implements Module {
  name = 'BrokenImage';
  private SENT_FLAG = '__uxqa_img_err_sent__';

  init(config: UXQAConfig): void {
    this.setupImageErrorListener();
    this.setupNaturalSizeScanner();
  }

  private getViewportArea(): { vw: number; vh: number; vA: number } {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    return { vw, vh, vA: (vw > 0 && vh > 0) ? (vw * vh) : 0 };
  }

  private getImageDimensions(img: HTMLImageElement): { w: number; h: number } {
    let w = 0, h = 0;

    // 1) 실제 화면 렌더링 크기
    if (img && img.getBoundingClientRect) {
      const rect = img.getBoundingClientRect();
      w = Math.round(rect.width);
      h = Math.round(rect.height);
    }

    // 2) 렌더링 크기가 0이면 attribute/CSS 기반 크기
    if (!(w > 0 && h > 0)) {
      w = img.width || 0;
      h = img.height || 0;
    }

    // 3) 그래도 0이면 intrinsic 크기
    if (!(w > 0 && h > 0)) {
      w = img.naturalWidth || 0;
      h = img.naturalHeight || 0;
    }

    return { w, h };
  }

  private safeLn(x: number): number | null {
    return (x > 0) ? Math.log(x) : null;
  }

  private pushImageIssue(img: HTMLImageElement, reason: string): void {
    try {
      if (!img || (img as any)[this.SENT_FLAG]) return;
      (img as any)[this.SENT_FLAG] = true;

      const src = img.currentSrc || img.src || '';
      const { w, h } = this.getImageDimensions(img);

      // 1) A = w*h
      const A = (w > 0 && h > 0) ? (w * h) : 0;

      // 2) ar = ln(w/h)
      const ratio = (w > 0 && h > 0) ? (w / h) : 0;
      const ar = this.safeLn(ratio);

      // 3) coverage = A / (viewportW*viewportH)
      const vp = this.getViewportArea();
      const coverage = (A > 0 && vp.vA > 0) ? (A / vp.vA) : null;

      DataLayerSender.push({
        event: 'img_load_error',
        network_brokenImgDetector_img_reason: reason,
        network_brokenImgDetector_img_src: src,
        network_brokenImgDetector_img_page: location.href,
        network_brokenImgDetector_img_area_px2: A,
        network_brokenImgDetector_img_ar_ln: ar,
        network_brokenImgDetector_img_coverage: coverage
      });
    } catch (e) {
      // Silent fail
    }
  }

  private setupImageErrorListener(): void {
    document.addEventListener('error', (e) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'IMG') {
        this.pushImageIssue(target as HTMLImageElement, 'img_error');
      }
    }, true);
  }

  private scanNaturalSizeZero(): void {
    try {
      const imgs = document.getElementsByTagName('img');
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i];
        if (
          img &&
          img.complete === true &&
          (img.naturalWidth === 0 || img.naturalHeight === 0)
        ) {
          this.pushImageIssue(img, 'natural_size_zero');
        }
      }
    } catch (e) {
      // Silent fail
    }
  }

  private setupNaturalSizeScanner(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.scanNaturalSizeZero());
    } else {
      this.scanNaturalSizeZero();
    }

    window.addEventListener('load', () => this.scanNaturalSizeZero());
  }
}
