export interface CategoryConfig {
  label: string
  subcategories: string[]
  order?: number
}

export type CategoriesMap = Record<string, CategoryConfig>
