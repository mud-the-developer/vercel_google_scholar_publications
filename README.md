# Scholar Citation Showcase

Google Scholar 프로필에서 논문 인용 데이터를 스크래핑하여 SVG 배지와 HTML 위젯으로 제공하는 서비스입니다. GitHub README에 인용 배지를 삽입하거나, 블로그에 위젯을 임베드할 수 있습니다.

## 주요 기능

- `/api/badge` — 인용 상위 논문을 SVG 이미지로 렌더링 (GitHub README 삽입용)
- `/api/widget` — 인용 상위 논문을 HTML 페이지로 렌더링 (블로그 iframe 임베드용)
- 24시간 TTL 기반 in-memory 캐싱 + CDN Cache-Control 헤더
- Google Scholar rate-limit, CAPTCHA, 네트워크 에러 등 에러 처리

## 요구사항

- Node.js 18 이상
- npm

## 설치

```bash
git clone <repository-url>
cd scholar-citation-showcase
npm install
```

## 로컬 실행

### 개발 서버

```bash
npm run dev
```

기본적으로 `http://localhost:3000`에서 실행됩니다.

### 프로덕션 빌드 후 실행

```bash
npm run build
npm start
```

## API 사용법

### 1. SVG 배지 (GitHub README용)

```
GET /api/badge?scholar_id={SCHOLAR_ID}&count={COUNT}
```

| 파라미터 | 필수 | 기본값 | 설명 |
|----------|------|--------|------|
| `scholar_id` | ✅ | — | Google Scholar 프로필 ID |
| `count` | ❌ | 5 | 표시할 논문 수 |

**Scholar ID 찾는 법:**
Google Scholar 프로필 URL에서 `user=` 뒤의 값이 Scholar ID입니다.
```
https://scholar.google.com/citations?user=XXXXXX  ← 이 XXXXXX 부분
```

**사용 예시:**

브라우저에서 직접 확인:
```
http://localhost:3000/api/badge?scholar_id=YOUR_SCHOLAR_ID
http://localhost:3000/api/badge?scholar_id=YOUR_SCHOLAR_ID&count=10
```

GitHub README에 삽입 (배포 후):
```markdown
![My Citations](https://your-domain.vercel.app/api/badge?scholar_id=YOUR_SCHOLAR_ID)
```

### 2. HTML 위젯 (블로그 임베드용)

```
GET /api/widget?scholar_id={SCHOLAR_ID}&count={COUNT}
```

파라미터는 배지 API와 동일합니다.

**사용 예시:**

브라우저에서 직접 확인:
```
http://localhost:3000/api/widget?scholar_id=YOUR_SCHOLAR_ID
```

블로그에 iframe으로 임베드 (배포 후):
```html
<iframe
  src="https://your-domain.vercel.app/api/widget?scholar_id=YOUR_SCHOLAR_ID&count=5"
  width="100%"
  height="400"
  frameborder="0"
></iframe>
```

### 에러 응답

| HTTP 상태 | 원인 |
|-----------|------|
| 400 | `scholar_id` 파라미터 누락 또는 유효하지 않은 프로필 |
| 502 | Google Scholar 네트워크 연결 실패 |
| 503 | Google Scholar rate-limit / CAPTCHA 감지 |
| 500 | 내부 서버 에러 |

## 테스트

```bash
# 전체 테스트 실행
npm test

# 특정 테스트 파일 실행
npx vitest --run __tests__/scraper.test.ts
npx vitest --run __tests__/svg-renderer.test.ts
npx vitest --run __tests__/widget-renderer.test.ts
npx vitest --run __tests__/api-routes.test.ts
```

## Vercel 배포

### 방법 1: Vercel CLI

1. Vercel CLI 설치:
```bash
npm i -g vercel
```

2. 로그인:
```bash
vercel login
```

3. 배포:
```bash
# 프리뷰 배포 (테스트용)
vercel

# 프로덕션 배포
vercel --prod
```

배포가 완료되면 `https://your-project.vercel.app` 형태의 URL이 출력됩니다.

### 방법 2: GitHub 연동 (자동 배포)

1. GitHub에 리포지토리를 push합니다.

2. [vercel.com](https://vercel.com)에 로그인합니다.

3. "Add New Project" → GitHub 리포지토리를 선택합니다.

4. 설정은 기본값 그대로 두면 됩니다:
   - Framework Preset: `Next.js` (자동 감지)
   - Build Command: `next build`
   - Output Directory: `.next`

5. "Deploy"를 클릭합니다.

이후 `main` 브랜치에 push할 때마다 자동으로 프로덕션 배포가 진행됩니다. PR을 올리면 프리뷰 배포가 생성됩니다.

### 커스텀 도메인 설정

1. Vercel 대시보드 → 프로젝트 → Settings → Domains

2. 원하는 도메인을 추가합니다.

3. DNS 설정에서 Vercel이 안내하는 CNAME 또는 A 레코드를 추가합니다.

## 배포 후 사용 예시

배포 URL이 `https://scholar.vercel.app`이라고 가정하면:

**GitHub README:**
```markdown
## 📚 My Top Cited Papers

![Citations](https://scholar.vercel.app/api/badge?scholar_id=YOUR_ID&count=5)
```

**블로그 HTML:**
```html
<iframe
  src="https://scholar.vercel.app/api/widget?scholar_id=YOUR_ID"
  width="100%"
  height="500"
  style="border: none; border-radius: 8px;"
></iframe>
```

## 프로젝트 구조

```
├── app/api/
│   ├── badge/route.ts      # SVG 배지 API
│   └── widget/route.ts     # HTML 위젯 API
├── lib/
│   ├── scraper.ts           # Google Scholar 스크래핑
│   ├── cache.ts             # in-memory 캐시 (TTL 24h)
│   ├── types.ts             # 공유 타입 정의
│   ├── svg-renderer.ts      # SVG 렌더링
│   └── widget-renderer.ts   # HTML 위젯 렌더링
├── __tests__/               # 테스트 (vitest + fast-check)
├── package.json
└── next.config.ts
```

## 참고사항

- Google Scholar에는 공식 API가 없으므로 HTML 스크래핑을 사용합니다. 과도한 요청 시 CAPTCHA나 rate-limit이 발생할 수 있습니다.
- Vercel 서버리스 함수는 콜드 스타트 시 in-memory 캐시가 초기화됩니다. CDN Cache-Control 헤더(`s-maxage=86400`)로 대부분의 요청을 엣지에서 처리합니다.
- SVG 배지는 GitHub Markdown에서 렌더링 가능한 순수 SVG 요소만 사용합니다 (`<foreignObject>`, JavaScript 미사용).
