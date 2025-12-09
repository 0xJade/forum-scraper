'use client';

import { useState } from 'react';
import { DAOS, DAOConfig } from '@/config/daos';
import MultiDAOSelector from '@/components/MultiDAOSelector';
import TopicDetails from '@/components/TopicDetails';
import EcosystemSummaryView from '@/components/EcosystemSummaryView';
import { PostForAnalysis } from '@/types/ai-summary';

export default function Home() {
  const [selectedDAOs, setSelectedDAOs] = useState<DAOConfig[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [selectedForumBaseUrl, setSelectedForumBaseUrl] = useState<string | null>(null);
  // Track if user has explicitly triggered the report generation
  const [shouldLoadReport, setShouldLoadReport] = useState(false);

  const handleBack = () => {
    setSelectedTopicId(null);
  };

  const handleBackToSelector = () => {
    setSelectedDAOs([]);
    setSelectedTopicId(null);
    setSelectedForumBaseUrl(null);
    setShouldLoadReport(false);
  };

  const handlePostClick = (post: PostForAnalysis) => {
    setSelectedTopicId(post.topicId);
    // Find the DAO that this post belongs to
    const postDAO = selectedDAOs.find((dao) => dao.displayName === post.dao);
    if (postDAO) {
      setSelectedForumBaseUrl(postDAO.baseUrl);
    }
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

  // Show DAO ecosystem summary view (only after user clicks Generate Report)
  if (selectedDAOs.length > 0 && shouldLoadReport) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <EcosystemSummaryView
            selectedDAOs={selectedDAOs}
            onBack={handleBackToSelector}
            onPostClick={handlePostClick}
          />
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
            <MultiDAOSelector
              daos={DAOS}
              selectedDAOs={selectedDAOs}
              onSelectionChange={setSelectedDAOs}
            />

            {selectedDAOs.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    <strong>{selectedDAOs.length} DAO{selectedDAOs.length !== 1 ? 's' : ''} selected.</strong> Click
                    &quot;Generate Ecosystem Summary&quot; to analyze all selected DAOs.
                  </p>
                </div>
                <button
                  onClick={() => setShouldLoadReport(true)}
                  disabled={selectedDAOs.length === 0}
                  className="w-full rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-600"
                >
                  Generate Ecosystem Summary
                </button>
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
                  <span>
                    Select one or more DAOs from the checkboxes above
                  </span>
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
                  <span>
                    Click &quot;Generate Ecosystem Summary&quot; to load posts and generate AI-powered analysis
                  </span>
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
