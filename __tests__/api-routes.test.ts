import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock the scraper module to avoid real HTTP requests
vi.mock('../lib/scraper', () => ({
  scrapeScholarProfile: vi.fn(),
}));

import { scrapeScholarProfile } from '../lib/scraper';
import type { ScraperResponse } from '../lib/types';

const mockScrape = vi.mocked(scrapeScholarProfile);

const MOCK_PAPERS = [
  {
    title: 'Deep Learning Advances',
    authors: 'Alice, Bob',
    citationCount: 500,
    year: 2021,
    scholarUrl: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&citation_for_view=abc',
  },
  {
    title: 'Neural Networks Survey',
    authors: 'Charlie',
    citationCount: 200,
    year: 2020,
    scholarUrl: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&citation_for_view=def',
  },
];

function badgeUrl(params?: string): NextRequest {
  const url = params
    ? `http://localhost/api/badge?${params}`
    : 'http://localhost/api/badge';
  return new NextRequest(new URL(url));
}

function widgetUrl(params?: string): NextRequest {
  const url = params
    ? `http://localhost/api/widget?${params}`
    : 'http://localhost/api/widget';
  return new NextRequest(new URL(url));
}

describe('Badge API Route (/api/badge)', () => {
  let GET: (request: NextRequest) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    // Re-import to get a fresh module with a fresh cache instance
    const mod = await import('../app/api/badge/route');
    GET = mod.GET;
  });

  it('returns 400 when scholar_id is missing', async () => {
    const res = await GET(badgeUrl());
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe('scholar_id parameter is required');
  });

  it('returns Content-Type image/svg+xml on success', async () => {
    mockScrape.mockResolvedValue({ success: true, papers: MOCK_PAPERS });

    const res = await GET(badgeUrl('scholar_id=test123'));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/svg+xml');
  });

  it('includes Cache-Control header on success', async () => {
    mockScrape.mockResolvedValue({ success: true, papers: MOCK_PAPERS });

    const res = await GET(badgeUrl('scholar_id=test123'));
    expect(res.status).toBe(200);

    const cacheControl = res.headers.get('Cache-Control');
    expect(cacheControl).toBeTruthy();
    expect(cacheControl).toContain('max-age');
  });

  it('returns 500 with generic message when scraper throws', async () => {
    mockScrape.mockRejectedValue(new Error('Unexpected internal failure'));

    const res = await GET(badgeUrl('scholar_id=test123'));
    expect(res.status).toBe(500);

    const body = await res.json();
    expect(body.error).toBe('Internal server error');
    // Must NOT expose internal details
    expect(JSON.stringify(body)).not.toContain('Unexpected internal failure');
  });
});

describe('Widget API Route (/api/widget)', () => {
  let GET: (request: NextRequest) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    const mod = await import('../app/api/widget/route');
    GET = mod.GET;
  });

  it('returns 400 when scholar_id is missing', async () => {
    const res = await GET(widgetUrl());
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe('scholar_id parameter is required');
  });

  it('returns Content-Type text/html on success', async () => {
    mockScrape.mockResolvedValue({ success: true, papers: MOCK_PAPERS });

    const res = await GET(widgetUrl('scholar_id=test123'));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/html');
  });

  it('includes Cache-Control header on success', async () => {
    mockScrape.mockResolvedValue({ success: true, papers: MOCK_PAPERS });

    const res = await GET(widgetUrl('scholar_id=test123'));
    expect(res.status).toBe(200);

    const cacheControl = res.headers.get('Cache-Control');
    expect(cacheControl).toBeTruthy();
    expect(cacheControl).toContain('max-age');
  });

  it('returns 500 with generic message when scraper throws', async () => {
    mockScrape.mockRejectedValue(new Error('Unexpected internal failure'));

    const res = await GET(widgetUrl('scholar_id=test123'));
    expect(res.status).toBe(500);

    const body = await res.json();
    expect(body.error).toBe('Internal server error');
    // Must NOT expose internal details
    expect(JSON.stringify(body)).not.toContain('Unexpected internal failure');
  });
});
