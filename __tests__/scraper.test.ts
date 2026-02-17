import { describe, it, expect, vi } from 'vitest';
import { parseScholarHTML, scrapeScholarProfile } from '../lib/scraper';

// Helper: build a minimal valid Scholar profile HTML
function buildScholarHTML(
  papers: Array<{
    title: string;
    authors?: string;
    citations?: string;
    year?: string;
    href?: string;
  }>,
  profileName = 'Test Researcher',
): string {
  const rows = papers
    .map(
      (p) => `
    <tr class="gsc_a_tr">
      <td class="gsc_a_t">
        <a class="gsc_a_at" href="${p.href ?? '/citations?view_op=view_citation&hl=en&citation_for_view=abc123'}">${p.title}</a>
        <div class="gs_gray">${p.authors ?? 'Author A, Author B'}</div>
        <div class="gs_gray">Journal of Testing, 2023</div>
      </td>
      <td class="gsc_a_c"><a class="gsc_a_ac gs_ibl" href="#">${p.citations ?? ''}</a></td>
      <td class="gsc_a_y"><span class="gsc_a_h gsc_a_hc gs_ibl">${p.year ?? ''}</span></td>
    </tr>`,
    )
    .join('\n');

  return `
    <html>
    <body>
      <div id="gsc_prf_in">${profileName}</div>
      <table id="gsc_a_t">
        <tbody id="gsc_a_b">${rows}</tbody>
      </table>
    </body>
    </html>`;
}

describe('parseScholarHTML', () => {
  it('extracts papers from valid Scholar HTML', () => {
    const html = buildScholarHTML([
      { title: 'Paper A', authors: 'Alice, Bob', citations: '100', year: '2020', href: '/citations?view_op=view_citation&hl=en&citation_for_view=abc' },
      { title: 'Paper B', authors: 'Charlie', citations: '50', year: '2021' },
    ]);

    const result = parseScholarHTML(html);
    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.papers).toHaveLength(2);
    expect(result.papers[0].title).toBe('Paper A');
    expect(result.papers[0].authors).toBe('Alice, Bob');
    expect(result.papers[0].citationCount).toBe(100);
    expect(result.papers[0].year).toBe(2020);
    expect(result.papers[0].scholarUrl).toContain('scholar.google.com');
  });

  it('sorts papers by citation count descending', () => {
    const html = buildScholarHTML([
      { title: 'Low', citations: '10' },
      { title: 'High', citations: '500' },
      { title: 'Mid', citations: '100' },
    ]);

    const result = parseScholarHTML(html);
    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.papers.map((p) => p.citationCount)).toEqual([500, 100, 10]);
  });

  it('handles papers with missing citation count', () => {
    const html = buildScholarHTML([
      { title: 'No Citations', citations: '' },
    ]);

    const result = parseScholarHTML(html);
    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.papers[0].citationCount).toBe(0);
  });

  it('handles papers with missing year', () => {
    const html = buildScholarHTML([
      { title: 'No Year', year: '' },
    ]);

    const result = parseScholarHTML(html);
    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.papers[0].year).toBeNull();
  });

  it('returns INVALID_PROFILE for HTML without profile or table', () => {
    const result = parseScholarHTML('<html><body><p>Nothing here</p></body></html>');
    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.errorType).toBe('INVALID_PROFILE');
  });

  it('returns RATE_LIMITED when CAPTCHA element is present', () => {
    const html = '<html><body><div id="gs_captcha_ccl">Captcha</div></body></html>';
    const result = parseScholarHTML(html);
    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.errorType).toBe('RATE_LIMITED');
  });

  it('returns RATE_LIMITED when robot check text is present', () => {
    const html = '<html><body>Please show you&#39;re not a robot</body></html>';
    const result = parseScholarHTML(html);
    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.errorType).toBe('RATE_LIMITED');
  });

  it('returns empty papers array for profile with no publications', () => {
    const html = buildScholarHTML([], 'Empty Researcher');
    const result = parseScholarHTML(html);
    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.papers).toEqual([]);
  });

  it('handles absolute URLs in paper links', () => {
    const html = buildScholarHTML([
      { title: 'Absolute Link', href: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&citation_for_view=xyz' },
    ]);

    const result = parseScholarHTML(html);
    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.papers[0].scholarUrl).toBe(
      'https://scholar.google.com/citations?view_op=view_citation&hl=en&citation_for_view=xyz',
    );
  });
});

describe('scrapeScholarProfile', () => {
  it('returns NETWORK_ERROR when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Connection refused')));

    const result = await scrapeScholarProfile('test123');
    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.errorType).toBe('NETWORK_ERROR');
    expect(result.error).toContain('Connection refused');

    vi.unstubAllGlobals();
  });

  it('returns RATE_LIMITED for HTTP 429', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Too Many Requests', { status: 429 })),
    );

    const result = await scrapeScholarProfile('test123');
    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.errorType).toBe('RATE_LIMITED');

    vi.unstubAllGlobals();
  });

  it('returns NETWORK_ERROR for non-OK responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Server Error', { status: 500 })),
    );

    const result = await scrapeScholarProfile('test123');
    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.errorType).toBe('NETWORK_ERROR');

    vi.unstubAllGlobals();
  });

  it('parses valid HTML response from fetch', async () => {
    const html = buildScholarHTML([
      { title: 'Fetched Paper', citations: '42', year: '2022' },
    ]);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(html, { status: 200 })),
    );

    const result = await scrapeScholarProfile('validuser');
    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.papers).toHaveLength(1);
    expect(result.papers[0].title).toBe('Fetched Paper');

    vi.unstubAllGlobals();
  });
});

// ---------------------------------------------------------------------------
// Property-Based Tests (fast-check)
// ---------------------------------------------------------------------------
import fc from 'fast-check';

/**
 * Generator: produce a random paper descriptor used to build Scholar HTML.
 * Constrains values to realistic ranges so the generated HTML is structurally
 * valid (mimics a real Google Scholar profile page).
 */
const arbPaperDescriptor = fc.record({
  title: fc.string({ minLength: 1, maxLength: 80 }).filter((s) => !/<|>/.test(s) && s.trim().length > 0),
  authors: fc.string({ minLength: 0, maxLength: 60 }).filter((s) => !/<|>/.test(s)),
  citations: fc.nat({ max: 999999 }).map(String),
  year: fc.oneof(
    fc.integer({ min: 1950, max: 2025 }).map(String),
    fc.constant(''),
  ),
  href: fc.constant('/citations?view_op=view_citation&hl=en&citation_for_view=test123'),
});

/**
 * Build a valid Scholar profile HTML page from an array of paper descriptors.
 * Re-uses the same structure as the unit-test helper but accepts generated data.
 */
function buildScholarHTMLFromDescriptors(
  papers: Array<{
    title: string;
    authors: string;
    citations: string;
    year: string;
    href: string;
  }>,
): string {
  const rows = papers
    .map(
      (p) => `
    <tr class="gsc_a_tr">
      <td class="gsc_a_t">
        <a class="gsc_a_at" href="${p.href}">${p.title}</a>
        <div class="gs_gray">${p.authors}</div>
        <div class="gs_gray">Journal, 2023</div>
      </td>
      <td class="gsc_a_c"><a class="gsc_a_ac gs_ibl" href="#">${p.citations}</a></td>
      <td class="gsc_a_y"><span class="gsc_a_hc gs_ibl">${p.year}</span></td>
    </tr>`,
    )
    .join('\n');

  return `
    <html><body>
      <div id="gsc_prf_in">Generated Researcher</div>
      <table id="gsc_a_t"><tbody id="gsc_a_b">${rows}</tbody></table>
    </body></html>`;
}

describe('Property-Based Tests – Scholar Scraper', () => {
  it('Property 1: 스크래퍼 출력 정확성 – parsed results are sorted descending by citationCount and every Paper has required fields', () => {
    /**
     * Feature: scholar-citation-showcase, Property 1: 스크래퍼 출력 정확성
     * Validates: Requirements 1.1, 1.2
     */
    fc.assert(
      fc.property(
        fc.array(arbPaperDescriptor, { minLength: 0, maxLength: 30 }),
        (descriptors) => {
          const html = buildScholarHTMLFromDescriptors(descriptors);
          const result = parseScholarHTML(html);

          // Must succeed for valid Scholar HTML
          expect(result.success).toBe(true);
          if (!result.success) return;

          const { papers } = result;

          // Number of papers should match input (all have non-empty titles)
          expect(papers.length).toBe(descriptors.length);

          // Sorted by citationCount descending
          for (let i = 1; i < papers.length; i++) {
            expect(papers[i - 1].citationCount).toBeGreaterThanOrEqual(papers[i].citationCount);
          }

          // Each paper has required fields
          for (const paper of papers) {
            expect(typeof paper.title).toBe('string');
            expect(paper.title.length).toBeGreaterThan(0);

            expect(typeof paper.authors).toBe('string');
            // authors can be empty string – that's acceptable

            expect(typeof paper.citationCount).toBe('number');
            expect(paper.citationCount).toBeGreaterThanOrEqual(0);

            expect(typeof paper.scholarUrl).toBe('string');
            expect(paper.scholarUrl.length).toBeGreaterThan(0);
          }
        },
      ),
      { numRuns: 20 },
    );
  });

  it('Property 2: 스크래퍼 견고성 – arbitrary HTML never throws, always returns ScraperResult or ScraperError', () => {
    /**
     * Feature: scholar-citation-showcase, Property 2: 스크래퍼 견고성
     * Validates: Requirements 1.5
     */
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 2000 }),
        (arbitraryHtml) => {
          // Must not throw
          const result = parseScholarHTML(arbitraryHtml);

          // Must be either ScraperResult or ScraperError
          expect(typeof result).toBe('object');
          expect(result).not.toBeNull();
          expect(typeof result.success).toBe('boolean');

          if (result.success) {
            // ScraperResult
            expect(Array.isArray(result.papers)).toBe(true);
            for (const paper of result.papers) {
              expect(typeof paper.title).toBe('string');
              expect(typeof paper.citationCount).toBe('number');
            }
          } else {
            // ScraperError
            expect(typeof result.error).toBe('string');
            expect(['INVALID_PROFILE', 'RATE_LIMITED', 'NETWORK_ERROR', 'PARSE_ERROR']).toContain(
              result.errorType,
            );
          }
        },
      ),
      { numRuns: 20 },
    );
  });
});

