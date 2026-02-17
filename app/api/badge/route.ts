import { NextRequest } from 'next/server';
import { CitationCache } from '../../../lib/cache';
import { scrapeScholarProfile } from '../../../lib/scraper';
import { renderSVG } from '../../../lib/svg-renderer';

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
  const theme = searchParams.get('theme') ?? 'light';

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
          { error: errorMessage, errorType },
          { status }
        );
      }

      papers = result.papers;
      cache.set(scholarId, papers);
    }

    const svg = renderSVG(papers, { maxPapers: count, theme });

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
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
