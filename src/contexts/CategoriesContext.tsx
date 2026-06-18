import { createContext, useContext } from 'react'
import { useCategories } from '../hooks/useCategories'
import type { CategoriesMap } from '../types/category'

interface CategoriesContextValue {
  categories: CategoriesMap
  categoryIds: string[]
  loading: boolean
  error: string | null
}

const CategoriesContext = createContext<CategoriesContextValue | null>(null)

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const value = useCategories()
  return (
    <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
  )
}

export function useCategoriesContext(): CategoriesContextValue {
  const ctx = useContext(CategoriesContext)
  if (!ctx) {
    throw new Error('useCategoriesContext must be used within CategoriesProvider')
  }
  return ctx
}
