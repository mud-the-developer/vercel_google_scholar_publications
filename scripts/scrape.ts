/**
 * 로컬에서 Google Scholar 프로필을 스크래핑하여 data/ 디렉토리에 JSON으로 저장하는 스크립트.
 * 
 * 사용법: npx tsx scripts/scrape.ts <scholar_id>
 * 예시:   npx tsx scripts/scrape.ts -Uiul2AAAAAJ
 */
import { scrapeScholarProfile } from '../lib/scraper';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

async function main() {
  const scholarId = process.argv[2];
  if (!scholarId) {
    console.error('Usage: npx tsx scripts/scrape.ts <scholar_id>');
    process.exit(1);
  }

  console.log(`Scraping scholar profile: ${scholarId}...`);
  const result = await scrapeScholarProfile(scholarId);

  if (!result.success) {
    console.error(`Scraping failed: ${result.error}`);
    process.exit(1);
  }

  const dataDir = join(process.cwd(), 'data');
  mkdirSync(dataDir, { recursive: true });

  const filePath = join(dataDir, `${scholarId}.json`);
  writeFileSync(filePath, JSON.stringify(result.papers, null, 2));
  console.log(`Saved ${result.papers.length} papers to ${filePath}`);
}

main();
