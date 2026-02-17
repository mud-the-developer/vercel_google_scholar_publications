import { NextRequest } from 'next/server';
import { CitationCache } from '../../../lib/cache';
import { scrapeScholarProfile } from '../../../lib/scraper';
import { renderWidget } from '../../../lib/widget-renderer';

const cache = new CitationCache();

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl;
  const scholarId = searchParams.get('scholar_id');

  if (!scholarId) {
    return Response.json(
      { error: 'scholar_id parameter is required' },
      { status: 400 }
    );
  }

  const count = Math.max(1, parseInt(searchParams.get('count') ?? '5', 10) || 5);

  try {
    let papers = cache.get(scholarId);

    if (!papers) {
      const result = await scrapeScholarProfile(scholarId);

      if (!result.success) {
        const { errorType, error: errorMessage } = result;
        const statusMap: Record<string, number> = {
          INVALID_PROFILE: 400,
          RATE_LIMITED: 503,
          NETWORK_ERROR: 502,
          PARSE_ERROR: 500,
        };
        const status = statusMap[errorType] ?? 500;

        return Response.json(
          { error: status >= 500 ? 'Internal server error' : errorMessage },
          { status }
        );
      }

      papers = result.papers;
      cache.set(scholarId, papers);
    }

    const html = renderWidget(papers, { maxPapers: count });

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
