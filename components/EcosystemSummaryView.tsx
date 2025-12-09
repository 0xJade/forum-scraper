'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { DAOConfig } from '@/config/daos';
import { PostForAnalysis } from '@/types/ai-summary';
import { AISummary } from '@/types/ai-summary';
import { CategoryType, CATEGORIES } from '@/types/category';
import { fetchTopics } from '@/utils/api';
import { fetchTopicDetails } from '@/utils/api';
import { generateSummary } from '@/utils/api';
import { convertTopicDetailsToPosts } from '@/utils/post-processing';
import { getDefaultDays } from '@/config/daos';
import SummaryGenerator from './SummaryGenerator';
import AISummaryCard from './AISummaryCard';
import CategoryFilter from './CategoryFilter';
import CategorizedPostList from './CategorizedPostList';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface EcosystemSummaryViewProps {
  selectedDAOs: DAOConfig[];
  onBack: () => void;
  onPostClick?: (post: PostForAnalysis) => void;
}

interface DAOSummary {
  dao: DAOConfig;
  posts: PostForAnalysis[];
  summary: AISummary | null;
  loading: boolean;
  error: string | null;
}

export default function EcosystemSummaryView({
  selectedDAOs,
  onBack,
  onPostClick,
}: EcosystemSummaryViewProps) {
  const [allPosts, setAllPosts] = useState<PostForAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [daoSummaries, setDaoSummaries] = useState<Map<string, DAOSummary>>(new Map());
  const [generatingSummaries, setGeneratingSummaries] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(
    CATEGORIES.map((cat) => cat.id)
  );

  // Fetch posts from all selected DAOs
  useEffect(() => {
    const loadAllPosts = async () => {
      if (selectedDAOs.length === 0) {
        setAllPosts([]);
        setDaoSummaries(new Map());
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const allPosts: PostForAnalysis[] = [];
        const days = getDefaultDays();

        // Fetch topics from each DAO
        for (const dao of selectedDAOs) {
          try {
            const topicsData = await fetchTopics(dao.baseUrl, days, 'desc');
            
            // Fetch details for each topic (limit to first 10 topics per DAO to avoid too many requests)
            const topicsToFetch = topicsData.topics.slice(0, 10);
            
            for (const topic of topicsToFetch) {
              try {
                const topicDetails = await fetchTopicDetails(topic.id, dao.baseUrl);
                const topicPosts = convertTopicDetailsToPosts(topicDetails, dao.displayName, dao.baseUrl);
                allPosts.push(...topicPosts);
              } catch (err) {
                console.warn(`Failed to fetch topic ${topic.id} from ${dao.displayName}:`, err);
                // Continue with other topics
              }
            }
          } catch (err) {
            console.warn(`Failed to fetch topics from ${dao.displayName}:`, err);
            // Continue with other DAOs
          }
        }

        setAllPosts(allPosts);
        
        // Initialize DAO summaries map
        const initialSummaries = new Map<string, DAOSummary>();
        selectedDAOs.forEach((dao) => {
          const daoPosts = allPosts.filter((post) => post.dao === dao.displayName);
          initialSummaries.set(dao.id, {
            dao,
            posts: daoPosts,
            summary: null,
            loading: false,
            error: null,
          });
        });
        setDaoSummaries(initialSummaries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    loadAllPosts();
  }, [selectedDAOs]);

  const handleGenerateSummary = useCallback(async () => {
    if (allPosts.length === 0) return;

    try {
      setGeneratingSummaries(true);
      setSummaryError(null);

      const dateRange = {
        start: new Date(Date.now() - getDefaultDays() * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      };

      // Generate summary for each DAO separately
      const summaryPromises = Array.from(daoSummaries.values()).map(async (daoSummary) => {
        if (daoSummary.posts.length === 0) {
          // No posts for this DAO, skip
          return { daoId: daoSummary.dao.id, summary: null, error: null };
        }

        try {
          // Update loading state for this DAO
          setDaoSummaries((prev) => {
            const updated = new Map(prev);
            const existing = updated.get(daoSummary.dao.id);
            if (existing) {
              updated.set(daoSummary.dao.id, { ...existing, loading: true, error: null });
            }
            return updated;
          });

          const summary = await generateSummary({
            posts: daoSummary.posts,
            daos: [daoSummary.dao.displayName],
            dateRange,
          });

          return { daoId: daoSummary.dao.id, summary, error: null };
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Failed to generate summary';
          return { daoId: daoSummary.dao.id, summary: null, error: errorMsg };
        }
      });

      const results = await Promise.all(summaryPromises);

      // Update summaries with results
      setDaoSummaries((prev) => {
        const updated = new Map(prev);
        results.forEach(({ daoId, summary, error }) => {
          const existing = updated.get(daoId);
          if (existing) {
            updated.set(daoId, {
              ...existing,
              summary,
              loading: false,
              error: error || null,
            });
          }
        });
        return updated;
      });

      // Auto-select all categories that have posts across all DAOs
      const allCategoriesWithPosts = new Set<CategoryType>();
      results.forEach(({ summary }) => {
        if (summary) {
          summary.categories
            .filter((cat) => cat.posts.length > 0)
            .forEach((cat) => allCategoriesWithPosts.add(cat.category));
        }
      });
      setSelectedCategories(Array.from(allCategoriesWithPosts));
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : 'Failed to generate summaries');
    } finally {
      setGeneratingSummaries(false);
    }
  }, [allPosts, daoSummaries]);

  // Calculate category counts across all DAO summaries
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryType, number> = {
      governance: 0,
      technical: 0,
      community: 0,
      partnerships: 0,
      education: 0,
      announcements: 0,
      support: 0,
      meta: 0,
    };

    daoSummaries.forEach((daoSummary) => {
      if (daoSummary.summary) {
        daoSummary.summary.categories.forEach((cat) => {
          counts[cat.category] += cat.count;
        });
      }
    });

    return counts;
  }, [daoSummaries]);

  // Check if any summaries have been generated
  const hasAnySummary = Array.from(daoSummaries.values()).some((s) => s.summary !== null);
  const isGeneratingAny = Array.from(daoSummaries.values()).some((s) => s.loading);

  const handleToggleCategory = (category: CategoryType) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      }
      return [...prev, category];
    });
  };

  if (loading) {
    return (
      <div className="w-full">
        <LoadingSpinner />
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Loading posts from {selectedDAOs.length} DAO{selectedDAOs.length !== 1 ? 's' : ''}...
        </p>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            DAO Analysis
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {selectedDAOs.length} DAO{selectedDAOs.length !== 1 ? 's' : ''} selected • {allPosts.length}{' '}
            post{allPosts.length !== 1 ? 's' : ''} loaded
          </p>
        </div>
        <button
          onClick={onBack}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Back to Selection
        </button>
      </div>

      {/* Summary Generator */}
      {!hasAnySummary && (
        <SummaryGenerator
          onGenerate={handleGenerateSummary}
          isGenerating={generatingSummaries}
          postCount={allPosts.length}
        />
      )}

      {/* Summary Error */}
      {summaryError && (
        <ErrorMessage
          message={summaryError}
          onRetry={handleGenerateSummary}
        />
      )}

      {/* DAO Summaries - Display each DAO's summary separately */}
      {hasAnySummary && (
        <>
          {/* Category Filter - Global across all DAOs */}
          <CategoryFilter
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            categoryCounts={categoryCounts}
          />

          {/* Individual DAO Summary Sections */}
          <div className="space-y-8">
            {Array.from(daoSummaries.values()).map((daoSummary) => {
              if (!daoSummary.summary && !daoSummary.loading && daoSummary.error === null) {
                // Skip DAOs with no posts
                if (daoSummary.posts.length === 0) return null;
              }

              return (
                <div
                  key={daoSummary.dao.id}
                  className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  {/* DAO Header */}
                  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {daoSummary.dao.displayName}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {daoSummary.posts.length} post{daoSummary.posts.length !== 1 ? 's' : ''}
                          {daoSummary.dao.description && ` • ${daoSummary.dao.description}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DAO Content */}
                  <div className="p-6">
                    {daoSummary.loading && (
                      <div className="py-8 text-center">
                        <LoadingSpinner />
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                          Generating summary for {daoSummary.dao.displayName}...
                        </p>
                      </div>
                    )}

                    {daoSummary.error && (
                      <ErrorMessage
                        message={`Failed to generate summary for ${daoSummary.dao.displayName}: ${daoSummary.error}`}
                        onRetry={handleGenerateSummary}
                      />
                    )}

                    {daoSummary.summary && (
                      <div className="space-y-6">
                        <AISummaryCard summary={daoSummary.summary} />

                        <CategorizedPostList
                          categories={daoSummary.summary.categories}
                          selectedCategories={selectedCategories}
                          onPostClick={onPostClick}
                        />
                      </div>
                    )}

                    {!daoSummary.summary && !daoSummary.loading && daoSummary.error === null && daoSummary.posts.length === 0 && (
                      <div className="py-8 text-center text-sm text-gray-600 dark:text-gray-400">
                        No posts found for {daoSummary.dao.displayName}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Regenerate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerateSummary}
              disabled={generatingSummaries || isGeneratingAny}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Regenerate All Summaries
            </button>
          </div>
        </>
      )}

      {/* No Posts Message */}
      {allPosts.length === 0 && !loading && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            No posts found for the selected DAOs. Try selecting different DAOs or adjusting the time range.
          </p>
        </div>
      )}
    </div>
  );
}

