import { TopicStatistics } from '@/types/topic';
import { format } from 'date-fns';

interface StatisticsCardProps {
  statistics: TopicStatistics;
  daoName?: string;
}

export default function StatisticsCard({ statistics, daoName }: StatisticsCardProps) {
  const startDate = format(new Date(statistics.dateRange.start), 'MMM d, yyyy');
  const endDate = format(new Date(statistics.dateRange.end), 'MMM d, yyyy');

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {daoName ? `${daoName} Ecosystem Report` : 'Ecosystem Report'}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {statistics.totalPosts}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total {statistics.totalPosts === 1 ? 'Post' : 'Posts'}
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {statistics.uniqueTopics}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Unique {statistics.uniqueTopics === 1 ? 'Topic' : 'Topics'}
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Date Range:</span> {startDate} - {endDate}
        </div>
      </div>
    </div>
  );
}

