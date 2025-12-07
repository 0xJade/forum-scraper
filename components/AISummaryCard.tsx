import { AISummary } from '@/types/ai-summary';
import { format } from 'date-fns';

interface AISummaryCardProps {
  summary: AISummary;
}

export default function AISummaryCard({ summary }: AISummaryCardProps) {
  const sentimentColors = {
    positive: 'text-green-600 dark:text-green-400',
    neutral: 'text-gray-600 dark:text-gray-400',
    negative: 'text-red-600 dark:text-red-400',
    mixed: 'text-yellow-600 dark:text-yellow-400',
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Ecosystem Summary
        </h2>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Generated {format(new Date(summary.generatedAt), 'MMM d, yyyy h:mm a')}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
          Executive Summary
        </h3>
        <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
          {summary.executiveSummary}
        </p>
      </div>

      {/* Key Themes */}
      {summary.keyThemes && summary.keyThemes.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
            Key Themes
          </h3>
          <div className="space-y-3">
            {summary.keyThemes.map((theme, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {theme.theme}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      theme.relevance === 'high'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : theme.relevance === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {theme.relevance}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{theme.description}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {theme.postIds.length} post{theme.postIds.length !== 1 ? 's' : ''} related
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sentiment */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
          Community Sentiment
        </h3>
        <div className="flex items-center gap-3">
          <span
            className={`text-lg font-semibold capitalize ${sentimentColors[summary.sentiment.overall]}`}
          >
            {summary.sentiment.overall}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {summary.sentiment.details}
          </span>
        </div>
      </div>

      {/* Cross-DAO Insights */}
      {summary.crossDaoInsights && summary.crossDaoInsights.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
            Cross-DAO Insights
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {summary.crossDaoInsights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Items */}
      {summary.actionItems && summary.actionItems.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
            Action Items
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {summary.actionItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Statistics */}
      <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>
            <strong>{summary.daoCount}</strong> DAO{summary.daoCount !== 1 ? 's' : ''}
          </span>
          <span>
            <strong>{summary.totalPosts}</strong> post{summary.totalPosts !== 1 ? 's' : ''}
          </span>
          <span>
            <strong>{summary.categories.length}</strong> categor{summary.categories.length !== 1 ? 'ies' : 'y'}
          </span>
        </div>
      </div>
    </div>
  );
}

