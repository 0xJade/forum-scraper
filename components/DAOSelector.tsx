'use client';

import { DAOConfig } from '@/config/daos';

interface DAOSelectorProps {
  daos: DAOConfig[];
  selectedDAO: DAOConfig | null;
  onSelect: (dao: DAOConfig | null) => void;
  disabled?: boolean;
}

export default function DAOSelector({
  daos,
  selectedDAO,
  onSelect,
  disabled = false,
}: DAOSelectorProps) {
  return (
    <div className="w-full">
      <label
        htmlFor="dao-selector"
        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Select DAO
      </label>
      <div className="relative">
        <select
          id="dao-selector"
          value={selectedDAO?.id || ''}
          onChange={(e) => {
            const dao = daos.find((d) => d.id === e.target.value) || null;
            onSelect(dao);
          }}
          disabled={disabled}
          className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-base text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400 dark:disabled:bg-gray-700"
          aria-label="Select DAO to generate ecosystem report"
        >
          <option value="">-- Select a DAO --</option>
          {daos.map((dao) => (
            <option key={dao.id} value={dao.id}>
              {dao.displayName}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-5 w-5 text-gray-400"
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
        </div>
      </div>
      {selectedDAO?.description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {selectedDAO.description}
        </p>
      )}
    </div>
  );
}

