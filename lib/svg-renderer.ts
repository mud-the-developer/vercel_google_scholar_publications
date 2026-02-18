import { Paper } from './types';
import { DARK_THEME, LIGHT_THEME, ThemeColors } from './themes';

export interface SVGRenderOptions {
  maxPapers: number;
}

const DEFAULT_OPTIONS: SVGRenderOptions = {
  maxPapers: 5,
};

const HEADER_HEIGHT = 40;
const ROW_HEIGHT = 64;
const PADDING_X = 16;
const WIDTH = 720;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncateTitle(title: string, maxChars: number = 65): string {
  if (title.length <= maxChars) return title;
  return title.slice(0, maxChars - 1) + '…';
}

function truncateAuthors(authors: string, maxChars: number = 80): string {
  if (authors.length <= maxChars) return authors;
  return authors.slice(0, maxChars - 1) + '…';
}

function buildThemeRules(colors: ThemeColors): string {
  return `
  .badge-surface { fill: ${colors.bg}; }
  .badge-border { stroke: ${colors.border}; }
  .badge-header-bg { fill: ${colors.headerBg}; }
  .badge-header-title { fill: ${colors.headerTitle}; }
  .badge-header-sub { fill: ${colors.headerSub}; }
  .paper-divider { stroke: ${colors.divider}; }
  .paper-title { fill: ${colors.title}; }
  .paper-authors { fill: ${colors.authors}; }
  .paper-year { fill: ${colors.yearText}; }
  .paper-citation-badge { fill: ${colors.citationBadge}; }
  .paper-citation-text { fill: ${colors.citationText}; }`;
}

function renderThemeStyles(): string {
  const lightRules = buildThemeRules(LIGHT_THEME);
  const darkRules = buildThemeRules(DARK_THEME);

  return `<style>
${lightRules}
  @media (prefers-color-scheme: dark) {${darkRules}
  }
</style>`;
}

function renderPaperRow(paper: Paper, index: number): string {
  const y = HEADER_HEIGHT + index * ROW_HEIGHT;
  const titleY = y + 18;
  const authorsY = y + 34;
  const yearY = y + 48;
  const displayTitle = escapeXml(truncateTitle(paper.title));
  const displayAuthors = escapeXml(truncateAuthors(paper.authors));
  const yearStr = paper.year !== null ? String(paper.year) : 'N/A';
  const citationStr = String(paper.citationCount);

  const badgeWidth = Math.max(30, citationStr.length * 9 + 12);
  const badgeX = WIDTH - PADDING_X - badgeWidth;
  const badgeY = y + (ROW_HEIGHT - 22) / 2;
  const badgeCenterX = badgeX + badgeWidth / 2;

  const dividerLine =
    index > 0
      ? `<line x1="${PADDING_X}" y1="${y}" x2="${WIDTH - PADDING_X}" y2="${y}" class="paper-divider" stroke-width="1"/>`
      : '';

  return `${dividerLine}
    <text x="${PADDING_X}" y="${titleY}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="13" class="paper-title" font-weight="600">${displayTitle}</text>
    <text x="${PADDING_X}" y="${authorsY}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="11" class="paper-authors">${displayAuthors}</text>
    <text x="${PADDING_X}" y="${yearY}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="11" class="paper-year">${escapeXml(yearStr)}</text>
    <rect x="${badgeX}" y="${badgeY}" width="${badgeWidth}" height="22" rx="11" class="paper-citation-badge"/>
    <text x="${badgeCenterX}" y="${badgeY + 15}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="11" class="paper-citation-text" text-anchor="middle" font-weight="600">${escapeXml(citationStr)}</text>`;
}

export function renderSVG(
  papers: Paper[],
  options?: Partial<SVGRenderOptions>
): string {
  const opts: SVGRenderOptions = { ...DEFAULT_OPTIONS, ...options };
  const displayPapers = papers.slice(0, opts.maxPapers);
  const contentHeight = HEADER_HEIGHT + displayPapers.length * ROW_HEIGHT;
  const totalHeight = Math.max(contentHeight + 8, HEADER_HEIGHT + 8);

  const rows = displayPapers
    .map((paper, i) => renderPaperRow(paper, i))
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${totalHeight}" viewBox="0 0 ${WIDTH} ${totalHeight}">
  ${renderThemeStyles()}
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${totalHeight - 1}" rx="6" class="badge-surface badge-border" stroke-width="1"/>
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEADER_HEIGHT}" rx="6" class="badge-header-bg badge-border" stroke-width="1"/>
  <rect x="0.5" y="20" width="${WIDTH - 1}" height="${HEADER_HEIGHT - 19}" class="badge-header-bg"/>
  <line x1="0.5" y1="${HEADER_HEIGHT}" x2="${WIDTH - 0.5}" y2="${HEADER_HEIGHT}" class="badge-border" stroke-width="1"/>
  <text x="${PADDING_X}" y="26" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="14" class="badge-header-title" font-weight="700">Publications</text>
  <text x="${WIDTH - PADDING_X}" y="26" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="12" class="badge-header-sub" font-weight="600" text-anchor="end">Cites</text>
${rows}
</svg>`;
}
