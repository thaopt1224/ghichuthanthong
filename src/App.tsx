import { useAuth } from './hooks/useAuth'
import { isFirebaseConfigured } from './lib/firebase'
import { AuthPage } from './components/AuthPage'
import { Dashboard } from './components/Dashboard'
import { SetupPage } from './components/SetupPage'

export default function App() {
  if (!isFirebaseConfigured()) {
    return <SetupPage />
  }

  return <AppWithAuth />
}

function AppWithAuth() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return <Dashboard user={user} />
}
