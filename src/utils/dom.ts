export class DOMUtils {
  /**
   * 요소의 CSS 선택자 경로 생성
   */
  static getElementPath(element: Element | null): string {
    if (!element || element === document.documentElement) return '';

    const path: string[] = [];
    let current: Element | null = element;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let selector = current.nodeName.toLowerCase();

      if (current.id) {
        selector += '#' + current.id;
        path.unshift(selector);
        break;
      } else {
        const parent = current.parentNode;
        if (parent) {
          const siblings = Array.from(parent.children).filter(
            (child) => child.nodeName === current!.nodeName
          );

          if (siblings.length > 1) {
            const index = siblings.indexOf(current);
            selector += `:nth-of-type(${index + 1})`;
          }
        }

        if (current.className && typeof current.className === 'string') {
          const classes = current.className.trim().split(/\s+/).slice(0, 3);
          if (classes.length > 0) {
            selector += '.' + classes.join('.');
          }
        }
      }

      path.unshift(selector);
      current = current.parentElement;

      if (path.length >= 10) break;
    }

    return path.join(' > ');
  }

  /**
   * 요소 정보를 문자열로 포맷
   */
  static formatElementInfo(element: Element): string {
    const tagName = element.nodeName;
    const path = this.getElementPath(element);
    return `${tagName}: ${path}`;
  }

  /**
   * 요소의 텍스트 추출 (최대 길이 제한)
   */
  static getElementText(element: HTMLElement, maxLength: number = 50): string {
    const text = (element.innerText || element.textContent || '').trim();
    return text.substring(0, maxLength);
  }
}
