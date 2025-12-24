# UXQA JavaScript Library

UXQA는 웹사이트의 사용자 경험 품질을 모니터링하는 경량 JavaScript 라이브러리입니다.

현재는 개발 초기단계이며 v1.0.0이 아닌 v0.1.0상태입니다.

## 📦 설치 및 사용

웹사이트의 `<head>` 태그 안에 다음 코드를 추가하세요:

```html
<!-- UXQA 설정 -->
<script>
  window.uxqaConfig = {
    modules: {
      performance: true,
      network: true,
      interaction: true,
      resource: true
    },
    debug: false  // 개발 시에는 true로 설정
  };
</script>

<!-- UXQA 라이브러리 로드 -->
<script src="https://cdn.jsdelivr.net/gh/humanetools/uxqa@main/dist/uxqa.min.js"></script>
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

## 📊 DataLayer 이벤트

모든 측정 데이터는 `window.dataLayer`로 전송됩니다.

### Performance Events

```javascript
// Web Vitals
{
  event: 'web_vitals',
  performance_vital_name: 'LCP',
  performance_vital_value: 2500,
  performance_vital_id: 'v1-...'
}

// Page Performance
{
  event: 'page_performance',
  performance_total_load_time: 3500,
  performance_dom_content_loaded_time: 2000
}
```

### Network Events

```javascript
// Third Party API 실패
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
// Dead Click 감지
{
  event: 'uxqa_dead_click_candidate',
  interaction_deadClick_element: 'BUTTON: .btn.primary',
  interaction_deadClick_text: 'Submit'
}
```

### Resource Events

```javascript
// 이미지 로딩 실패
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

```javascript
window.uxqaConfig = {
  modules: {
    performance: true,   // Performance 모듈 활성화
    network: true,       // Network 모듈 활성화
    interaction: true,   // Interaction 모듈 활성화
    resource: true       // Resource 모듈 활성화
  },
  debug: false          // true: 콘솔 로그 출력, false: 로그 숨김
};
```

## 🧪 테스트 방법

1. 웹사이트에 UXQA 설치
2. 브라우저 개발자 도구 열기 (F12)
3. Console 탭에서 확인:

```javascript
// DataLayer 이벤트 확인
console.log(window.dataLayer);

// UXQA 인스턴스 확인
console.log(window.UXQA);
```

4. `debug: true`로 설정하면 상세 로그 확인 가능

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
│   ├── uxqa.js
│   ├── uxqa.min.js       # CDN 배포 파일
│   └── uxqa.esm.js
├── package.json
├── tsconfig.json
├── rollup.config.js
└── README.md
```

## 🛠️ 개발

### 사전 준비

- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
git clone https://github.com/humanetools/uxqa.git
cd uxqa
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

## 🐛 버그 리포트

이슈가 있으면 [GitHub Issues](https://github.com/humanetools/uxqa/issues)에 제보해주세요.

## 📝 TODO

- [ ] QA0201 - HTTP 에러 (4xx, 5xx) 감지 구현
- [ ] QA0202 - First Party API 에러 감지 구현
- [ ] 단위 테스트 추가
- [ ] E2E 테스트 추가

## 📄 라이선스

Copyright (c) 2024 HumaneTools. All Rights Reserved.

이 소프트웨어의 사용, 복사, 수정, 배포는 저작권자의 명시적 서면 허가 없이 금지됩니다.

## 📧 문의

Issues: https://github.com/humanetools/uxqa/issues
