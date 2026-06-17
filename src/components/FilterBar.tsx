import type { CategoryId } from '../lib/categories'
import { CATEGORIES, CATEGORY_IDS } from '../lib/categories'

interface FilterBarProps {
  category: CategoryId | ''
  subcategory: string
  hashtag: string
  subcategoryOptions: string[]
  hashtagOptions: string[]
  onCategoryChange: (category: CategoryId | '') => void
  onSubcategoryChange: (subcategory: string) => void
  onHashtagChange: (hashtag: string) => void
  onClear: () => void
}

export function FilterBar({
  category,
  subcategory,
  hashtag,
  subcategoryOptions,
  hashtagOptions,
  onCategoryChange,
  onSubcategoryChange,
  onHashtagChange,
  onClear,
}: FilterBarProps) {
  const hasActiveFilter = Boolean(category || subcategory || hashtag)

  return (
    <section className="filter-section">
      <div className="filter-row">
        <span className="filter-label">Danh mục</span>
        <div className="filter-chips">
          <button
            type="button"
            className={`filter-chip${category === '' ? ' active' : ''}`}
            onClick={() => onCategoryChange('')}
          >
            Tất cả
          </button>
          {CATEGORY_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className={`filter-chip${category === id ? ' active' : ''}`}
              onClick={() => onCategoryChange(id)}
            >
              {CATEGORIES[id].label}
            </button>
          ))}
        </div>
      </div>

      {category && subcategoryOptions.length > 0 && (
        <div className="filter-row">
          <span className="filter-label">Loại</span>
          <div className="filter-chips">
            <button
              type="button"
              className={`filter-chip${subcategory === '' ? ' active' : ''}`}
              onClick={() => onSubcategoryChange('')}
            >
              Tất cả
            </button>
            {subcategoryOptions.map((sub) => (
              <button
                key={sub}
                type="button"
                className={`filter-chip${subcategory === sub ? ' active' : ''}`}
                onClick={() => onSubcategoryChange(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {hashtagOptions.length > 0 && (
        <div className="filter-row">
          <span className="filter-label">Hashtag</span>
          <div className="filter-chips">
            {hashtag && (
              <button
                type="button"
                className="filter-chip active"
                onClick={() => onHashtagChange('')}
              >
                #{hashtag} ×
              </button>
            )}
            {hashtagOptions
              .filter((tag) => tag !== hashtag)
              .slice(0, 12)
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="filter-chip filter-chip-hashtag"
                  onClick={() => onHashtagChange(tag)}
                >
                  #{tag}
                </button>
              ))}
          </div>
        </div>
      )}

      {hasActiveFilter && (
        <button type="button" className="filter-clear" onClick={onClear}>
          Xoá bộ lọc
        </button>
      )}
    </section>
  )
}
