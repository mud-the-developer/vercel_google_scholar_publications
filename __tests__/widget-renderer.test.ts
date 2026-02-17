import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { renderWidget } from '../lib/widget-renderer';
import { Paper } from '../lib/types';

// --- Generators ---

/**
 * Mirrors the escapeHtml function in widget-renderer.ts so we can predict
 * what the rendered output will contain for arbitrary string inputs.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Smart Paper generator constrained to realistic inputs.
 * - Titles and authors are non-empty strings with printable characters.
 * - citationCount is a non-negative integer.
 * - year is either a realistic year or null.
 * - scholarUrl is a valid web URL.
 */
const paperArb: fc.Arbitrary<Paper> = fc.record({
  title: fc
    .string({ minLength: 1, maxLength: 120 })
    .filter((s) => s.trim().length > 0),
  authors: fc
    .string({ minLength: 1, maxLength: 100 })
    .filter((s) => s.trim().length > 0),
  citationCount: fc.nat({ max: 999999 }),
  year: fc.oneof(
    fc.integer({ min: 1950, max: 2025 }),
    fc.constant(null),
  ),
  scholarUrl: fc.webUrl(),
});

const papersArb: fc.Arbitrary<Paper[]> = fc.array(paperArb, {
  minLength: 0,
  maxLength: 20,
});

const countArb: fc.Arbitrary<number> = fc.integer({ min: 1, max: 30 });

// --- Property-Based Tests ---

describe('Widget Renderer - Property-Based Tests', () => {
  /**
   * Feature: scholar-citation-showcase, Property 7: 위젯 렌더링 정확성
   *
   * For any list of Paper objects and any count parameter, the Widget_Renderer
   * SHALL produce HTML output containing exactly min(count, papers.length)
   * papers, and each rendered paper SHALL include the paper's title, authors,
   * citationCount, year, and scholarUrl link.
   *
   * **Validates: Requirements 4.1, 4.2, 4.4**
   */
  it('Property 7: 위젯 렌더링 정확성 – rendered HTML contains min(count, papers.length) papers with correct title, authors, citationCount, year, and scholarUrl', () => {
    fc.assert(
      fc.property(papersArb, countArb, (papers, count) => {
        const html = renderWidget(papers, { maxPapers: count });
        const expectedCount = Math.min(count, papers.length);
        const displayedPapers = papers.slice(0, expectedCount);

        // Verify each displayed paper's data appears in the HTML (escaped)
        for (const paper of displayedPapers) {
          // Title (HTML-escaped)
          expect(html).toContain(escapeHtml(paper.title));

          // Authors (HTML-escaped)
          expect(html).toContain(escapeHtml(paper.authors));

          // Citation count as string
          expect(html).toContain(String(paper.citationCount));

          // Year: null renders as "N/A", otherwise the year number
          const yearStr = paper.year !== null ? String(paper.year) : 'N/A';
          expect(html).toContain(yearStr);

          // Scholar URL appears in href attributes (HTML-escaped)
          expect(html).toContain(escapeHtml(paper.scholarUrl));
        }

        // Verify the count of rendered paper cards matches expectation.
        // Each paper is wrapped in a <div class="paper-card"> element.
        const cardMatches = html.match(/<div class="paper-card">/g) ?? [];
        expect(cardMatches.length).toBe(expectedCount);
      }),
      { numRuns: 20 },
    );
  });
});


// --- Unit Tests ---

describe('Widget Renderer - Unit Tests', () => {
  /**
   * **Validates: Requirements 4.5**
   * WHEN the count parameter exceeds the number of available papers,
   * THE Widget_Renderer SHALL display all available papers without error.
   */
  it('displays all papers when count exceeds papers.length', () => {
    const papers: Paper[] = [
      {
        title: 'Attention Is All You Need',
        authors: 'Vaswani, Shazeer, Parmar',
        citationCount: 90000,
        year: 2017,
        scholarUrl: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&citation_for_view=abc',
      },
      {
        title: 'BERT: Pre-training of Deep Bidirectional Transformers',
        authors: 'Devlin, Chang, Lee, Toutanova',
        citationCount: 70000,
        year: 2019,
        scholarUrl: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&citation_for_view=def',
      },
    ];

    // Request 10 papers but only 2 exist
    const html = renderWidget(papers, { maxPapers: 10 });

    // Should contain both papers' data
    expect(html).toContain('Attention Is All You Need');
    expect(html).toContain('Vaswani, Shazeer, Parmar');
    expect(html).toContain('90000');
    expect(html).toContain('2017');

    expect(html).toContain('BERT: Pre-training of Deep Bidirectional Transformers');
    expect(html).toContain('Devlin, Chang, Lee, Toutanova');
    expect(html).toContain('70000');
    expect(html).toContain('2019');

    // Should have exactly 2 paper cards
    const cardMatches = html.match(/<div class="paper-card">/g) ?? [];
    expect(cardMatches.length).toBe(2);
  });

  /**
   * **Validates: Requirements 4.5**
   * Rendering an empty paper list should produce valid HTML with no paper cards.
   */
  it('renders valid HTML for an empty paper list', () => {
    const html = renderWidget([]);

    // Should be a complete HTML document
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html).toContain('</html>');

    // No paper cards rendered
    const cardMatches = html.match(/<div class="paper-card">/g) ?? [];
    expect(cardMatches.length).toBe(0);

    // Header should still be present
    expect(html).toContain('Publications');
  });

  /**
   * **Validates: Requirements 4.3**
   * THE Widget_Renderer SHALL support iframe embedding by including
   * appropriate headers and responsive styling.
   */
  it('produces iframe-embeddable HTML with viewport meta and responsive CSS', () => {
    const papers: Paper[] = [
      {
        title: 'Test Paper',
        authors: 'Author A',
        citationCount: 42,
        year: 2023,
        scholarUrl: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&citation_for_view=xyz',
      },
    ];

    const html = renderWidget(papers);

    // Complete HTML document structure for iframe embedding
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html).toContain('<head>');
    expect(html).toContain('</head>');
    expect(html).toContain('<body>');
    expect(html).toContain('</body>');
    expect(html).toContain('</html>');

    // Viewport meta tag for responsive rendering in iframes
    expect(html).toContain('<meta name="viewport"');
    expect(html).toContain('width=device-width');

    // Responsive CSS: media query for small screens
    expect(html).toContain('@media');
    expect(html).toContain('max-width');

    // Responsive CSS: box-sizing for consistent layout
    expect(html).toContain('box-sizing: border-box');
  });
});
