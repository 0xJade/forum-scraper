import { Topic, TopicDetailsResponse, TopicStatistics } from '@/types/topic';
import { DAOConfig } from '@/config/daos';
import { SummaryRequest, AISummary } from '@/types/ai-summary';

/**
 * Client-side API utility functions
 * These functions call our Next.js API routes, which proxy requests to the external API
 * This avoids CORS issues by making server-side requests
 */

export interface FetchTopicsResponse {
  topics: Topic[];
  statistics: TopicStatistics;
  dao: DAOConfig | null;
}

/**
 * Fetches topics from the forum API via our Next.js API route
 * @param forumBaseUrl - Base URL of the forum (e.g., https://forum.ssv.network)
 * @param days - Number of days to look back (default: 7)
 * @param sortOrder - Sort order: 'asc' or 'desc' (default: 'desc' - newest first)
 */
export async function fetchTopics(
  forumBaseUrl: string,
  days: number = 7,
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<FetchTopicsResponse> {
  try {
    const params = new URLSearchParams({
      forumBaseUrl,
      days: days.toString(),
      sortOrder,
    });

    const response = await fetch(`/api/topics?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to fetch topics: ${response.status} ${response.statusText}`
      );
    }

    const data: FetchTopicsResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching topics');
  }
}

/**
 * Fetches detailed topic information by topic ID via our Next.js API route
 * @param topicId - Topic ID to fetch
 * @param forumBaseUrl - Base URL of the forum (optional, defaults to first DAO)
 */
export async function fetchTopicDetails(
  topicId: number,
  forumBaseUrl?: string
): Promise<TopicDetailsResponse> {
  try {
    const params = new URLSearchParams();
    if (forumBaseUrl) {
      params.set('forumBaseUrl', forumBaseUrl);
    }

    const url = `/api/topics/${topicId}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 404) {
        throw new Error(errorData.error || `Topic with ID ${topicId} not found`);
      }
      throw new Error(
        errorData.error ||
          `Failed to fetch topic details: ${response.status} ${response.statusText}`
      );
    }

    const data: TopicDetailsResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching topic details');
  }
}

/**
 * Generate AI summary from posts
 * @param request - Summary request with posts and DAO information
 */
export async function generateSummary(request: SummaryRequest): Promise<AISummary> {
  try {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to generate summary: ${response.status} ${response.statusText}`
      );
    }

    const data: AISummary = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while generating summary');
  }
}

