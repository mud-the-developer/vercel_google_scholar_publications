# Implementation Plan: Scholar Citation Showcase

## Overview

Next.js App Router 기반으로 Google Scholar 인용 데이터를 스크래핑하여 SVG 배지와 HTML 위젯으로 제공하는 서비스를 구현한다. 핵심 라이브러리(scraper, cache, renderers)를 먼저 구현하고, API Route로 연결한 뒤, 테스트로 검증하는 순서로 진행한다.

## Tasks

- [x] 1. 프로젝트 초기 설정
  - [x] 1.1 Next.js 프로젝트 생성 및 의존성 설치
    - `next`, `typescript`, `cheerio` 설치
    - `vitest`, `fast-check` 개발 의존성 설치
    - `tsconfig.json`, `next.config.ts`, `vitest.config.ts` 설정
    - _Requirements: 5.1, 5.2_
  - [x] 1.2 공유 타입 정의 (`lib/types.ts`)
    - `Paper`, `CacheEntry`, `ScraperResult`, `ScraperError`, `ScraperResponse` 인터페이스 정의
    - _Requirements: 1.2, 6.1_

- [x] 2. Scholar Scraper 구현
  - [x] 2.1 스크래퍼 핵심 로직 구현 (`lib/scraper.ts`)
    - Google Scholar 프로필 페이지 fetch 및 cheerio로 HTML 파싱
    - 논문 제목, 저자, 인용 수, 출판 연도, 링크 추출
    - 인용 수 기준 내림차순 정렬
    - 에러 처리: INVALID_PROFILE, RATE_LIMITED, NETWORK_ERROR, PARSE_ERROR
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [x] 2.2 스크래퍼 속성 테스트 작성
    - **Property 1: 스크래퍼 출력 정확성** - 유효한 Scholar HTML에서 파싱된 결과가 citationCount 내림차순이며 각 Paper에 필수 필드가 존재하는지 검증
    - **Validates: Requirements 1.1, 1.2**
    - **Property 2: 스크래퍼 견고성** - 임의의 HTML 문자열에 대해 예외 없이 ScraperResult 또는 ScraperError를 반환하는지 검증
    - **Validates: Requirements 1.5**
  - [x] 2.3 스크래퍼 단위 테스트 작성
    - 유효하지 않은 scholar_id 에러 케이스
    - CAPTCHA/rate-limit 응답 처리
    - 빈 프로필 페이지 처리
    - _Requirements: 1.3, 1.4_

- [x] 3. Citation Cache 구현
  - [x] 3.1 캐시 계층 구현 (`lib/cache.ts`)
    - in-memory Map 기반 CitationCache 클래스
    - TTL 기반 만료 로직 (기본 24시간)
    - get/set/invalidate 메서드
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 3.2 캐시 속성 테스트 작성
    - **Property 3: 캐시 저장/조회 일관성** - 임의의 scholar_id와 Paper 배열을 저장 후 즉시 조회하면 동일한 데이터가 반환되는지 검증
    - **Validates: Requirements 2.1**
    - **Property 4: 캐시 TTL 만료** - TTL 경과 후 캐시 엔트리가 null로 반환되는지 검증
    - **Validates: Requirements 2.3, 2.4**

- [x] 4. Paper 직렬화 검증
  - [x] 4.1 직렬화 라운드트립 속성 테스트 작성
    - **Property 8: Paper 직렬화 라운드트립** - 임의의 Paper 객체를 JSON 직렬화 후 역직렬화하면 원본과 동일한지 검증
    - **Validates: Requirements 6.3**

- [x] 5. Checkpoint - 핵심 라이브러리 검증
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. SVG Renderer 구현
  - [x] 6.1 SVG 렌더러 구현 (`lib/svg-renderer.ts`)
    - Paper 배열을 SVG 문자열로 변환하는 renderSVG 함수
    - 논문 제목, 인용 수, 출판 연도 표시
    - count 파라미터로 표시 논문 수 제어 (기본값 5)
    - GitHub Markdown 호환 순수 SVG 요소만 사용
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  - [x] 6.2 SVG 렌더러 속성 테스트 작성
    - **Property 5: SVG 렌더링 정확성** - 임의의 Paper 배열과 count에 대해 min(count, papers.length)개의 논문이 포함되고 각 논문의 title, citationCount, year가 SVG에 존재하는지 검증
    - **Validates: Requirements 3.1, 3.2, 3.3**
    - **Property 6: SVG 구조적 유효성** - 임의의 Paper 배열에 대해 출력이 `<svg`로 시작하고 `</svg>`로 끝나는 유효한 SVG인지 검증
    - **Validates: Requirements 3.4**
  - [x] 6.3 SVG 렌더러 단위 테스트 작성
    - count가 논문 수 초과 시 전체 논문 표시
    - 빈 논문 목록 렌더링
    - _Requirements: 3.5_

- [ ] 7. Widget Renderer 구현
  - [x] 7.1 위젯 렌더러 구현 (`lib/widget-renderer.ts`)
    - Paper 배열을 self-contained HTML 페이지로 변환하는 renderWidget 함수
    - 논문 제목, 저자, 인용 수, 출판 연도, Google Scholar 링크 표시
    - count 파라미터로 표시 논문 수 제어 (기본값 5)
    - 반응형 인라인 CSS 스타일링
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [x] 7.2 위젯 렌더러 속성 테스트 작성
    - **Property 7: 위젯 렌더링 정확성** - 임의의 Paper 배열과 count에 대해 min(count, papers.length)개의 논문이 포함되고 각 논문의 title, authors, citationCount, year, scholarUrl이 HTML에 존재하는지 검증
    - **Validates: Requirements 4.1, 4.2, 4.4**
  - [x] 7.3 위젯 렌더러 단위 테스트 작성
    - count가 논문 수 초과 시 전체 논문 표시
    - 빈 논문 목록 렌더링
    - iframe 임베드 호환성 확인
    - _Requirements: 4.3, 4.5_

- [x] 8. Checkpoint - 렌더러 검증
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. API Routes 구현 및 통합
  - [x] 9.1 Badge API Route 구현 (`app/api/badge/route.ts`)
    - GET 핸들러: scholar_id 파라미터 검증, 캐시 조회/스크래핑, SVG 렌더링
    - Content-Type: image/svg+xml 헤더 설정
    - Cache-Control 헤더로 CDN 캐싱 활성화
    - 에러 응답: 400 (파라미터 누락), 500/502/503 (내부 에러)
    - _Requirements: 5.1, 5.3, 5.4, 5.5_
  - [x] 9.2 Widget API Route 구현 (`app/api/widget/route.ts`)
    - GET 핸들러: scholar_id 파라미터 검증, 캐시 조회/스크래핑, HTML 렌더링
    - Content-Type: text/html 헤더 설정
    - Cache-Control 헤더로 CDN 캐싱 활성화
    - 에러 응답: 400 (파라미터 누락), 500/502/503 (내부 에러)
    - _Requirements: 5.2, 5.3, 5.4, 5.5_
  - [x] 9.3 API Route 단위 테스트 작성
    - scholar_id 누락 시 400 응답
    - 정상 요청 시 올바른 Content-Type 헤더
    - Cache-Control 헤더 존재 확인
    - 내부 에러 시 500 응답 (내부 상세 미노출)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 10. Final Checkpoint - 전체 통합 검증
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- `*` 표시된 태스크는 선택 사항이며 빠른 MVP를 위해 건너뛸 수 있음
- 각 태스크는 추적 가능성을 위해 특정 요구사항을 참조함
- 체크포인트에서 점진적 검증 수행
- 속성 테스트는 보편적 정확성 속성을 검증하고, 단위 테스트는 구체적 예시와 엣지 케이스를 검증함
