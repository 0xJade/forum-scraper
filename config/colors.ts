import { CategoryType } from '@/types/category';

export interface CategoryColor {
  light: string;
  dark: string;
  hex: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
}

export const CATEGORY_COLORS: Record<CategoryType, CategoryColor> = {
  governance: {
    light: 'text-purple-800',
    dark: 'text-purple-300',
    hex: '#9333EA',
    bgLight: 'bg-purple-100',
    bgDark: 'bg-purple-900/30',
    borderLight: 'border-purple-300',
    borderDark: 'border-purple-700',
  },
  technical: {
    light: 'text-blue-800',
    dark: 'text-blue-300',
    hex: '#3B82F6',
    bgLight: 'bg-blue-100',
    bgDark: 'bg-blue-900/30',
    borderLight: 'border-blue-300',
    borderDark: 'border-blue-700',
  },
  community: {
    light: 'text-green-800',
    dark: 'text-green-300',
    hex: '#10B981',
    bgLight: 'bg-green-100',
    bgDark: 'bg-green-900/30',
    borderLight: 'border-green-300',
    borderDark: 'border-green-700',
  },
  partnerships: {
    light: 'text-orange-800',
    dark: 'text-orange-300',
    hex: '#F97316',
    bgLight: 'bg-orange-100',
    bgDark: 'bg-orange-900/30',
    borderLight: 'border-orange-300',
    borderDark: 'border-orange-700',
  },
  education: {
    light: 'text-indigo-800',
    dark: 'text-indigo-300',
    hex: '#6366F1',
    bgLight: 'bg-indigo-100',
    bgDark: 'bg-indigo-900/30',
    borderLight: 'border-indigo-300',
    borderDark: 'border-indigo-700',
  },
  announcements: {
    light: 'text-yellow-800',
    dark: 'text-yellow-300',
    hex: '#EAB308',
    bgLight: 'bg-yellow-100',
    bgDark: 'bg-yellow-900/30',
    borderLight: 'border-yellow-300',
    borderDark: 'border-yellow-700',
  },
  support: {
    light: 'text-pink-800',
    dark: 'text-pink-300',
    hex: '#EC4899',
    bgLight: 'bg-pink-100',
    bgDark: 'bg-pink-900/30',
    borderLight: 'border-pink-300',
    borderDark: 'border-pink-700',
  },
  meta: {
    light: 'text-gray-800',
    dark: 'text-gray-300',
    hex: '#6B7280',
    bgLight: 'bg-gray-100',
    bgDark: 'bg-gray-900/30',
    borderLight: 'border-gray-300',
    borderDark: 'border-gray-700',
  },
};

/**
 * Get color classes for a category based on theme
 */
export function getCategoryColorClasses(
  category: CategoryType,
  theme: 'light' | 'dark' = 'light'
): string {
  const colors = CATEGORY_COLORS[category];
  if (theme === 'dark') {
    return `${colors.bgDark} ${colors.dark} ${colors.borderDark}`;
  }
  return `${colors.bgLight} ${colors.light} ${colors.borderLight}`;
}

