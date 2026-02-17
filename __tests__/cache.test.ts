import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { CitationCache } from '../lib/cache';
import { Paper } from '../lib/types';

const samplePapers: Paper[] = [
  {
    title: 'Deep Learning',
    authors: 'Y LeCun, Y Bengio, G Hinton',
    citationCount: 45000,
    year: 2015,
    scholarUrl: 'https://scholar.google.com/citations?view_op=view_citation&citation_for_view=abc123',
  },
  {
    title: 'Attention Is All You Need',
    authors: 'A Vaswani, N Shazeer',
    citationCount: 80000,
    year: 2017,
    scholarUrl: 'https://scholar.google.com/citations?view_op=view_citation&citation_for_view=def456',
  },
];

describe('CitationCache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null for a cache miss', () => {
    const cache = new CitationCache();
    expect(cache.get('nonexistent')).toBeNull();
  });

  it('stores and retrieves papers within TTL', () => {
    const cache = new CitationCache();
    cache.set('user123', samplePapers);
    expect(cache.get('user123')).toEqual(samplePapers);
  });

  it('returns null after TTL expires', () => {
    const cache = new CitationCache({ ttlMs: 1000 });
    cache.set('user123', samplePapers);

    vi.advanceTimersByTime(999);
    expect(cache.get('user123')).toEqual(samplePapers);

    vi.advanceTimersByTime(1);
    expect(cache.get('user123')).toBeNull();
  });

  it('uses default TTL of 24 hours', () => {
    const cache = new CitationCache();
    cache.set('user123', samplePapers);

    const almostExpired = 24 * 60 * 60 * 1000 - 1;
    vi.advanceTimersByTime(almostExpired);
    expect(cache.get('user123')).toEqual(samplePapers);

    vi.advanceTimersByTime(1);
    expect(cache.get('user123')).toBeNull();
  });

  it('invalidates a cached entry', () => {
    const cache = new CitationCache();
    cache.set('user123', samplePapers);
    expect(cache.get('user123')).toEqual(samplePapers);

    cache.invalidate('user123');
    expect(cache.get('user123')).toBeNull();
  });

  it('invalidating a non-existent entry does not throw', () => {
    const cache = new CitationCache();
    expect(() => cache.invalidate('nonexistent')).not.toThrow();
  });

  it('handles multiple scholar IDs independently', () => {
    const cache = new CitationCache();
    const otherPapers: Paper[] = [
      {
        title: 'Other Paper',
        authors: 'Author A',
        citationCount: 100,
        year: 2020,
        scholarUrl: 'https://scholar.google.com/citations?view_op=view_citation&citation_for_view=xyz',
      },
    ];

    cache.set('user1', samplePapers);
    cache.set('user2', otherPapers);

    expect(cache.get('user1')).toEqual(samplePapers);
    expect(cache.get('user2')).toEqual(otherPapers);

    cache.invalidate('user1');
    expect(cache.get('user1')).toBeNull();
    expect(cache.get('user2')).toEqual(otherPapers);
  });

  it('overwrites existing entry on set', () => {
    const cache = new CitationCache();
    cache.set('user123', samplePapers);

    const updatedPapers: Paper[] = [samplePapers[0]];
    cache.set('user123', updatedPapers);

    expect(cache.get('user123')).toEqual(updatedPapers);
  });

  it('stores empty paper array', () => {
    const cache = new CitationCache();
    cache.set('empty_user', []);
    expect(cache.get('empty_user')).toEqual([]);
  });
});


// --- Generators ---

const paperArb: fc.Arbitrary<Paper> = fc.record({
  title: fc.string({ minLength: 1 }),
  authors: fc.string({ minLength: 1 }),
  citationCount: fc.nat(),
  year: fc.option(fc.integer({ min: 1900, max: 2100 }), { nil: null }),
  scholarUrl: fc.webUrl(),
});

const papersArb: fc.Arbitrary<Paper[]> = fc.array(paperArb, { minLength: 0, maxLength: 20 });

const scholarIdArb: fc.Arbitrary<string> = fc.string({ minLength: 1, maxLength: 50 });

// --- Property-Based Tests ---

describe('CitationCache - Property-Based Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * Feature: scholar-citation-showcase, Property 3: 캐시 저장/조회 일관성
   *
   * For any scholar_id and Paper list, storing the data in Citation_Cache
   * and then immediately retrieving it (within TTL) SHALL return a Paper
   * list equivalent to the original.
   *
   * **Validates: Requirements 2.1**
   */
  it('Property 3: 캐시 저장/조회 일관성 - set then immediate get returns identical data', () => {
    fc.assert(
      fc.property(scholarIdArb, papersArb, (scholarId, papers) => {
        const cache = new CitationCache();
        cache.set(scholarId, papers);
        const retrieved = cache.get(scholarId);
        expect(retrieved).toEqual(papers);
      }),
      { numRuns: 20 },
    );
  });

  /**
   * Feature: scholar-citation-showcase, Property 4: 캐시 TTL 만료
   *
   * For any cache entry and any TTL value, if the elapsed time since storage
   * exceeds the TTL, the Citation_Cache SHALL return null for that entry.
   *
   * **Validates: Requirements 2.3, 2.4**
   */
  it('Property 4: 캐시 TTL 만료 - get returns null after TTL has elapsed', () => {
    fc.assert(
      fc.property(
        scholarIdArb,
        papersArb,
        fc.integer({ min: 1, max: 7 * 24 * 60 * 60 * 1000 }), // TTL: 1ms to 7 days
        fc.integer({ min: 0, max: 60 * 60 * 1000 }),           // extra time past TTL: 0 to 1 hour
        (scholarId, papers, ttlMs, extraMs) => {
          const cache = new CitationCache({ ttlMs });
          cache.set(scholarId, papers);

          // Advance time to exactly TTL + extra
          vi.advanceTimersByTime(ttlMs + extraMs);

          const retrieved = cache.get(scholarId);
          expect(retrieved).toBeNull();
        },
      ),
      { numRuns: 20 },
    );
  });
});
