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

export default function EcosystemSummaryView({
  selectedDAOs,
  onBack,
  onPostClick,
}: EcosystemSummaryViewProps) {
  const [posts, setPosts] = useState<PostForAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(
    CATEGORIES.map((cat) => cat.id)
  );

  // Fetch posts from all selected DAOs
  useEffect(() => {
    const loadAllPosts = async () => {
      if (selectedDAOs.length === 0) {
        setPosts([]);
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

        setPosts(allPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    loadAllPosts();
  }, [selectedDAOs]);

  const handleGenerateSummary = useCallback(async () => {
    if (posts.length === 0) return;

    try {
      setGeneratingSummary(true);
      setSummaryError(null);

      const daoNames = selectedDAOs.map((dao) => dao.displayName);
      const dateRange = {
        start: new Date(Date.now() - getDefaultDays() * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      };

      const summary = await generateSummary({
        posts,
        daos: daoNames,
        dateRange,
      });

      setAiSummary(summary);
      
      // Auto-select all categories that have posts
      const categoriesWithPosts = summary.categories
        .filter((cat) => cat.posts.length > 0)
        .map((cat) => cat.category);
      setSelectedCategories(categoriesWithPosts);
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setGeneratingSummary(false);
    }
  }, [posts, selectedDAOs]);

  // Calculate category counts from AI summary or posts
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

    if (aiSummary) {
      aiSummary.categories.forEach((cat) => {
        counts[cat.category] = cat.count;
      });
    }

    return counts;
  }, [aiSummary]);

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
            Multi-DAO Ecosystem Analysis
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {selectedDAOs.length} DAO{selectedDAOs.length !== 1 ? 's' : ''} selected • {posts.length}{' '}
            post{posts.length !== 1 ? 's' : ''} loaded
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
      {!aiSummary && (
        <SummaryGenerator
          onGenerate={handleGenerateSummary}
          isGenerating={generatingSummary}
          postCount={posts.length}
        />
      )}

      {/* Summary Error */}
      {summaryError && (
        <ErrorMessage
          message={summaryError}
          onRetry={handleGenerateSummary}
        />
      )}

      {/* AI Summary Card */}
      {aiSummary && (
        <>
          <AISummaryCard summary={aiSummary} />

          {/* Category Filter */}
          <CategoryFilter
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            categoryCounts={categoryCounts}
          />

          {/* Categorized Post List */}
          <CategorizedPostList
            categories={aiSummary.categories}
            selectedCategories={selectedCategories}
            onPostClick={onPostClick}
          />

          {/* Regenerate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerateSummary}
              disabled={generatingSummary}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Regenerate Summary
            </button>
          </div>
        </>
      )}

      {/* No Posts Message */}
      {posts.length === 0 && !loading && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            No posts found for the selected DAOs. Try selecting different DAOs or adjusting the time range.
          </p>
        </div>
      )}
    </div>
  );
}

