const defaultConfig = {
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
function mergeConfig(userConfig) {
    if (!userConfig)
        return Object.assign({}, defaultConfig);
    return Object.assign(Object.assign(Object.assign({}, defaultConfig), userConfig), { modules: Object.assign(Object.assign({}, defaultConfig.modules), userConfig.modules) });
}

var r,a=-1,o=function(e){addEventListener("pageshow",(function(n){n.persisted&&(a=n.timeStamp,e(n));}),true);},c=function(){return window.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0]},u=function(){var e=c();return e&&e.activationStart||0},f=function(e,n){var t=c(),i="navigate";a>=0?i="back-forward-cache":t&&(document.prerendering||u()>0?i="prerender":document.wasDiscarded?i="restore":t.type&&(i=t.type.replace(/_/g,"-")));return {name:e,value:void 0===n?-1:n,rating:"good",delta:0,entries:[],id:"v3-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:i}},s=function(e,n,t){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){var i=new PerformanceObserver((function(e){Promise.resolve().then((function(){n(e.getEntries());}));}));return i.observe(Object.assign({type:e,buffered:!0},t||{})),i}}catch(e){}},d=function(e,n,t,i){var r,a;return function(o){n.value>=0&&(o||i)&&((a=n.value-(r||0))||void 0===r)&&(r=n.value,n.delta=a,n.rating=function(e,n){return e>n[1]?"poor":e>n[0]?"needs-improvement":"good"}(n.value,t),e(n));}},l=function(e){requestAnimationFrame((function(){return requestAnimationFrame((function(){return e()}))}));},p=function(e){var n=function(n){"pagehide"!==n.type&&"hidden"!==document.visibilityState||e(n);};addEventListener("visibilitychange",n,true),addEventListener("pagehide",n,true);},v=function(e){var n=false;return function(t){n||(e(t),n=true);}},m=-1,h=function(){return "hidden"!==document.visibilityState||document.prerendering?1/0:0},g=function(e){"hidden"===document.visibilityState&&m>-1&&(m="visibilitychange"===e.type?e.timeStamp:0,T());},y=function(){addEventListener("visibilitychange",g,true),addEventListener("prerenderingchange",g,true);},T=function(){removeEventListener("visibilitychange",g,true),removeEventListener("prerenderingchange",g,true);},E=function(){return m<0&&(m=h(),y(),o((function(){setTimeout((function(){m=h(),y();}),0);}))),{get firstHiddenTime(){return m}}},C=function(e){document.prerendering?addEventListener("prerenderingchange",(function(){return e()}),true):e();},L=[1800,3e3],w=function(e,n){n=n||{},C((function(){var t,i=E(),r=f("FCP"),a=s("paint",(function(e){e.forEach((function(e){"first-contentful-paint"===e.name&&(a.disconnect(),e.startTime<i.firstHiddenTime&&(r.value=Math.max(e.startTime-u(),0),r.entries.push(e),t(true)));}));}));a&&(t=d(e,r,L,n.reportAllChanges),o((function(i){r=f("FCP"),t=d(e,r,L,n.reportAllChanges),l((function(){r.value=performance.now()-i.timeStamp,t(true);}));})));}));},b=[.1,.25],S=function(e,n){n=n||{},w(v((function(){var t,i=f("CLS",0),r=0,a=[],c=function(e){e.forEach((function(e){if(!e.hadRecentInput){var n=a[0],t=a[a.length-1];r&&e.startTime-t.startTime<1e3&&e.startTime-n.startTime<5e3?(r+=e.value,a.push(e)):(r=e.value,a=[e]);}})),r>i.value&&(i.value=r,i.entries=a,t());},u=s("layout-shift",c);u&&(t=d(e,i,b,n.reportAllChanges),p((function(){c(u.takeRecords()),t(true);})),o((function(){r=0,i=f("CLS",0),t=d(e,i,b,n.reportAllChanges),l((function(){return t()}));})),setTimeout(t,0));})));},B=0,R=1/0,H=0,N=function(e){e.forEach((function(e){e.interactionId&&(R=Math.min(R,e.interactionId),H=Math.max(H,e.interactionId),B=H?(H-R)/7+1:0);}));},O=function(){return r?B:performance.interactionCount||0},q=function(){"interactionCount"in performance||r||(r=s("event",N,{type:"event",buffered:true,durationThreshold:0}));},j=[200,500],_=0,z=function(){return O()-_},G=[],J={},K=function(e){var n=G[G.length-1],t=J[e.interactionId];if(t||G.length<10||e.duration>n.latency){if(t)t.entries.push(e),t.latency=Math.max(t.latency,e.duration);else {var i={id:e.interactionId,latency:e.duration,entries:[e]};J[i.id]=i,G.push(i);}G.sort((function(e,n){return n.latency-e.latency})),G.splice(10).forEach((function(e){delete J[e.id];}));}},Q=function(e,n){n=n||{},C((function(){var t;q();var i,r=f("INP"),a=function(e){e.forEach((function(e){(e.interactionId&&K(e),"first-input"===e.entryType)&&(!G.some((function(n){return n.entries.some((function(n){return e.duration===n.duration&&e.startTime===n.startTime}))}))&&K(e));}));var n,t=(n=Math.min(G.length-1,Math.floor(z()/50)),G[n]);t&&t.latency!==r.value&&(r.value=t.latency,r.entries=t.entries,i());},c=s("event",a,{durationThreshold:null!==(t=n.durationThreshold)&&void 0!==t?t:40});i=d(e,r,j,n.reportAllChanges),c&&("PerformanceEventTiming"in window&&"interactionId"in PerformanceEventTiming.prototype&&c.observe({type:"first-input",buffered:true}),p((function(){a(c.takeRecords()),r.value<0&&z()>0&&(r.value=0,r.entries=[]),i(true);})),o((function(){G=[],_=O(),r=f("INP"),i=d(e,r,j,n.reportAllChanges);})));}));},U=[2500,4e3],V={},W=function(e,n){n=n||{},C((function(){var t,i=E(),r=f("LCP"),a=function(e){var n=e[e.length-1];n&&n.startTime<i.firstHiddenTime&&(r.value=Math.max(n.startTime-u(),0),r.entries=[n],t());},c=s("largest-contentful-paint",a);if(c){t=d(e,r,U,n.reportAllChanges);var m=v((function(){V[r.id]||(a(c.takeRecords()),c.disconnect(),V[r.id]=true,t(true));}));["keydown","click"].forEach((function(e){addEventListener(e,(function(){return setTimeout(m,0)}),true);})),p(m),o((function(i){r=f("LCP"),t=d(e,r,U,n.reportAllChanges),l((function(){r.value=performance.now()-i.timeStamp,V[r.id]=true,t(true);}));}));}}));},X=[800,1800],Y=function e(n){document.prerendering?C((function(){return e(n)})):"complete"!==document.readyState?addEventListener("load",(function(){return e(n)}),true):setTimeout(n,0);},Z=function(e,n){n=n||{};var t=f("TTFB"),i=d(e,t,X,n.reportAllChanges);Y((function(){var r=c();if(r){var a=r.responseStart;if(a<=0||a>performance.now())return;t.value=Math.max(a-u(),0),t.entries=[r],i(true),o((function(){t=f("TTFB",0),(i=d(e,t,X,n.reportAllChanges))(true);}));}}));};

class DataLayerSender {
    static setDebugMode(debug) {
        this.debugMode = debug;
    }
    static ensureDataLayer() {
        if (typeof window !== 'undefined') {
            window.dataLayer = window.dataLayer || [];
        }
    }
    static push(event) {
        this.ensureDataLayer();
        window.dataLayer.push(event);
        // debug 모드일 때 DataLayer 이벤트 로그 출력
        if (this.debugMode && event.event) {
            console.log(`📊 DataLayer Event: ${event.event}`, event);
        }
    }
    static log(message, ...args) {
        if (this.debugMode && console && console.log) {
            console.log(`[UXQA] ${message}`, ...args);
        }
    }
}
DataLayerSender.debugMode = false;

class WebVitalsModule {
    constructor() {
        this.name = 'WebVitals';
    }
    init(config) {
        this.setupVitalsTracking();
    }
    setupVitalsTracking() {
        const sendToDataLayer = (metric) => {
            DataLayerSender.push({
                event: 'web_vitals',
                performance_vital_name: metric.name,
                performance_vital_value: metric.value,
                performance_vital_id: metric.id,
            });
        };
        // Metric listeners
        w(sendToDataLayer);
        W(sendToDataLayer);
        S(sendToDataLayer);
        Q(sendToDataLayer);
        Z(sendToDataLayer);
    }
}

class PagePerformanceModule {
    constructor() {
        this.name = 'PagePerformance';
    }
    init(config) {
        // load 이벤트 후에 측정
        if (document.readyState === 'complete') {
            // 이미 로드 완료된 경우
            this.sendPagePerformance();
        }
        else {
            // 로드 완료 대기
            window.addEventListener('load', () => {
                // load 이벤트 직후에는 값이 아직 0일 수 있으므로 약간 지연
                setTimeout(() => {
                    this.sendPagePerformance();
                }, 0);
            });
        }
    }
    sendPagePerformance() {
        try {
            let navEntry = null;
            const entries = performance.getEntriesByType('navigation');
            if (entries && entries.length > 0) {
                navEntry = entries[0];
            }
            let totalLoadTime = null;
            let domContentLoadedTime = null;
            if (navEntry) {
                totalLoadTime = navEntry.loadEventEnd;
                domContentLoadedTime = navEntry.domContentLoadedEventEnd;
            }
            else if (performance.timing) {
                const t = performance.timing;
                totalLoadTime = t.loadEventEnd - t.navigationStart;
                domContentLoadedTime = t.domContentLoadedEventEnd - t.navigationStart;
            }
            DataLayerSender.push({
                event: 'page_performance',
                performance_total_load_time: totalLoadTime,
                performance_dom_content_loaded_time: domContentLoadedTime,
            });
        }
        catch (e) {
            // Silent fail
        }
    }
}

class PerformanceModule {
    constructor() {
        this.name = 'Performance';
        this.webVitals = new WebVitalsModule();
        this.pagePerformance = new PagePerformanceModule();
    }
    init(config) {
        this.webVitals.init(config);
        this.pagePerformance.init(config);
        DataLayerSender.log('Initialized: Performance Module (QA0101, QA0102)');
    }
}

/**
 * QA0201 - 4xx, 5xx HTTP 에러 감지
 * TODO: 실제 구현 필요
 */
class HTTPErrorModule {
    constructor() {
        this.name = 'HTTPError';
    }
    init(config) {
        DataLayerSender.log('  - QA0201 (4xx, 5xx HTTP Error): Implementation pending');
        // TODO: 4xx, 5xx 에러 감지 로직 구현
        // - fetch/XHR interception
        // - Resource timing API 활용
        // - 상태 코드 체크
    }
    // TODO: Implement actual error detection logic
    detectHTTPErrors() {
        // Implementation will be added
    }
}

/**
 * QA0202 - First Party API 에러 감지
 * TODO: 실제 구현 필요
 */
class FirstPartyAPIModule {
    constructor() {
        this.name = 'FirstPartyAPI';
    }
    init(config) {
        DataLayerSender.log('  - QA0202 (First Party API Error): Implementation pending');
        // TODO: First Party API 에러 감지 로직 구현
        // - 동일 도메인 API 요청 모니터링
        // - fetch/XHR interception
        // - 응답 시간 및 에러 추적
    }
    // TODO: Implement actual API monitoring logic
    monitorFirstPartyAPI() {
        // Implementation will be added
    }
}

class ThirdPartyAPIModule {
    constructor() {
        this.name = 'ThirdPartyAPI';
        this.queue = [];
        this.gtmLoaded = false;
        // 제외할 패턴 (블랙리스트)
        this.blacklistPatterns = [
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
        this.originalFetch = window.fetch;
        this.originalXHR = window.XMLHttpRequest;
        this.currentDomain = window.location.hostname;
    }
    init(config) {
        this.setupGTMDetection();
        this.monitorFetch();
        this.monitorXHR();
        this.monitorScriptErrors();
    }
    isExternal(url) {
        if (!url)
            return false;
        try {
            const urlObj = new URL(url, window.location.href);
            return urlObj.hostname !== this.currentDomain;
        }
        catch (e) {
            return false;
        }
    }
    isBlacklisted(url) {
        return this.blacklistPatterns.some(p => p.test(url));
    }
    shouldTrack(url) {
        return this.isExternal(url) && !this.isBlacklisted(url);
    }
    shouldIgnore(url, status) {
        if (url.indexOf('_dbg=1') > -1 || url.indexOf('gtm_debug=') > -1)
            return true;
        if (status === 0 && url.indexOf('google-analytics.com/g/collect') > -1)
            return true;
        if (url.indexOf('gtag/js?id=DUMMY') > -1)
            return true;
        if (url.indexOf('googletagmanager.com/gtag/js') > -1 && url.indexOf('id=DUMMY') > -1)
            return true;
        return false;
    }
    trackFailure(url, status, errorType) {
        if (this.shouldIgnore(url, status))
            return;
        const event = {
            event: 'third_party_api_failure',
            api_url: url,
            status_code: status,
            error_type: errorType,
            timestamp: new Date().toISOString()
        };
        if (this.gtmLoaded) {
            DataLayerSender.push(event);
        }
        else {
            this.queue.push(event);
        }
    }
    flushQueue() {
        this.gtmLoaded = true;
        while (this.queue.length > 0) {
            DataLayerSender.push(this.queue.shift());
        }
    }
    setupGTMDetection() {
        const checkGTM = setInterval(() => {
            if (window.google_tag_manager || (window.dataLayer && window.dataLayer.push)) {
                clearInterval(checkGTM);
                this.flushQueue();
            }
        }, 100);
        setTimeout(() => {
            clearInterval(checkGTM);
            if (!this.gtmLoaded)
                this.flushQueue();
        }, 10000);
    }
    monitorFetch() {
        const self = this;
        window.fetch = function (...args) {
            const url = typeof args[0] === 'string' ? args[0] : args[0].url;
            const trackThis = self.shouldTrack(url);
            return self.originalFetch.apply(this, args)
                .then((res) => {
                if (trackThis && !res.ok) {
                    self.trackFailure(url, res.status, 'fetch_error');
                }
                return res;
            })
                .catch((err) => {
                if (trackThis) {
                    self.trackFailure(url, 0, 'fetch_exception');
                }
                throw err;
            });
        };
    }
    monitorXHR() {
        const self = this;
        const OriginalXHR = this.originalXHR;
        window.XMLHttpRequest = function () {
            const xhr = new OriginalXHR();
            let url;
            const origOpen = xhr.open;
            xhr.open = function (...args) {
                url = args[1];
                return origOpen.apply(this, args);
            };
            xhr.addEventListener('error', function () {
                if (self.shouldTrack(url))
                    self.trackFailure(url, 0, 'xhr_error');
            });
            xhr.addEventListener('load', function () {
                if (self.shouldTrack(url) && xhr.status >= 400) {
                    self.trackFailure(url, xhr.status, 'xhr_http_error');
                }
            });
            return xhr;
        };
        window.XMLHttpRequest.prototype = OriginalXHR.prototype;
    }
    monitorScriptErrors() {
        window.addEventListener('error', (e) => {
            const target = e.target;
            if (target && target.tagName === 'SCRIPT' && target.src && this.shouldTrack(target.src)) {
                this.trackFailure(target.src, 0, 'script_load_error');
            }
        }, true);
    }
}

class NetworkModule {
    constructor() {
        this.name = 'Network';
        this.httpError = new HTTPErrorModule();
        this.firstPartyAPI = new FirstPartyAPIModule();
        this.thirdPartyAPI = new ThirdPartyAPIModule();
    }
    init(config) {
        this.httpError.init(config);
        this.firstPartyAPI.init(config);
        this.thirdPartyAPI.init(config);
        DataLayerSender.log('Initialized: Network Module (QA0201, QA0202, QA0203)');
    }
}

class DOMUtils {
    /**
     * 요소의 CSS 선택자 경로 생성
     */
    static getElementPath(element) {
        if (!element || element === document.documentElement)
            return '';
        const path = [];
        let current = element;
        while (current && current.nodeType === Node.ELEMENT_NODE) {
            let selector = current.nodeName.toLowerCase();
            if (current.id) {
                selector += '#' + current.id;
                path.unshift(selector);
                break;
            }
            else {
                const parent = current.parentNode;
                if (parent) {
                    const siblings = Array.from(parent.children).filter((child) => child.nodeName === current.nodeName);
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
            if (path.length >= 10)
                break;
        }
        return path.join(' > ');
    }
    /**
     * 요소 정보를 문자열로 포맷
     */
    static formatElementInfo(element) {
        const tagName = element.nodeName;
        const path = this.getElementPath(element);
        return `${tagName}: ${path}`;
    }
    /**
     * 요소의 텍스트 추출 (최대 길이 제한)
     */
    static getElementText(element, maxLength = 50) {
        const text = (element.innerText || element.textContent || '').trim();
        return text.substring(0, maxLength);
    }
}

class DeadClickModule {
    constructor() {
        this.name = 'DeadClick';
        this.OBSERVATION_WINDOW_MS = 800;
        this.urlChangeDetected = false;
        this.domMutationDetected = false;
        this.userActivityDetected = false; // 새로 추가
        this.observerInstance = null;
        this.timeoutId = null;
        this.currentClickContext = null;
        this.lastHref = location.href;
    }
    init(config) {
        this.setupClickListener();
        this.setupURLChangeDetection();
        this.setupUserActivityDetection(); // 새로 추가
    }
    setupClickListener() {
        document.addEventListener('click', (e) => {
            let target = e.target;
            while (target && target !== document.body) {
                if (this.shouldIgnoreClick(target)) {
                    return;
                }
                if (this.isClickableElement(target)) {
                    break;
                }
                target = target.parentElement;
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
    isClickableElement(element) {
        return (element.tagName === 'BUTTON' ||
            element.tagName === 'A' ||
            !!element.onclick ||
            element.getAttribute('role') === 'button');
    }
    shouldIgnoreClick(target) {
        if (target.disabled)
            return true;
        if (target.tagName === 'A') {
            const href = target.getAttribute('href');
            if (href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
                return true;
            }
        }
        return false;
    }
    startMutationObserver() {
        if (!document.body)
            return;
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
    detectUrlChange() {
        const currentUrl = location.href.replace(/#$/, '');
        const previousUrl = this.lastHref.replace(/#$/, '');
        if (currentUrl !== previousUrl) {
            DataLayerSender.log('Dead Click - Meaningful URL change');
            this.urlChangeDetected = true;
            this.cleanup();
        }
    }
    setupURLChangeDetection() {
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
    reportDeadClickCandidate() {
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
    cleanup() {
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
        this.userActivityDetected = false; // 추가
        this.currentClickContext = null;
    }
    destroy() {
        this.cleanup();
    }
    setupUserActivityDetection() {
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
        Storage.prototype.setItem = function (...args) {
            DataLayerSender.log('Dead Click - storage.setItem() detected');
            if (this === window.localStorage || this === window.sessionStorage) {
                const module = window.__uxqa_deadclick_module__;
                if (module) {
                    module.userActivityDetected = true;
                }
            }
            return originalSetItem.apply(this, args);
        };
        // 모듈 인스턴스를 window에 저장 (storage 감지용)
        window.__uxqa_deadclick_module__ = this;
    }
}

class InteractionModule {
    constructor() {
        this.name = 'Interaction';
        this.deadClick = new DeadClickModule();
    }
    init(config) {
        this.deadClick.init(config);
        DataLayerSender.log('Initialized: Interaction Module (QA0301)');
    }
    destroy() {
        var _a, _b;
        (_b = (_a = this.deadClick).destroy) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
}

class BrokenImageModule {
    constructor() {
        this.name = 'BrokenImage';
        this.SENT_FLAG = '__uxqa_img_err_sent__';
    }
    init(config) {
        this.setupImageErrorListener();
    }
    getViewportArea() {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        return { vw, vh, vA: (vw > 0 && vh > 0) ? (vw * vh) : 0 };
    }
    getImageDimensions(img) {
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
    safeLn(x) {
        return (x > 0) ? Math.log(x) : null;
    }
    pushImageIssue(img, reason) {
        try {
            if (!img || img[this.SENT_FLAG])
                return;
            img[this.SENT_FLAG] = true;
            // 실제 로드 시도한 URL (srcset 포함)
            const src = img.currentSrc || img.src || '';
            // DOM 경로
            const elementPath = DOMUtils.formatElementInfo(img);
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
                network_brokenImgDetector_img_element: elementPath,
                network_brokenImgDetector_img_page: location.href,
                network_brokenImgDetector_img_area_px2: A,
                network_brokenImgDetector_img_ar_ln: ar,
                network_brokenImgDetector_img_coverage: coverage
            });
        }
        catch (e) {
            // Silent fail
        }
    }
    setupImageErrorListener() {
        document.addEventListener('error', (e) => {
            const target = e.target;
            if (target && target.tagName === 'IMG') {
                this.pushImageIssue(target, 'img_error');
            }
        }, true);
    }
}

class ResourceModule {
    constructor() {
        this.name = 'Resource';
        this.brokenImage = new BrokenImageModule();
    }
    init(config) {
        this.brokenImage.init(config);
        DataLayerSender.log('Initialized: Resource Module (QA0401)');
    }
}

class UXQA {
    constructor(userConfig) {
        this.modules = new Map();
        this.initialized = false;
        this.config = mergeConfig(userConfig);
        // Auto-initialize if config is provided
        if (userConfig) {
            this.init();
        }
    }
    /**
     * Initialize UXQA with configuration
     */
    init(userConfig) {
        if (this.initialized) {
            DataLayerSender.log('UXQA already initialized');
            return;
        }
        if (userConfig) {
            this.config = mergeConfig(userConfig);
        }
        // debug 모드 설정
        DataLayerSender.setDebugMode(this.config.debug || false);
        this.registerModules();
        this.initializeModules();
        this.initialized = true;
        DataLayerSender.log('Initialization complete');
    }
    /**
     * Register all modules based on configuration
     */
    registerModules() {
        var _a, _b, _c, _d;
        if ((_a = this.config.modules) === null || _a === void 0 ? void 0 : _a.performance) {
            this.modules.set('performance', new PerformanceModule());
        }
        if ((_b = this.config.modules) === null || _b === void 0 ? void 0 : _b.network) {
            this.modules.set('network', new NetworkModule());
        }
        if ((_c = this.config.modules) === null || _c === void 0 ? void 0 : _c.interaction) {
            this.modules.set('interaction', new InteractionModule());
        }
        if ((_d = this.config.modules) === null || _d === void 0 ? void 0 : _d.resource) {
            this.modules.set('resource', new ResourceModule());
        }
    }
    /**
     * Initialize all registered modules
     */
    initializeModules() {
        this.modules.forEach((module) => {
            try {
                module.init(this.config);
            }
            catch (error) {
                console.error(`[UXQA] Failed to initialize module: ${module.name}`, error);
            }
        });
    }
    /**
     * Get current configuration
     */
    getConfig() {
        return Object.assign({}, this.config);
    }
    /**
     * Update configuration (requires re-initialization)
     */
    setConfig(newConfig) {
        this.config = mergeConfig(newConfig);
        DataLayerSender.log('Configuration updated. Call init() to apply changes.');
    }
    /**
     * Destroy all modules and clean up
     */
    destroy() {
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

// Auto-initialize if window.uxqaConfig exists
if (typeof window !== 'undefined') {
    const config = window.uxqaConfig;
    if (config) {
        const instance = new UXQA(config);
        window.UXQA = instance;
    }
    else {
        // Expose UXQA class for manual initialization
        window.UXQA = UXQA;
    }
}

export { UXQA as default };
//# sourceMappingURL=uxqa.esm.js.map
