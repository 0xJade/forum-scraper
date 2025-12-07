'use client';

import { useState } from 'react';
import { CategorySummary, PostForAnalysis } from '@/types/ai-summary';
import { CategoryType } from '@/types/category';
import CategoryBadge from './CategoryBadge';
import DateFormatter from './DateFormatter';

interface CategorizedPostListProps {
  categories: CategorySummary[];
  selectedCategories: CategoryType[];
  onPostClick?: (post: PostForAnalysis) => void;
}

export default function CategorizedPostList({
  categories,
  selectedCategories,
  onPostClick,
}: CategorizedPostListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<CategoryType>>(
    new Set(categories.map((cat) => cat.category))
  );

  const toggleCategory = (category: CategoryType) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Filter categories based on selection
  const visibleCategories = categories.filter((cat) =>
    selectedCategories.includes(cat.category)
  );

  if (visibleCategories.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          No posts match the selected categories. Try selecting different categories.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visibleCategories.map((category) => {
        const isExpanded = expandedCategories.has(category.category);
        const hasPosts = category.posts.length > 0;

        return (
          <div
            key={category.category}
            className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            {/* Category Header */}
            <button
              type="button"
              onClick={() => toggleCategory(category.category)}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
            >
              <div className="flex items-center gap-3">
                <CategoryBadge category={category.category} count={category.count} size="md" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
                  </h3>
                  {category.summary && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {category.summary}
                    </p>
                  )}
                </div>
              </div>
              <svg
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Category Posts */}
            {isExpanded && hasPosts && (
              <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                <div className="space-y-3">
                  {category.posts.map((post) => (
                    <div
                      key={post.id}
                      className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
                      onClick={() => onPostClick?.(post)}
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {post.title}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {post.dao}
                        </span>
                      </div>
                      <div className="mb-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span>By {post.author}</span>
                        <span>•</span>
                        <DateFormatter dateString={post.timestamp} format="relative" />
                        {post.engagement.views > 0 && (
                          <>
                            <span>•</span>
                            <span>{post.engagement.views} views</span>
                          </>
                        )}
                      </div>
                      {post.content && (
                        <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
                          {post.content.substring(0, 200)}
                          {post.content.length > 200 ? '...' : ''}
                        </p>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isExpanded && !hasPosts && (
              <div className="border-t border-gray-200 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                No posts in this category
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

