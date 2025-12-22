# UXQA JavaScript Library

UXQA는 웹사이트의 사용자 경험 품질을 모니터링하는 경량 JavaScript 라이브러리입니다.

## 📦 설치

### CDN 사용 (권장)

```html
<!-- 설정을 먼저 정의 -->
<script>
  window.uxqaConfig = {
    apiKey: 'YOUR_API_KEY',
    endpoint: 'https://api.uxqa.io/collect',
    modules: {
      performance: true,
      network: true,
      interaction: true,
      resource: true
    },
    debug: false
  };
</script>

<!-- UXQA 라이브러리 로드 -->
<script src="https://cdn.uxqa.io/uxqa.min.js"></script>
```

### NPM 사용

/*
```bash
npm install uxqa
```
*/

```javascript
import UXQA from 'uxqa';

const uxqa = new UXQA({
  apiKey: 'YOUR_API_KEY',
  endpoint: 'https://api.uxqa.io/collect',
  modules: {
    performance: true,
    network: true,
    interaction: true,
    resource: true
  }
});

uxqa.init();
```

## 🎯 기능

### Performance 모듈

- **QA0101** - Web Vitals (FCP, LCP, INP, CLS, TTFB)
- **QA0102** - Page Performance (Total Loading Time, DOM Content Loaded Time)

### Network 모듈

- **QA0201** - HTTP 에러 (4xx, 5xx) 감지 *(구현 예정)*
- **QA0202** - First Party API 에러 감지 *(구현 예정)*
- **QA0203** - Third Party API 에러 감지

### Interaction 모듈

- **QA0301** - Dead Click 감지

### Resource 모듈

- **QA0401** - 이미지 로딩 실패 감지

## 🛠️ 개발

### 설치

```bash
npm install
```

### 빌드

```bash
npm run build
```

빌드 결과물:
- `dist/uxqa.js` - UMD 포맷 (디버깅용)
- `dist/uxqa.min.js` - UMD 포맷 압축 (프로덕션용)
- `dist/uxqa.esm.js` - ES Module 포맷

### 개발 모드

```bash
npm run dev
```

파일 변경 시 자동으로 재빌드됩니다.

## 📁 프로젝트 구조

```
uxqa/
├── src/
│   ├── core/              # 핵심 시스템
│   │   ├── index.ts
│   │   ├── uxqa.ts
│   │   └── config.ts
│   ├── modules/           # 기능 모듈
│   │   ├── performance/
│   │   │   ├── web-vitals.ts       (QA0101)
│   │   │   └── page-performance.ts (QA0102)
│   │   ├── network/
│   │   │   ├── http-error.ts       (QA0201) *TODO*
│   │   │   ├── first-party-api.ts  (QA0202) *TODO*
│   │   │   └── third-party-api.ts  (QA0203)
│   │   ├── interaction/
│   │   │   └── dead-click.ts       (QA0301)
│   │   └── resource/
│   │       └── broken-image.ts     (QA0401)
│   ├── utils/             # 유틸리티
│   │   ├── dataLayer.ts
│   │   └── dom.ts
│   └── types/             # 타입 정의
│       └── index.ts
├── dist/                  # 빌드 결과물
├── package.json
├── tsconfig.json
├── rollup.config.js
└── README.md
```

## 📊 DataLayer 이벤트

모든 측정 데이터는 `window.dataLayer`로 전송됩니다.

### Performance Events

```javascript
{
  event: 'web_vitals',
  performance_vital_name: 'LCP',
  performance_vital_value: 2500,
  performance_vital_id: 'v1-...'
}

{
  event: 'page_performance',
  performance_total_load_time: 3500,
  performance_dom_content_loaded_time: 2000
}
```

### Network Events

```javascript
{
  event: 'third_party_api_failure',
  api_url: 'https://api.example.com/data',
  status_code: 500,
  error_type: 'fetch_error',
  timestamp: '2024-01-01T00:00:00.000Z'
}
```

### Interaction Events

```javascript
{
  event: 'uxqa_dead_click_candidate',
  interaction_deadClick_element: 'BUTTON: .btn.primary',
  interaction_deadClick_text: 'Submit'
}
```

### Resource Events

```javascript
{
  event: 'img_load_error',
  network_brokenImgDetector_img_reason: 'img_error',
  network_brokenImgDetector_img_src: '/images/hero.jpg',
  network_brokenImgDetector_img_page: 'https://example.com',
  network_brokenImgDetector_img_area_px2: 230400,
  network_brokenImgDetector_img_ar_ln: 0.693,
  network_brokenImgDetector_img_coverage: 0.45
}
```

## 🔧 설정 옵션

```typescript
interface UXQAConfig {
  apiKey?: string;           // API 키
  endpoint?: string;         // 데이터 전송 엔드포인트
  modules?: {
    performance?: boolean;   // Performance 모듈 활성화
    network?: boolean;       // Network 모듈 활성화
    interaction?: boolean;   // Interaction 모듈 활성화
    resource?: boolean;      // Resource 모듈 활성화
  };
  debug?: boolean;          // 디버그 로그 출력
}
```

## 📝 TODO

- [ ] QA0201 - HTTP 에러 (4xx, 5xx) 감지 구현
- [ ] QA0202 - First Party API 에러 감지 구현
- [ ] 단위 테스트 추가
- [ ] E2E 테스트 추가
- [ ] CI/CD 파이프라인 구축

## 📄 라이선스

MIT
