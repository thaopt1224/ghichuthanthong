import type { CategoriesMap } from '../types/category'

export function getCategoryIds(categories: CategoriesMap): string[] {
  return Object.keys(categories).sort((a, b) => {
    const orderA = categories[a].order ?? Number.MAX_SAFE_INTEGER
    const orderB = categories[b].order ?? Number.MAX_SAFE_INTEGER
    if (orderA !== orderB) return orderA - orderB
    return categories[a].label.localeCompare(categories[b].label, 'vi')
  })
}

export function getCategoryLabel(
  id: string,
  categories: CategoriesMap,
): string {
  if (!id) return ''
  return categories[id]?.label ?? id
}

export function getSubcategories(
  categoryId: string,
  categories: CategoriesMap,
): string[] {
  return categories[categoryId]?.subcategories ?? []
}

export function parseCategoryDoc(
  data: Record<string, unknown>,
): { label: string; subcategories: string[]; order?: number } | null {
  const label = typeof data.label === 'string' ? data.label.trim() : ''
  if (!label) return null

  const subcategories = Array.isArray(data.subcategories)
    ? data.subcategories.map((item) => String(item).trim()).filter(Boolean)
    : []

  const order = typeof data.order === 'number' ? data.order : undefined

  return { label, subcategories, order }
}
