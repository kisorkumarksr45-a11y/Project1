import type { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Categories</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedCategory === null
              ? 'bg-emerald-500 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
