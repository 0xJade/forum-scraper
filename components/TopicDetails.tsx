'use client';

import { useState, useEffect } from 'react';
import { TopicDetailsResponse, Post } from '@/types/topic';
import { fetchTopicDetails } from '@/utils/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import DateFormatter from './DateFormatter';

interface TopicDetailsProps {
  topicId: number;
  forumBaseUrl?: string;
  onBack: () => void;
}

export default function TopicDetails({
  topicId,
  forumBaseUrl,
  onBack,
}: TopicDetailsProps) {
  const [topicDetails, setTopicDetails] = useState<TopicDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTopicDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await fetchTopicDetails(topicId, forumBaseUrl);
        setTopicDetails(details);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load topic details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadTopicDetails();
  }, [topicId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div>
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to topics
        </button>
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!topicDetails) {
    return null;
  }

  const posts: Post[] = topicDetails.post_stream?.posts || [];

  return (
    <div className="w-full">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        aria-label="Back to topics list"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to topics
      </button>

      <article className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <header className="mb-6">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {topicDetails.fancy_title || topicDetails.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-mono">#{topicDetails.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <DateFormatter dateString={topicDetails.created_at} format="full" />
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {topicDetails.views} views
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {topicDetails.posts_count} post{topicDetails.posts_count !== 1 ? 's' : ''}
            </div>
            {topicDetails.like_count > 0 && (
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {topicDetails.like_count} like{topicDetails.like_count !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          {topicDetails.tags && topicDetails.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {topicDetails.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {post.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {post.name || post.username || 'Anonymous'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <DateFormatter dateString={post.created_at} format="relative" />
                    {post.post_number > 1 && ` • Post #${post.post_number}`}
                  </div>
                </div>
              </div>
              <div
                className="prose prose-sm max-w-none text-gray-700 dark:prose-invert dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: post.cooked }}
              />
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

