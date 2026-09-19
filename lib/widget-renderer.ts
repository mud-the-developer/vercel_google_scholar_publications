import { Paper } from './types';
import { ThemeColors, getTheme } from './themes';

export interface WidgetRenderOptions {
  maxPapers: number;
  theme?: string;
  width?: string;
  height?: string;
  style?: string;
  accent?: string;
}

const DEFAULT_OPTIONS: WidgetRenderOptions = {
  maxPapers: 5,
  theme: 'auto',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function themeToVars(colors: ThemeColors): string {
  return `--w-bg:${colors.bg};--w-border:${colors.border};--w-title:${colors.title};--w-authors:${colors.authors};--w-badge:${colors.citationBadge};--w-badge-text:${colors.citationText};--w-year:${colors.yearText};--w-divider:${colors.divider};--w-header:${colors.headerTitle};--w-header-sub:${colors.headerSub};`;
}

function normalizeAccent(value?: string): string {
  const hex = value?.match(/^#?([0-9a-f]{6})$/i)?.[1];
  return hex ? `#${hex}` : '#d946ef';
}

function formatCitationMonth(value?: string): string {
  if (!value) return '';
  const [year, month] = value.split('-').map(Number);
  const name = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'][month - 1];
  return name && year ? `${name} ${year}` : '';
}

function renderPaperCard(paper: Paper): string {
  const yearStr = paper.year !== null ? String(paper.year) : 'N/A';

  return `      <div class="paper-card">
        <div class="paper-header">
          <a class="paper-title" href="${escapeHtml(paper.scholarUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(paper.title)}</a>
          <span class="citation-badge">${escapeHtml(String(paper.citationCount))}</span>
        </div>
        <div class="paper-authors">${escapeHtml(paper.authors)}</div>
        <div class="paper-meta">
          <span class="paper-year">${escapeHtml(yearStr)}</span>
          <a class="scholar-link" href="${escapeHtml(paper.scholarUrl)}" target="_blank" rel="noopener noreferrer">View paper →</a>
        </div>
      </div>`;
}

function renderPortfolioCard(paper: Paper): string {
  const publication = [paper.venue, paper.year].filter(Boolean).join(' ');
  const details = [publication, paper.role].filter(Boolean).join(' · ');
  const citations = `${paper.citationCount} citation${paper.citationCount === 1 ? '' : 's'}`;

  return `      <article class="portfolio-card">
        <a class="portfolio-title" href="${escapeHtml(paper.scholarUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(paper.title)}</a>
        <div class="portfolio-details">${escapeHtml(details)}</div>
        <div class="portfolio-footer">
          <span>${escapeHtml(citations)}</span>
          <a href="${escapeHtml(paper.scholarUrl)}" target="_blank" rel="noopener noreferrer">View paper →</a>
        </div>
      </article>`;
}

export function renderWidget(
  papers: Paper[],
  options?: Partial<WidgetRenderOptions>
): string {
  const opts: WidgetRenderOptions = { ...DEFAULT_OPTIONS, ...options };
  const displayPapers = papers.slice(0, opts.maxPapers);
  const isPortfolio = opts.style === 'portfolio';
  const cards = displayPapers
    .map((paper) => isPortfolio ? renderPortfolioCard(paper) : renderPaperCard(paper))
    .join('\n');

  const widthStyle = opts.width ? `width: ${opts.width};` : 'width: 100%;max-width: 720px;';
  const heightStyle = opts.height ? `height: ${opts.height}; overflow-y: auto;` : '';

  const isAuto = !opts.theme || opts.theme === 'auto';
  const light = getTheme('light');
  const dark = getTheme('dark');

  let themeStyle: string;
  if (isAuto) {
    themeStyle = `:root{${themeToVars(light)}} @media(prefers-color-scheme:dark){:root{${themeToVars(dark)}}}`;
  } else {
    const fixed = getTheme(opts.theme ?? 'light');
    themeStyle = `:root{${themeToVars(fixed)}}`;
  }
  themeStyle += `:root{--w-accent:${normalizeAccent(opts.accent)}}`;

  const updated = formatCitationMonth(displayPapers[0]?.citationUpdatedAt);
  const citationDate = updated ? ` · ${updated}` : '';
  const header = isPortfolio
    ? `<div class="widget-header portfolio-heading"><span>Selected Publications</span><span class="cites-label">Citations${citationDate}</span></div>`
    : `<div class="widget-header"><span>Publications</span><span class="cites-label">Cites</span></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Publications</title>
  <style>
    ${themeStyle}
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      background: var(--w-bg);
      color: var(--w-title);
      padding: 16px;
      line-height: 1.5;
    }
    .widget-container { ${widthStyle} ${heightStyle} margin: 0 auto; }
    .widget-header {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 16px; font-weight: 700; color: var(--w-header);
      margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--w-border);
    }
    .widget-header .cites-label { font-size: 12px; font-weight: 600; color: var(--w-header-sub); }
    .paper-card { padding: 12px 0; border-bottom: 1px solid var(--w-divider); }
    .paper-card:last-child { border-bottom: none; }
    .paper-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
    .paper-title {
      font-size: 14px; font-weight: 600; color: var(--w-badge);
      text-decoration: none; flex: 1; overflow-wrap: break-word; word-break: break-word;
    }
    .paper-title:hover { text-decoration: underline; }
    .citation-badge {
      background: var(--w-badge); color: var(--w-badge-text);
      font-size: 12px; font-weight: 600; padding: 2px 10px;
      border-radius: 12px; white-space: nowrap; flex-shrink: 0;
    }
    .paper-authors { font-size: 12px; color: var(--w-authors); margin-top: 4px; overflow-wrap: break-word; word-break: break-word; }
    .paper-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 11px; }
    .paper-year { color: var(--w-year); }
    .scholar-link { color: var(--w-badge); text-decoration: none; font-size: 11px; }
    .scholar-link:hover { text-decoration: underline; }
    .portfolio-heading { border-color: var(--w-accent); }
    .portfolio-card { padding: 14px 0; border-bottom: 1px solid var(--w-divider); }
    .portfolio-card:last-child { border-bottom: none; }
    .portfolio-title {
      display: block; color: var(--w-title); font-size: 15px; font-weight: 700;
      line-height: 1.4; text-decoration: none; white-space: normal; overflow: visible;
    }
    .portfolio-title:hover { color: var(--w-accent); }
    .portfolio-details { margin-top: 6px; color: var(--w-accent); font-size: 12px; font-weight: 600; }
    .portfolio-footer { display: flex; justify-content: space-between; margin-top: 7px; color: var(--w-authors); font-size: 11px; }
    .portfolio-footer a { color: var(--w-authors); text-decoration: none; }
    .portfolio-footer a:hover { color: var(--w-accent); }
    @media (max-width: 480px) {
      body { padding: 12px; }
      .paper-header { flex-direction: column; gap: 4px; }
      .citation-badge { align-self: flex-start; }
    }
  </style>
</head>
<body>
  <div class="widget-container">
    ${header}
${cards}
  </div>
</body>
</html>`;
}
