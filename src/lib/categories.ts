export type CategoryId = 'phim' | 'truyen' | 'game' | 'khac'

export interface CategoryConfig {
  label: string
  subcategories: string[]
}

export const CATEGORIES: Record<CategoryId, CategoryConfig> = {
  phim: {
    label: 'Phim',
    subcategories: ['Anime', 'HH3D', 'Phim lẻ', 'Series', 'Tài liệu', 'Khác'],
  },
  truyen: {
    label: 'Truyện',
    subcategories: ['Manga', 'Light novel', 'Manhua', 'Manhwa', 'Web novel', 'Khác'],
  },
  game: {
    label: 'Game',
    subcategories: ['PC', 'Mobile', 'Console', 'Khác'],
  },
  khac: {
    label: 'Khác',
    subcategories: ['Khác'],
  },
}

export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[]

export function getCategoryLabel(id: CategoryId | ''): string {
  if (!id) return ''
  return CATEGORIES[id]?.label ?? id
}

export function isCategoryId(value: string): value is CategoryId {
  return value in CATEGORIES
}
