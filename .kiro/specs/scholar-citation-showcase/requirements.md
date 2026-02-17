# 요구사항 문서

## 소개

Google Scholar 프로필에서 논문 인용 데이터를 가져와, 인용 수 기준 상위 논문을 GitHub README 배지(SVG)와 블로그 임베드 위젯(HTML)으로 시각화하는 서비스이다. Vercel 서버리스 환경에 배포하며, Google Scholar의 요청 제한을 고려한 캐싱 전략을 포함한다.

## 용어집

- **Scholar_Scraper**: Google Scholar 프로필 페이지에서 논문 및 인용 데이터를 파싱하여 추출하는 모듈
- **Citation_Cache**: 스크래핑 결과를 일정 시간 동안 저장하여 반복 요청 시 Google Scholar 접근을 줄이는 캐시 계층
- **SVG_Renderer**: 인용 데이터를 GitHub README에 임베드 가능한 SVG 이미지로 변환하는 모듈
- **Widget_Renderer**: 인용 데이터를 블로그에 임베드 가능한 HTML/JS 위젯으로 변환하는 모듈
- **API_Server**: Vercel 서버리스 함수로 동작하며, 클라이언트 요청을 처리하고 적절한 응답을 반환하는 서버
- **Scholar_Profile**: Google Scholar 사용자 프로필 페이지 (scholar_id로 식별)
- **Paper**: 제목, 저자, 인용 수, 출판 연도, 링크 등의 정보를 포함하는 논문 데이터 단위

## 요구사항

### 요구사항 1: Google Scholar 프로필 스크래핑

**사용자 스토리:** 연구자로서, 나의 Google Scholar 프로필에서 논문 목록과 인용 수를 자동으로 가져오고 싶다. 이를 통해 수동 입력 없이 최신 인용 데이터를 활용할 수 있다.

#### 인수 조건

1. WHEN a valid scholar_id is provided, THE Scholar_Scraper SHALL fetch the profile page and extract a list of Paper objects sorted by citation count in descending order
2. WHEN the Scholar_Scraper extracts a Paper, THE Scholar_Scraper SHALL include the title, authors, citation count, publication year, and Google Scholar link for each Paper
3. IF the scholar_id is invalid or the profile page is unreachable, THEN THE Scholar_Scraper SHALL return a descriptive error indicating the failure reason
4. IF Google Scholar returns a CAPTCHA or rate-limit response, THEN THE Scholar_Scraper SHALL return a specific error indicating rate limiting and suggest retrying later
5. WHEN the Scholar_Scraper parses the profile page, THE Scholar_Scraper SHALL handle variations in page structure gracefully without crashing

### 요구사항 2: 인용 데이터 캐싱

**사용자 스토리:** 서비스 운영자로서, Google Scholar에 과도한 요청을 보내지 않도록 캐싱을 적용하고 싶다. 이를 통해 서비스 안정성을 유지하고 차단을 방지할 수 있다.

#### 인수 조건

1. WHEN a scholar_id is requested and a valid cache entry exists, THE Citation_Cache SHALL return the cached data without contacting Google Scholar
2. WHEN a scholar_id is requested and no valid cache entry exists, THE Citation_Cache SHALL trigger a fresh scrape and store the result
3. THE Citation_Cache SHALL expire cached entries after a configurable time-to-live (TTL) period, defaulting to 24 hours
4. WHEN the cache TTL has elapsed for an entry, THE Citation_Cache SHALL treat the entry as invalid and trigger a fresh scrape on the next request
5. THE Citation_Cache SHALL operate within Vercel serverless constraints using an in-memory or file-based approach suitable for the environment

### 요구사항 3: SVG 배지 렌더링 (GitHub README용)

**사용자 스토리:** 연구자로서, 나의 GitHub README에 상위 인용 논문 목록을 보여주는 배지를 삽입하고 싶다. 이를 통해 프로필 방문자에게 연구 성과를 시각적으로 전달할 수 있다.

#### 인수 조건

1. WHEN a valid scholar_id and optional count parameter are provided, THE SVG_Renderer SHALL generate an SVG image displaying the top-cited papers
2. THE SVG_Renderer SHALL display each paper's title, citation count, and publication year in the generated SVG
3. THE SVG_Renderer SHALL support a configurable number of papers to display via a count query parameter, defaulting to 5
4. THE SVG_Renderer SHALL generate valid SVG markup that renders correctly in GitHub Markdown
5. WHEN the count parameter exceeds the number of available papers, THE SVG_Renderer SHALL display all available papers without error
6. THE SVG_Renderer SHALL apply a clean, readable visual style with consistent spacing and typography

### 요구사항 4: HTML 위젯 렌더링 (블로그 임베드용)

**사용자 스토리:** 연구자로서, 나의 블로그에 인용 상위 논문 위젯을 임베드하고 싶다. 이를 통해 블로그 방문자에게 연구 성과를 동적으로 보여줄 수 있다.

#### 인수 조건

1. WHEN a valid scholar_id and optional count parameter are provided, THE Widget_Renderer SHALL generate an HTML page displaying the top-cited papers
2. THE Widget_Renderer SHALL display each paper's title, authors, citation count, publication year, and a link to the Google Scholar page
3. THE Widget_Renderer SHALL support iframe embedding by including appropriate headers and responsive styling
4. THE Widget_Renderer SHALL support a configurable number of papers to display via a count query parameter, defaulting to 5
5. WHEN the count parameter exceeds the number of available papers, THE Widget_Renderer SHALL display all available papers without error
6. THE Widget_Renderer SHALL apply responsive CSS styling that adapts to the container width

### 요구사항 5: Vercel API 엔드포인트

**사용자 스토리:** 서비스 운영자로서, Vercel 서버리스 함수로 API를 제공하고 싶다. 이를 통해 별도 서버 관리 없이 안정적으로 서비스를 운영할 수 있다.

#### 인수 조건

1. WHEN a GET request is made to /api/badge with a scholar_id query parameter, THE API_Server SHALL return an SVG response with Content-Type image/svg+xml
2. WHEN a GET request is made to /api/widget with a scholar_id query parameter, THE API_Server SHALL return an HTML response with Content-Type text/html
3. IF a request is missing the required scholar_id parameter, THEN THE API_Server SHALL return a 400 status code with a descriptive error message
4. THE API_Server SHALL set appropriate Cache-Control headers to enable CDN-level caching on Vercel's edge network
5. IF an internal error occurs during scraping or rendering, THEN THE API_Server SHALL return a 500 status code with a generic error message without exposing internal details

### 요구사항 6: 데이터 직렬화 및 역직렬화

**사용자 스토리:** 개발자로서, 스크래핑된 논문 데이터를 JSON 형식으로 직렬화하고 역직렬화할 수 있어야 한다. 이를 통해 캐시 저장 및 API 응답에서 데이터 무결성을 보장할 수 있다.

#### 인수 조건

1. THE Scholar_Scraper SHALL serialize Paper objects to JSON format for cache storage
2. THE Citation_Cache SHALL deserialize JSON data back into Paper objects when reading from cache
3. FOR ALL valid Paper objects, serializing then deserializing SHALL produce an equivalent Paper object (round-trip property)
