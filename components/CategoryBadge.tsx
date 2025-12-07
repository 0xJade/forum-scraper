import { CategoryType } from '@/types/category';
import { CATEGORY_COLORS } from '@/config/colors';

interface CategoryBadgeProps {
  category: CategoryType;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CategoryBadge({
  category,
  count,
  size = 'md',
  className = '',
}: CategoryBadgeProps) {
  const colors = CATEGORY_COLORS[category];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses[size]} ${colors.bgLight} ${colors.light} ${colors.borderLight} dark:${colors.bgDark} dark:${colors.dark} dark:${colors.borderDark} ${className}`}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: colors.hex }}
        aria-hidden="true"
      />
      <span className="capitalize">{category}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-1 rounded-full bg-white/50 px-1.5 py-0.5 text-xs font-semibold dark:bg-black/20">
          {count}
        </span>
      )}
    </span>
  );
}

