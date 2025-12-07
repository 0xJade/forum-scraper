'use client';

import { DAOConfig } from '@/config/daos';

interface MultiDAOSelectorProps {
  daos: DAOConfig[];
  selectedDAOs: DAOConfig[];
  onSelectionChange: (selectedDAOs: DAOConfig[]) => void;
  disabled?: boolean;
}

export default function MultiDAOSelector({
  daos,
  selectedDAOs,
  onSelectionChange,
  disabled = false,
}: MultiDAOSelectorProps) {
  const handleToggle = (dao: DAOConfig) => {
    if (disabled) return;

    const isSelected = selectedDAOs.some((d) => d.id === dao.id);
    if (isSelected) {
      onSelectionChange(selectedDAOs.filter((d) => d.id !== dao.id));
    } else {
      onSelectionChange([...selectedDAOs, dao]);
    }
  };

  const handleSelectAll = () => {
    if (disabled) return;
    onSelectionChange(daos);
  };

  const handleDeselectAll = () => {
    if (disabled) return;
    onSelectionChange([]);
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Select DAOs to Analyze
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={disabled || selectedDAOs.length === daos.length}
            className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed dark:text-blue-400 dark:hover:text-blue-300"
          >
            Select All
          </button>
          <span className="text-xs text-gray-400">|</span>
          <button
            type="button"
            onClick={handleDeselectAll}
            disabled={disabled || selectedDAOs.length === 0}
            className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed dark:text-blue-400 dark:hover:text-blue-300"
          >
            Deselect All
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {daos.map((dao) => {
          const isSelected = selectedDAOs.some((d) => d.id === dao.id);
          return (
            <label
              key={dao.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                  : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(dao)}
                disabled={disabled}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-700"
                aria-label={`Select ${dao.displayName}`}
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {dao.displayName}
                </div>
                {dao.description && (
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {dao.description}
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {selectedDAOs.length > 0 && (
        <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>{selectedDAOs.length}</strong> DAO{selectedDAOs.length !== 1 ? 's' : ''}{' '}
            selected
          </p>
        </div>
      )}
    </div>
  );
}

