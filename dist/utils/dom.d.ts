export declare class DOMUtils {
    /**
     * 요소의 CSS 선택자 경로 생성
     */
    static getElementPath(element: Element | null): string;
    /**
     * 요소 정보를 문자열로 포맷
     */
    static formatElementInfo(element: Element): string;
    /**
     * 요소의 텍스트 추출 (최대 길이 제한)
     */
    static getElementText(element: HTMLElement, maxLength?: number): string;
}
