'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Topic, TopicStatistics } from '@/types/topic';
import { fetchTopics, FetchTopicsResponse } from '@/utils/api';
import { DAOConfig } from '@/config/daos';
import TopicItem from './TopicItem';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import SearchBar from './SearchBar';
import StatisticsCard from './StatisticsCard';

interface TopicListProps {
  forumBaseUrl: string;
  dao: DAOConfig | null;
  days?: number;
  onTopicSelect: (topicId: number, forumBaseUrl: string) => void;
}

export default function TopicList({
  forumBaseUrl,
  dao,
  days = 7,
  onTopicSelect,
}: TopicListProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [statistics, setStatistics] = useState<TopicStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadTopics = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setIsRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);
        const data: FetchTopicsResponse = await fetchTopics(forumBaseUrl, days, sortOrder);
        setTopics(data.topics);
        setStatistics(data.statistics);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load topics. Please try again.'
        );
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [forumBaseUrl, days, sortOrder]
  );

  useEffect(() => {
    if (forumBaseUrl) {
      loadTopics();
    }
  }, [forumBaseUrl, days, sortOrder, loadTopics]);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  const handleRefresh = () => {
    loadTopics(true);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Filter topics based on search query
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) {
      return topics;
    }
    const query = searchQuery.toLowerCase();
    return topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(query) ||
        topic.id.toString().includes(query)
    );
  }, [topics, searchQuery]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRefresh} />;
  }

  return (
    <div className="w-full">
      {statistics && (
        <div className="mb-6">
          <StatisticsCard statistics={statistics} daoName={dao?.displayName} />
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Posts from the Last {days} Days
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {filteredTopics.length} of {topics.length} topic
            {topics.length !== 1 ? 's' : ''} shown
            {searchQuery && ` (filtered by "${searchQuery}")`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleSortOrder}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label={`Sort ${sortOrder === 'asc' ? 'newest first' : 'oldest first'}`}
          >
            {sortOrder === 'asc' ? '↑ Oldest First' : '↓ Newest First'}
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-600"
            aria-label="Refresh topics"
          >
            {isRefreshing ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Refreshing...
              </span>
            ) : (
              'Refresh'
            )}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {filteredTopics.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery
              ? `No topics found matching "${searchQuery}".`
              : 'No topics found.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTopics.map((topic) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              onClick={(topicId) => onTopicSelect(topicId, forumBaseUrl)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

