import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { getFirestoreErrorMessage } from '../lib/firebase-errors'
import { getCategoryIds, parseCategoryDoc } from '../lib/categories'
import { getFirebaseDb } from '../lib/firebase'
import type { CategoriesMap } from '../types/category'

export function useCategories(user: User | null) {
  const [categories, setCategories] = useState<CategoriesMap>({})
  const [rawDocCount, setRawDocCount] = useState(0)
  const [invalidDocCount, setInvalidDocCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setCategories({})
      setRawDocCount(0)
      setInvalidDocCount(0)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    const unsubscribe = onSnapshot(
      collection(getFirebaseDb(), 'categories'),
      (snapshot) => {
        const next: CategoriesMap = {}
        let invalid = 0

        for (const docSnap of snapshot.docs) {
          const parsed = parseCategoryDoc(
            docSnap.data() as Record<string, unknown>,
          )
          if (parsed) {
            next[docSnap.id] = parsed
          } else {
            invalid += 1
            if (import.meta.env.DEV) {
              console.warn(
                `[categories] Bỏ qua document "${docSnap.id}" — cần field label (string).`,
                docSnap.data(),
              )
            }
          }
        }

        setCategories(next)
        setRawDocCount(snapshot.size)
        setInvalidDocCount(invalid)
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
  }, [user])

  const categoryIds = useMemo(() => getCategoryIds(categories), [categories])

  return { categories, categoryIds, rawDocCount, invalidDocCount, loading, error }
}
