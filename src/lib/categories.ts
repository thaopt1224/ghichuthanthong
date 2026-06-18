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

function readString(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  return ''
}

function readSubcategories(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }
  if (typeof value === 'string') {
    return value
      .split(/[,;|]/)
      .map((item) => item.trim())
      .filter(Boolean)
  }
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>)
      .map((item) => String(item).trim())
      .filter(Boolean)
  }
  return []
}

function readOrder(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value.trim())
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

export function parseCategoryDoc(
  data: Record<string, unknown>,
): { label: string; subcategories: string[]; order?: number } | null {
  const label =
    readString(data.label) ||
    readString(data.name) ||
    readString(data.title)

  if (!label) return null

  const subcategories = readSubcategories(
    data.subcategories ?? data.subCategories ?? data.types ?? data.loai,
  )

  const order = readOrder(data.order)

  return { label, subcategories, order }
}
