import { Paper } from './types';
import { ThemeColors, getTheme } from './themes';

export interface WidgetRenderOptions {
  maxPapers: number;
  theme?: string;
  width?: string;
  height?: string;
}

const DEFAULT_OPTIONS: WidgetRenderOptions = {
  maxPapers: 5,
  theme: 'light',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderPaperCard(paper: Paper, colors: ThemeColors): string {
  const yearStr = paper.year !== null ? String(paper.year) : 'N/A';

  return `      <div class="paper-card">
        <div class="paper-header">
          <a class="paper-title" href="${escapeHtml(paper.scholarUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(paper.title)}</a>
          <span class="citation-badge">${escapeHtml(String(paper.citationCount))}</span>
        </div>
        <div class="paper-authors">${escapeHtml(paper.authors)}</div>
        <div class="paper-meta">
          <span class="paper-year">${escapeHtml(yearStr)}</span>
          <a class="scholar-link" href="${escapeHtml(paper.scholarUrl)}" target="_blank" rel="noopener noreferrer">View on Google Scholar →</a>
        </div>
      </div>`;
}

export function renderWidget(
  papers: Paper[],
  options?: Partial<WidgetRenderOptions>
): string {
  const opts: WidgetRenderOptions = { ...DEFAULT_OPTIONS, ...options };
  const colors = getTheme(opts.theme ?? 'light');
  const displayPapers = papers.slice(0, opts.maxPapers);
  const cards = displayPapers.map((p) => renderPaperCard(p, colors)).join('\n');

  const widthStyle = opts.width ? `width: ${opts.width};` : 'max-width: 720px;';
  const heightStyle = opts.height ? `height: ${opts.height}; overflow-y: auto;` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Publications</title>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      background: ${colors.bg};
      color: ${colors.title};
      padding: 16px;
      line-height: 1.5;
    }
    .widget-container {
      ${widthStyle}
      ${heightStyle}
      margin: 0 auto;
    }
    .widget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 700;
      color: ${colors.headerTitle};
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid ${colors.border};
    }
    .widget-header .cites-label {
      font-size: 12px;
      font-weight: 600;
      color: ${colors.headerSub};
    }
    .paper-card {
      padding: 12px 0;
      border-bottom: 1px solid ${colors.divider};
    }
    .paper-card:last-child {
      border-bottom: none;
    }
    .paper-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }
    .paper-title {
      font-size: 14px;
      font-weight: 600;
      color: ${colors.citationBadge};
      text-decoration: none;
      flex: 1;
      overflow-wrap: break-word;
      word-break: break-word;
    }
    .paper-title:hover {
      text-decoration: underline;
    }
    .citation-badge {
      background: ${colors.citationBadge};
      color: ${colors.citationText};
      font-size: 12px;
      font-weight: 600;
      padding: 2px 10px;
      border-radius: 12px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .paper-authors {
      font-size: 12px;
      color: ${colors.authors};
      margin-top: 4px;
      overflow-wrap: break-word;
      word-break: break-word;
    }
    .paper-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 6px;
      font-size: 11px;
    }
    .paper-year {
      color: ${colors.yearText};
    }
    .scholar-link {
      color: ${colors.citationBadge};
      text-decoration: none;
      font-size: 11px;
    }
    .scholar-link:hover {
      text-decoration: underline;
    }
    @media (max-width: 480px) {
      body { padding: 12px; }
      .paper-header { flex-direction: column; gap: 4px; }
      .citation-badge { align-self: flex-start; }
    }
  </style>
</head>
<body>
  <div class="widget-container">
    <div class="widget-header">
      <span>Publications</span>
      <span class="cites-label">Cites</span>
    </div>
${cards}
  </div>
</body>
</html>`;
}
