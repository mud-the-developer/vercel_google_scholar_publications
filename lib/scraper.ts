import * as cheerio from 'cheerio';
import type { Paper, ScraperResponse } from './types';

const SCHOLAR_BASE_URL = 'https://scholar.google.com';
const PROFILE_URL = `${SCHOLAR_BASE_URL}/citations`;

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Parse raw Google Scholar profile HTML and extract paper data.
 * Exported separately for testability (property-based tests can call this
 * without making network requests).
 */
export function parseScholarHTML(html: string): ScraperResponse {
  try {
    const $ = cheerio.load(html);

    // Detect CAPTCHA / rate-limit pages
    if ($('#gs_captcha_ccl').length > 0 || html.includes('Please show you&#39;re not a robot')) {
      return {
        success: false,
        error: 'Google Scholar rate limit detected. Please retry later.',
        errorType: 'RATE_LIMITED',
      };
    }

    // Detect invalid profile – Scholar shows a specific page when user doesn't exist
    const profileName = $('#gsc_prf_in').text().trim();
    const tableBody = $('#gsc_a_b');

    if (!profileName && tableBody.length === 0) {
      return {
        success: false,
        error: 'Invalid scholar profile. The profile page could not be found.',
        errorType: 'INVALID_PROFILE',
      };
    }

    const papers: Paper[] = [];

    tableBody.find('.gsc_a_tr').each((_index, row) => {
      const $row = $(row);

      const titleEl = $row.find('.gsc_a_at');
      const title = titleEl.text().trim();
      const href = titleEl.attr('href') ?? '';
      const scholarUrl = href.startsWith('http') ? href : href ? `${SCHOLAR_BASE_URL}${href}` : '';

      const authors = $row.find('.gs_gray').first().text().trim();

      const citationText = $row.find('.gsc_a_c a').text().trim();
      const citationCount = citationText ? parseInt(citationText, 10) : 0;

      const yearText = $row.find('.gsc_a_y span').text().trim();
      const year = yearText ? parseInt(yearText, 10) : null;

      if (title) {
        papers.push({
          title,
          authors: authors || '',
          citationCount: isNaN(citationCount) ? 0 : citationCount,
          year: year !== null && isNaN(year) ? null : year,
          scholarUrl,
        });
      }
    });

    // Sort by citation count descending
    papers.sort((a, b) => b.citationCount - a.citationCount);

    return { success: true, papers };
  } catch {
    return {
      success: false,
      error: 'Failed to parse Google Scholar profile page.',
      errorType: 'PARSE_ERROR',
    };
  }
}


/**
 * Scrape a Google Scholar profile by scholar ID.
 * Fetches the profile page sorted by citation count and parses the HTML.
 */
export async function scrapeScholarProfile(scholarId: string): Promise<ScraperResponse> {
  const url = `${PROFILE_URL}?user=${encodeURIComponent(scholarId)}&sortby=citedby`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unknown network error';
    return {
      success: false,
      error: `Network error while fetching Google Scholar profile: ${message}`,
      errorType: 'NETWORK_ERROR',
    };
  }

  if (response.status === 429) {
    return {
      success: false,
      error: 'Google Scholar rate limit detected (HTTP 429). Please retry later.',
      errorType: 'RATE_LIMITED',
    };
  }

  if (!response.ok) {
    return {
      success: false,
      error: `Failed to fetch Google Scholar profile (HTTP ${response.status}).`,
      errorType: 'NETWORK_ERROR',
    };
  }

  const html = await response.text();
  return parseScholarHTML(html);
}
