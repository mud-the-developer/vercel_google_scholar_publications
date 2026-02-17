export interface Paper {
  title: string;
  authors: string;
  citationCount: number;
  year: number | null;
  scholarUrl: string;
}

export interface CacheEntry {
  papers: Paper[];
  timestamp: number;
}

export interface ScraperResult {
  success: true;
  papers: Paper[];
}

export interface ScraperError {
  success: false;
  error: string;
  errorType: 'INVALID_PROFILE' | 'RATE_LIMITED' | 'NETWORK_ERROR' | 'PARSE_ERROR';
}

export type ScraperResponse = ScraperResult | ScraperError;
