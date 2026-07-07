import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-600">
        Loading secure session...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
