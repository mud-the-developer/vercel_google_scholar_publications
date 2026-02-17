import { renderSVG } from './lib/svg-renderer';
import { Paper } from './lib/types';

const papers: Paper[] = [
  { title: 'Test Paper One', authors: 'Author A', citationCount: 100, year: 2023, scholarUrl: 'https://scholar.google.com/1' },
  { title: 'Paper Two', authors: 'Author B', citationCount: 50, year: null, scholarUrl: 'https://scholar.google.com/2' },
];

const svg = renderSVG(papers);
console.log('Starts with <svg:', svg.startsWith('<svg'));
console.log('Ends with </svg>:', svg.trimEnd().endsWith('</svg>'));
console.log('Contains title:', svg.includes('Test Paper One'));
console.log('Contains citation 100:', svg.includes('100'));
console.log('Contains year 2023:', svg.includes('2023'));
console.log('Contains N/A:', svg.includes('N/A'));

const emptySvg = renderSVG([]);
console.log('Empty starts with <svg:', emptySvg.startsWith('<svg'));
console.log('Empty ends with </svg>:', emptySvg.trimEnd().endsWith('</svg>'));

const limited = renderSVG(papers, { maxPapers: 1 });
console.log('Limited has first paper:', limited.includes('Test Paper One'));
console.log('Limited excludes second:', !limited.includes('Paper Two'));

const overCount = renderSVG(papers, { maxPapers: 10 });
console.log('Over count has both:', overCount.includes('Test Paper One') && overCount.includes('Paper Two'));

// Test XML escaping
const specialPaper: Paper[] = [
  { title: 'A <b>bold</b> & "quoted" paper', authors: 'Auth', citationCount: 5, year: 2020, scholarUrl: 'https://example.com' },
];
const specialSvg = renderSVG(specialPaper);
console.log('Escapes XML entities:', !specialSvg.includes('<b>') && specialSvg.includes('&amp;'));
