import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Paper } from './types';

/**
 * data/ 디렉토리에서 미리 스크래핑된 JSON 파일을 읽어 Paper 배열을 반환한다.
 * 파일이 없으면 null을 반환한다.
 */
export function loadFallbackData(scholarId: string): Paper[] | null {
  const filePath = join(process.cwd(), 'data', `${scholarId}.json`);
  if (!existsSync(filePath)) return null;

  try {
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as Paper[];
  } catch {
    return null;
  }
}
