'use client';

import { useState } from 'react';
import { DAOS, DAOConfig, getDefaultDays } from '@/config/daos';
import DAOSelector from '@/components/DAOSelector';
import TopicList from '@/components/TopicList';
import TopicDetails from '@/components/TopicDetails';

export default function Home() {
  const [selectedDAO, setSelectedDAO] = useState<DAOConfig | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [selectedForumBaseUrl, setSelectedForumBaseUrl] = useState<string | null>(null);

  const handleDAOSelect = (dao: DAOConfig | null) => {
    setSelectedDAO(dao);
    setSelectedTopicId(null); // Reset topic selection when DAO changes
    setSelectedForumBaseUrl(dao?.baseUrl || null);
  };

  const handleTopicSelect = (topicId: number, forumBaseUrl: string) => {
    setSelectedTopicId(topicId);
    setSelectedForumBaseUrl(forumBaseUrl);
  };

  const handleBack = () => {
    setSelectedTopicId(null);
  };

  const handleBackToSelector = () => {
    setSelectedDAO(null);
    setSelectedTopicId(null);
    setSelectedForumBaseUrl(null);
  };

  // Show topic details if a topic is selected
  if (selectedTopicId && selectedForumBaseUrl) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <TopicDetails
            topicId={selectedTopicId}
            forumBaseUrl={selectedForumBaseUrl}
            onBack={handleBack}
          />
        </div>
      </div>
    );
  }

  // Show topic list if a DAO is selected
  if (selectedDAO && selectedForumBaseUrl) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8">
            <button
              onClick={handleBackToSelector}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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
              Back to DAO Selection
            </button>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {selectedDAO.displayName} Ecosystem Report
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Posts from the last 7 days
            </p>
          </header>

          <main>
            <TopicList
              forumBaseUrl={selectedForumBaseUrl}
              dao={selectedDAO}
              days={getDefaultDays()}
              onTopicSelect={handleTopicSelect}
            />
          </main>
        </div>
      </div>
    );
  }

  // Show landing page with DAO selector
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-gray-100">
            DAO Ecosystem Report Generator
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
            Generate comprehensive reports on DAO forum activity. Select a DAO to view all posts
            and discussions from the past week.
          </p>
        </header>

        <main className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <DAOSelector
              daos={DAOS}
              selectedDAO={selectedDAO}
              onSelect={handleDAOSelect}
            />

            {selectedDAO && (
              <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Selected:</strong> {selectedDAO.displayName}
                </p>
                <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                  Click outside the dropdown or select a different DAO to change your selection.
                </p>
              </div>
            )}

            <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                How it works
              </h2>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Select a DAO from the dropdown above</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>View all posts and topics from the last 7 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Explore detailed statistics and insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Click on any topic to view full details and discussions</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
