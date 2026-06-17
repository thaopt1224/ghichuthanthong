import { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { getFirebaseAuth } from '../lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(getFirebaseAuth(), (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(getFirebaseAuth(), email, password)

  const register = (email: string, password: string) =>
    createUserWithEmailAndPassword(getFirebaseAuth(), email, password)

  const logout = () => signOut(getFirebaseAuth())

  return { user, loading, login, register, logout }
}
