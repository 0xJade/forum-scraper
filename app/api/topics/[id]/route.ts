import { NextRequest, NextResponse } from 'next/server';
import { TopicDetailsResponse } from '@/types/topic';
import { DAOS } from '@/config/daos';

const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * Creates a fetch request with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout: The request took too long to complete');
    }
    throw error;
  }
}

/**
 * GET /api/topics/[id]
 * Fetches detailed topic information by topic ID
 * Query params:
 *   - forumBaseUrl (optional): Base URL of the forum. Defaults to first DAO if not provided.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const topicId = parseInt(id, 10);
    const searchParams = request.nextUrl.searchParams;
    const forumBaseUrl =
      searchParams.get('forumBaseUrl') || DAOS[0]?.baseUrl || 'https://forum.tecommons.org';

    if (isNaN(topicId)) {
      return NextResponse.json(
        { error: 'Invalid topic ID' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(forumBaseUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid forumBaseUrl format' },
        { status: 400 }
      );
    }

    const apiUrl = `${forumBaseUrl.replace(/\/$/, '')}/t/${topicId}.json`;
    const response = await fetchWithTimeout(apiUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: `Topic with ID ${topicId} not found` },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          error: `Failed to fetch topic details: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data: TopicDetailsResponse = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching topic details:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while fetching topic details';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

