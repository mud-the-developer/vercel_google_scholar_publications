import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { Paper } from '../lib/types';

// --- Generator ---

const paperArb: fc.Arbitrary<Paper> = fc.record({
  title: fc.string({ minLength: 1 }),
  authors: fc.string({ minLength: 1 }),
  citationCount: fc.nat(),
  year: fc.option(fc.integer({ min: 1900, max: 2100 }), { nil: null }),
  scholarUrl: fc.webUrl(),
});

// --- Property-Based Tests ---

describe('Paper Serialization - Property-Based Tests', () => {
  /**
   * Feature: scholar-citation-showcase, Property 8: Paper 직렬화 라운드트립
   *
   * For any valid Paper object, serializing to JSON and then deserializing
   * back SHALL produce a Paper object equivalent to the original.
   *
   * **Validates: Requirements 6.3**
   */
  it('Property 8: Paper 직렬화 라운드트립 - JSON.stringify then JSON.parse produces equivalent Paper', () => {
    fc.assert(
      fc.property(paperArb, (paper) => {
        const serialized = JSON.stringify(paper);
        const deserialized: Paper = JSON.parse(serialized);
        expect(deserialized).toEqual(paper);
      }),
      { numRuns: 20 },
    );
  });
});
