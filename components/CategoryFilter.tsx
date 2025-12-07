'use client';

import { CategoryType, CATEGORIES } from '@/types/category';
import CategoryBadge from './CategoryBadge';

interface CategoryFilterProps {
  selectedCategories: CategoryType[];
  onToggleCategory: (category: CategoryType) => void;
  categoryCounts: Record<CategoryType, number>;
}

export default function CategoryFilter({
  selectedCategories,
  onToggleCategory,
  categoryCounts,
}: CategoryFilterProps) {
  const handleToggle = (category: CategoryType) => {
    onToggleCategory(category);
  };

  const allSelected = selectedCategories.length === CATEGORIES.length;
  const noneSelected = selectedCategories.length === 0;

  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all
      CATEGORIES.forEach((cat) => {
        if (selectedCategories.includes(cat.id)) {
          onToggleCategory(cat.id);
        }
      });
    } else {
      // Select all
      CATEGORIES.forEach((cat) => {
        if (!selectedCategories.includes(cat.id)) {
          onToggleCategory(cat.id);
        }
      });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Filter by Category
        </h3>
        <button
          type="button"
          onClick={handleSelectAll}
          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          const count = categoryCounts[category.id] || 0;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleToggle(category.id)}
              className={`transition-all ${
                isSelected
                  ? 'opacity-100 ring-2 ring-blue-500 ring-offset-2 dark:ring-blue-400'
                  : 'opacity-60 hover:opacity-100'
              }`}
              aria-label={`${isSelected ? 'Deselect' : 'Select'} ${category.name} category`}
            >
              <CategoryBadge category={category.id} count={count} size="sm" />
            </button>
          );
        })}
      </div>

      {noneSelected && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          No categories selected. Select at least one to view posts.
        </p>
      )}
    </div>
  );
}

