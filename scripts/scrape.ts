/**
 * 로컬에서 Google Scholar 프로필을 스크래핑하여 data/ 디렉토리에 JSON으로 저장하는 스크립트.
 * 
 * 사용법: npx tsx scripts/scrape.ts <scholar_id>
 * 예시:   npx tsx scripts/scrape.ts -Uiul2AAAAAJ
 */
import { scrapeScholarProfile } from '../lib/scraper';
import type { Paper } from '../lib/types';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

async function scrapeViaSerpApi(scholarId: string, apiKey: string): Promise<Paper[]> {
  const url = new URL('https://serpapi.com/search.json');
  url.search = new URLSearchParams({
    engine: 'google_scholar_author',
    author_id: scholarId,
    num: '100',
    api_key: apiKey,
  }).toString();

  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  const data = await response.json() as {
    error?: string;
    articles?: Array<{
      title?: string;
      authors?: string;
      year?: string;
      link?: string;
      cited_by?: { value?: number };
    }>;
  };

  if (!response.ok || data.error) throw new Error(data.error ?? `HTTP ${response.status}`);
  if (!data.articles?.length) throw new Error('SerpApi returned no articles');

  return data.articles.map((article) => ({
    title: article.title ?? '',
    authors: article.authors ?? '',
    citationCount: article.cited_by?.value ?? 0,
    year: article.year ? Number.parseInt(article.year, 10) : null,
    scholarUrl: article.link ?? '',
  }));
}

async function main() {
  const scholarId = process.argv[2];
  if (!scholarId) {
    console.error('Usage: npx tsx scripts/scrape.ts <scholar_id>');
    process.exit(1);
  }

  console.log(`Scraping scholar profile: ${scholarId}...`);
  let papers: Paper[];

  try {
    const apiKey = process.env.SERPAPI_KEY;
    if (apiKey) {
      papers = await scrapeViaSerpApi(scholarId, apiKey);
    } else {
      const result = await scrapeScholarProfile(scholarId);
      if (!result.success) throw new Error(result.error);
      papers = result.papers;
    }
  } catch (error) {
    console.error(`Scraping failed: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }

  const dataDir = join(process.cwd(), 'data');
  mkdirSync(dataDir, { recursive: true });

  const filePath = join(dataDir, `${scholarId}.json`);
  writeFileSync(filePath, JSON.stringify(papers, null, 2));
  console.log(`Saved ${papers.length} papers to ${filePath}`);
}

main();
