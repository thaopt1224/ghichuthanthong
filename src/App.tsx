import { useAuth } from './hooks/useAuth'
import { isFirebaseConfigured } from './lib/firebase'
import { AuthPage } from './components/AuthPage'
import { Dashboard } from './components/Dashboard'
import { FeedbackButton } from './components/FeedbackButton'
import { SetupPage } from './components/SetupPage'
import { CategoriesProvider } from './contexts/CategoriesContext'

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

  return (
    <>
      {!user ? (
        <AuthPage />
      ) : (
        <CategoriesProvider user={user}>
          <Dashboard user={user} />
        </CategoriesProvider>
      )}
      <FeedbackButton userEmail={user?.email} />
    </>
  )
}
