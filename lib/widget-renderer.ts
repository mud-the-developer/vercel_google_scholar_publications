import { Paper } from './types';

export interface WidgetRenderOptions {
  maxPapers: number;
}

const DEFAULT_OPTIONS: WidgetRenderOptions = {
  maxPapers: 5,
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderPaperCard(paper: Paper): string {
  const yearStr = paper.year !== null ? String(paper.year) : 'N/A';

  return `      <div class="paper-card">
        <div class="paper-header">
          <a class="paper-title" href="${escapeHtml(paper.scholarUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(paper.title)}</a>
          <div class="citation-wrapper">
            <span class="citation-label">Cites</span>
            <span class="citation-badge">${escapeHtml(String(paper.citationCount))}</span>
          </div>
        </div>
        <div class="paper-authors">${escapeHtml(paper.authors)}</div>
        <div class="paper-meta">
          <span class="paper-year">${escapeHtml(yearStr)}</span>
          <a class="scholar-link" href="${escapeHtml(paper.scholarUrl)}" target="_blank" rel="noopener noreferrer">View on Google Scholar</a>
        </div>
      </div>`;
}

export function renderWidget(
  papers: Paper[],
  options?: Partial<WidgetRenderOptions>
): string {
  const opts: WidgetRenderOptions = { ...DEFAULT_OPTIONS, ...options };
  const displayPapers = papers.slice(0, opts.maxPapers);
  const cards = displayPapers.map(renderPaperCard).join('\n');

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
      background: #ffffff;
      color: #24292f;
      padding: 16px;
      line-height: 1.5;
    }
    .widget-container {
      max-width: 600px;
      margin: 0 auto;
    }
    .widget-header {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #d0d7de;
    }
    .paper-card {
      padding: 12px 0;
      border-bottom: 1px solid #d8dee4;
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
      font-size: 15px;
      font-weight: 600;
      color: #0969da;
      text-decoration: none;
      flex: 1;
      overflow-wrap: break-word;
      word-break: break-word;
    }
    .paper-title:hover {
      text-decoration: underline;
    }
    .citation-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      gap: 2px;
    }
    .citation-label {
      font-size: 10px;
      color: #656d76;
      font-weight: 500;
    }
    .citation-badge {
      background: #0969da;
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 12px;
      white-space: nowrap;
    }
    .paper-authors {
      font-size: 13px;
      color: #656d76;
      margin-top: 4px;
      overflow-wrap: break-word;
      word-break: break-word;
    }
    .paper-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 6px;
      font-size: 12px;
    }
    .paper-year {
      color: #656d76;
    }
    .scholar-link {
      color: #0969da;
      text-decoration: none;
      font-size: 12px;
    }
    .scholar-link:hover {
      text-decoration: underline;
    }
    @media (max-width: 480px) {
      body {
        padding: 12px;
      }
      .paper-header {
        flex-direction: column;
        gap: 4px;
      }
      .citation-badge {
        align-self: flex-start;
      }
    }
  </style>
</head>
<body>
  <div class="widget-container">
    <div class="widget-header">📚 Publications</div>
${cards}
  </div>
</body>
</html>`;
}
