import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { renderSVG } from '../lib/svg-renderer';
import { Paper } from '../lib/types';

// --- Generators ---

/**
 * Smart Paper generator that constrains to realistic input space.
 * Titles avoid XML-special characters to simplify content verification,
 * since the renderer applies escapeXml internally.
 */
const paperArb: fc.Arbitrary<Paper> = fc.record({
  // Use a prefix to make titles unique and long enough to avoid false
  // substring matches against SVG boilerplate (e.g. single-char titles
  // like "c" matching "Cited").
  title: fc
    .stringMatching(/^[A-Za-z0-9 .,:\-()]+$/)
    .filter((s) => s.trim().length > 0 && s.length >= 5 && s.length <= 120)
    .map((s) => `Title_${s}`),
  authors: fc.string({ minLength: 1, maxLength: 60 }),
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

describe('SVG Renderer - Property-Based Tests', () => {
  /**
   * Feature: scholar-citation-showcase, Property 5: SVG 렌더링 정확성
   *
   * For any list of Paper objects and any count parameter, the SVG_Renderer
   * SHALL produce output containing exactly min(count, papers.length) papers,
   * and each rendered paper SHALL include the paper's title, citationCount,
   * and publication year.
   *
   * **Validates: Requirements 3.1, 3.2, 3.3**
   */
  it('Property 5: SVG 렌더링 정확성 – rendered SVG contains min(count, papers.length) papers with correct title, citationCount, and year', () => {
    fc.assert(
      fc.property(papersArb, countArb, (papers, count) => {
        const svg = renderSVG(papers, { maxPapers: count });
        const expectedCount = Math.min(count, papers.length);
        const displayedPapers = papers.slice(0, expectedCount);

        // Verify each displayed paper's data appears in the SVG
        for (const paper of displayedPapers) {
          // Title: renderer truncates at 42 chars, so check the truncated form
          const truncated =
            paper.title.length > 42
              ? paper.title.slice(0, 41) + '…'
              : paper.title;
          expect(svg).toContain(truncated);

          // Citation count must appear
          expect(svg).toContain(String(paper.citationCount));

          // Year: null renders as "N/A", otherwise the year number
          const yearStr = paper.year !== null ? String(paper.year) : 'N/A';
          expect(svg).toContain(yearStr);
        }

        // Verify the count of rendered papers matches expectation.
        // Each paper row has a title <text> with font-size="13" and font-weight="600".
        const titleElements = svg.match(/font-size="13" fill="[^"]*" font-weight="600">/g) ?? [];
        expect(titleElements.length).toBe(expectedCount);
      }),
      { numRuns: 20 },
    );
  });

  /**
   * Feature: scholar-citation-showcase, Property 6: SVG 구조적 유효성
   *
   * For any list of Paper objects (including empty list), the SVG_Renderer
   * SHALL produce output that is valid SVG markup starting with `<svg` and
   * ending with `</svg>`.
   *
   * **Validates: Requirements 3.4**
   */
  it('Property 6: SVG 구조적 유효성 – output starts with <svg and ends with </svg>', () => {
    fc.assert(
      fc.property(papersArb, (papers) => {
        const svg = renderSVG(papers);
        const trimmed = svg.trim();

        expect(trimmed.startsWith('<svg')).toBe(true);
        expect(trimmed.endsWith('</svg>')).toBe(true);
      }),
      { numRuns: 20 },
    );
  });
});

// --- Unit Tests ---

describe('SVG Renderer - Unit Tests', () => {
  /**
   * **Validates: Requirements 3.5**
   * WHEN the count parameter exceeds the number of available papers,
   * THE SVG_Renderer SHALL display all available papers without error.
   */
  it('displays all papers when count exceeds papers.length', () => {
    const papers: Paper[] = [
      {
        title: 'Deep Learning for NLP',
        authors: 'Alice, Bob',
        citationCount: 500,
        year: 2020,
        scholarUrl: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&citation_for_view=abc',
      },
      {
        title: 'Reinforcement Learning Survey',
        authors: 'Charlie',
        citationCount: 300,
        year: 2019,
        scholarUrl: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&citation_for_view=def',
      },
    ];

    // Request 10 papers but only 2 exist
    const svg = renderSVG(papers, { maxPapers: 10 });

    // Should contain both papers' data
    expect(svg).toContain('Deep Learning for NLP');
    expect(svg).toContain('500');
    expect(svg).toContain('2020');

    expect(svg).toContain('Reinforcement Learning Survey');
    expect(svg).toContain('300');
    expect(svg).toContain('2019');

    // Should have exactly 2 title elements (one per paper)
    const titleElements = svg.match(/font-size="13" fill="[^"]*" font-weight="600">/g) ?? [];
    expect(titleElements.length).toBe(2);

    // Should still be valid SVG
    const trimmed = svg.trim();
    expect(trimmed.startsWith('<svg')).toBe(true);
    expect(trimmed.endsWith('</svg>')).toBe(true);
  });

  /**
   * **Validates: Requirements 3.5**
   * Rendering an empty paper list should produce valid SVG with no paper rows.
   */
  it('renders valid SVG for an empty paper list', () => {
    const svg = renderSVG([]);

    // Valid SVG structure
    const trimmed = svg.trim();
    expect(trimmed.startsWith('<svg')).toBe(true);
    expect(trimmed.endsWith('</svg>')).toBe(true);

    // No paper rows rendered
    const titleElements = svg.match(/font-size="13" fill="[^"]*" font-weight="600">/g) ?? [];
    expect(titleElements.length).toBe(0);

    // Header should still be present
    expect(svg).toContain('Publications');
  });
});

