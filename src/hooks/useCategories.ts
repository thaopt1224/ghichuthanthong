import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { getFirestoreErrorMessage } from '../lib/firebase-errors'
import { getCategoryIds, parseCategoryDoc } from '../lib/categories'
import { getFirebaseDb } from '../lib/firebase'
import type { CategoriesMap } from '../types/category'

export function useCategories() {
  const [categories, setCategories] = useState<CategoriesMap>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const unsubscribe = onSnapshot(
      collection(getFirebaseDb(), 'categories'),
      (snapshot) => {
        const next: CategoriesMap = {}
        for (const docSnap of snapshot.docs) {
          const parsed = parseCategoryDoc(
            docSnap.data() as Record<string, unknown>,
          )
          if (parsed) {
            next[docSnap.id] = parsed
          }
        }
        setCategories(next)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Categories listen error:', err)
        setError(getFirestoreErrorMessage(err))
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const categoryIds = useMemo(() => getCategoryIds(categories), [categories])

  return { categories, categoryIds, loading, error }
}
