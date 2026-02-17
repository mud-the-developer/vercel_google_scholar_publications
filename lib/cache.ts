import { Paper, CacheEntry } from './types';

export interface CacheConfig {
  ttlMs: number;
}

const DEFAULT_CONFIG: CacheConfig = {
  ttlMs: 24 * 60 * 60 * 1000, // 24 hours
};

export class CitationCache {
  private cache: Map<string, CacheEntry>;
  private config: CacheConfig;

  constructor(config?: Partial<CacheConfig>) {
    this.cache = new Map();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  get(scholarId: string): Paper[] | null {
    const entry = this.cache.get(scholarId);
    if (!entry) {
      return null;
    }

    const elapsed = Date.now() - entry.timestamp;
    if (elapsed >= this.config.ttlMs) {
      this.cache.delete(scholarId);
      return null;
    }

    return entry.papers;
  }

  set(scholarId: string, papers: Paper[]): void {
    this.cache.set(scholarId, {
      papers,
      timestamp: Date.now(),
    });
  }

  invalidate(scholarId: string): void {
    this.cache.delete(scholarId);
  }
}
