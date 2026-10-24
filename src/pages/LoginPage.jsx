import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth.jsx'

const initialForm = { email: '', password: '' }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getErrorMessage(error) {
  const detail = error?.response?.data?.detail
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(', ')
  }
  return detail || "That didn't work. Check your email and password and try again."
}

export default function LoginPage() {
  const { isAuthenticated, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (loading) return

    const email = form.email.trim()

    if (!emailPattern.test(email)) {
      setError('Enter a valid email address.')
      return
    }

    if (!form.password) {
      setError('Password is required.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await signIn({ email, password: form.password })
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-white/80 bg-white/85 p-8 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="mb-6 space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-brown dark:text-dark-text/80">Sign in to get back to your forms.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-brown-dark dark:text-dark-text">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-2xl border border-warm-gray bg-cream px-4 py-3 outline-none transition focus:border-primary dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
            placeholder="you@example.com"
            required
            aria-invalid={Boolean(error)}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-brown-dark dark:text-dark-text">Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            className="w-full rounded-2xl border border-warm-gray bg-cream px-4 py-3 outline-none transition focus:border-primary dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
            placeholder="••••••••"
            required
            aria-invalid={Boolean(error)}
          />
        </label>
        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-brown-dark px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-primary dark:hover:bg-primary-dark"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-6 text-sm text-brown dark:text-dark-text/80">
        New here?{' '}
        <Link className="font-semibold text-teal-700 hover:text-teal-800" to="/register">
          Create an account
        </Link>
      </p>
    </div>
  )
}
