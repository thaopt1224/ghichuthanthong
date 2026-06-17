import { useCallback, useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { getFirestoreErrorMessage } from '../lib/firebase-errors'
import { getFirebaseDb } from '../lib/firebase'
import { normalizeNote } from '../lib/note'
import type { Note, NoteInput } from '../types/note'

export function useNotes(user: User | null) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setNotes([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    const db = getFirebaseDb()
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc'),
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const next = snapshot.docs.map((d) =>
          normalizeNote(d.id, d.data() as Record<string, unknown>),
        )
        setNotes(next)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Firestore listen error:', err)
        setError(getFirestoreErrorMessage(err))
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user])

  const addNote = useCallback(
    async (input: NoteInput) => {
      if (!user) return
      const now = Date.now()
      try {
        await addDoc(collection(getFirebaseDb(), 'notes'), {
          ...input,
          userId: user.uid,
          createdAt: now,
          updatedAt: now,
        })
      } catch (err) {
        const message = getFirestoreErrorMessage(err)
        setError(message)
        throw new Error(message)
      }
    },
    [user],
  )

  const updateNote = useCallback(
    async (id: string, input: NoteInput) => {
      if (!user) return
      try {
        await updateDoc(doc(getFirebaseDb(), 'notes', id), {
          ...input,
          updatedAt: Date.now(),
        })
      } catch (err) {
        const message = getFirestoreErrorMessage(err)
        setError(message)
        throw new Error(message)
      }
    },
    [user],
  )

  const removeNote = useCallback(
    async (id: string) => {
      if (!user) return
      try {
        await deleteDoc(doc(getFirebaseDb(), 'notes', id))
      } catch (err) {
        const message = getFirestoreErrorMessage(err)
        setError(message)
        throw new Error(message)
      }
    },
    [user],
  )

  return { notes, loading, error, addNote, updateNote, removeNote }
}
