import { Topic } from '@/types/topic';
import DateFormatter from './DateFormatter';

interface TopicItemProps {
  topic: Topic;
  onClick: (topicId: number) => void;
}

export default function TopicItem({ topic, onClick }: TopicItemProps) {
  return (
    <button
      onClick={() => onClick(topic.id)}
      className="group w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
      aria-label={`View topic: ${topic.title}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="mb-2 text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
            {topic.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-mono text-xs">#{topic.id}</span>
            <span>•</span>
            <DateFormatter dateString={topic.created_at} format="relative" />
          </div>
        </div>
        <svg
          className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
}

