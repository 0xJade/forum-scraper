import { NextRequest, NextResponse } from 'next/server';
import { ForumResponse, Topic, TopicStatistics } from '@/types/topic';
import { getDAOByBaseUrl } from '@/config/daos';

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
 * GET /api/topics
 * Fetches topics from the forum API and returns minimal topic data
 * Query params:
 *   - forumBaseUrl (required): Base URL of the forum (e.g., https://forum.ssv.network)
 *   - days (optional): Number of days to look back (default: 7)
 *   - sortOrder (optional): 'asc' or 'desc', defaults to 'desc' (newest first)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const forumBaseUrl = searchParams.get('forumBaseUrl');
    const days = parseInt(searchParams.get('days') || '7', 10);
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Validate forumBaseUrl
    if (!forumBaseUrl) {
      return NextResponse.json(
        { error: 'forumBaseUrl parameter is required' },
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

    // Validate days parameter
    if (isNaN(days) || days < 1 || days > 365) {
      return NextResponse.json(
        { error: 'days parameter must be between 1 and 365' },
        { status: 400 }
      );
    }

    // Check if DAO is configured (optional validation)
    const dao = getDAOByBaseUrl(forumBaseUrl);
    if (!dao) {
      // Allow unlisted forums but log a warning
      console.warn(`Forum ${forumBaseUrl} is not in the configured DAO list`);
    }

    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0); // Start of day

    const apiUrl = `${forumBaseUrl.replace(/\/$/, '')}/latest.json`;
    const response = await fetchWithTimeout(apiUrl);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch topics: ${response.status} ${response.statusText}`,
          forumBaseUrl,
        },
        { status: response.status }
      );
    }

    const data: ForumResponse = await response.json();

    if (!data.topic_list || !Array.isArray(data.topic_list.topics)) {
      return NextResponse.json(
        { error: 'Invalid API response: topics array not found' },
        { status: 500 }
      );
    }

    // Extract topics and filter by date range
    const allTopics: Topic[] = data.topic_list.topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      created_at: topic.created_at,
    }));

    // Filter topics from the last N days
    // Check both created_at and last_posted_at to catch recently active topics
    const filteredTopics = allTopics.filter((topic) => {
      const topicFull = data.topic_list.topics.find((t) => t.id === topic.id);
      if (!topicFull) return false;

      const createdDate = new Date(topicFull.created_at);
      const lastPostedDate = topicFull.last_posted_at
        ? new Date(topicFull.last_posted_at)
        : createdDate;

      // Include if created or last posted within the date range
      return createdDate >= cutoffDate || lastPostedDate >= cutoffDate;
    });

    // Sort by created_at (most recent first by default)
    const sortedTopics = filteredTopics.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // Calculate statistics
    const now = new Date();
    const statistics: TopicStatistics = {
      totalPosts: sortedTopics.length,
      uniqueTopics: sortedTopics.length,
      dateRange: {
        start: cutoffDate.toISOString(),
        end: now.toISOString(),
      },
    };

    return NextResponse.json(
      {
        topics: sortedTopics,
        statistics,
        dao: dao || null,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching topics:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while fetching topics';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

