import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-eco-50">
      <div className="rounded-2xl bg-white px-6 py-4 text-sm font-medium text-eco-700 shadow-sm">
        Loading GreenEdu Loop...
      </div>
    </div>
  )
}

export function ProtectedRoute({ children }) {
  const { currentUser, isLoading } = useAuth()

  if (isLoading) return <FullPageLoader />
  if (!currentUser) return <Navigate to="/login" replace />

  return children
}

export function PublicRoute({ children }) {
  const { currentUser, isLoading } = useAuth()

  if (isLoading) return <FullPageLoader />
  if (currentUser) return <Navigate to="/" replace />

  return children
}
