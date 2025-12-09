'use client';

import { useState } from 'react';
import { DAOConfig, DAOCategory } from '@/config/daos';

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
  // Group DAOs by category
  const daosByCategory = daos.reduce((acc, dao) => {
    if (!acc[dao.category]) {
      acc[dao.category] = [];
    }
    acc[dao.category].push(dao);
    return acc;
  }, {} as Record<DAOCategory, DAOConfig[]>);

  // Define category order with DeFi first
  const categoryOrder: DAOCategory[] = ['DeFi', 'Public Goods', 'Token Engineering'];
  
  // Initialize expanded state with DeFi expanded by default
  const [expandedCategories, setExpandedCategories] = useState<Set<DAOCategory>>(
    new Set(['DeFi'])
  );

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

  const handleSelectCategory = (category: DAOCategory) => {
    if (disabled) return;
    const categoryDAOs = daosByCategory[category] || [];
    const categorySelected = categoryDAOs.filter((dao) =>
      selectedDAOs.some((d) => d.id === dao.id)
    );
    
    if (categorySelected.length === categoryDAOs.length) {
      // Deselect all in category
      onSelectionChange(selectedDAOs.filter((d) => !categoryDAOs.some((cdao) => cdao.id === d.id)));
    } else {
      // Select all in category
      const newSelected = [...selectedDAOs];
      categoryDAOs.forEach((dao) => {
        if (!newSelected.some((d) => d.id === dao.id)) {
          newSelected.push(dao);
        }
      });
      onSelectionChange(newSelected);
    }
  };

  const toggleCategory = (category: DAOCategory) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const getCategorySelectedCount = (category: DAOCategory) => {
    const categoryDAOs = daosByCategory[category] || [];
    return categoryDAOs.filter((dao) => selectedDAOs.some((d) => d.id === dao.id)).length;
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

      <div className="space-y-3">
        {categoryOrder.map((category) => {
          const categoryDAOs = daosByCategory[category] || [];
          const isExpanded = expandedCategories.has(category);
          const selectedCount = getCategorySelectedCount(category);
          const allSelected = selectedCount === categoryDAOs.length;

          return (
            <div
              key={category}
              className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between p-4">
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  disabled={disabled}
                  className="flex flex-1 items-center gap-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:cursor-not-allowed rounded-md -m-2 p-2"
                >
                  <svg
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
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
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({selectedCount}/{categoryDAOs.length})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCategory(category)}
                  disabled={disabled}
                  className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed dark:text-blue-400 dark:hover:text-blue-300 ml-2"
                >
                  {allSelected ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Category DAOs */}
              {isExpanded && (
                <div className="border-t border-gray-200 p-3 dark:border-gray-700">
                  <div className="space-y-2">
                    {categoryDAOs.map((dao) => {
                      const isSelected = selectedDAOs.some((d) => d.id === dao.id);
                      return (
                        <label
                          key={dao.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
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
                </div>
              )}
            </div>
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

