'use client';

interface SummaryGeneratorProps {
  onGenerate: () => void;
  isGenerating: boolean;
  disabled?: boolean;
  postCount: number;
}

export default function SummaryGenerator({
  onGenerate,
  isGenerating,
  disabled = false,
  postCount,
}: SummaryGeneratorProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Generate AI-Powered Summary
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Analyze {postCount} post{postCount !== 1 ? 's' : ''} and generate a comprehensive
          ecosystem summary with intelligent categorization.
        </p>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={disabled || isGenerating || postCount === 0}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
            Generating Summary...
          </span>
        ) : (
          'Generate Ecosystem Summary'
        )}
      </button>

      {postCount === 0 && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          No posts available to analyze. Please select DAOs and ensure posts are loaded.
        </p>
      )}
    </div>
  );
}

