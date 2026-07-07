import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import RootLayout from './layouts/RootLayout'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingScreen from './components/LoadingScreen'

// Lazy load heavy pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const CreateFormPage = lazy(() => import('./pages/CreateFormPage'))
const EditFormPage = lazy(() => import('./pages/EditFormPage'))
const PublicFormPage = lazy(() => import('./pages/PublicFormPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Suspense fallback={<LoadingScreen />}><LoginPage /></Suspense>} />
        <Route path="/register" element={<Suspense fallback={<LoadingScreen />}><RegisterPage /></Suspense>} />
        <Route path="/forms/:publicId/public" element={<Suspense fallback={<LoadingScreen />}><PublicFormPage /></Suspense>} />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/forms/new"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <ProtectedRoute>
                <CreateFormPage />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/forms/:formId/edit"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <ProtectedRoute>
                <EditFormPage />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/forms/:formId/analytics"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route path="/app" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
