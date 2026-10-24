import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth.jsx'

const initialForm = { full_name: '', email: '', username: '', password: '', confirmPassword: '' }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const usernamePattern = /^[a-zA-Z0-9_-]{3,50}$/

function getErrorMessage(error) {
  const detail = error?.response?.data?.detail
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(', ')
  }
  return detail || "We couldn't create your account. Check your details and try again."
}

export default function RegisterPage() {
  const { isAuthenticated, signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const email = form.email.trim()
    const fullName = form.full_name.trim()
    const username = form.username.trim()

    if (!fullName) {
      setError('Please enter your name.')
      return
    }

    if (!username) {
      setError('Please pick a username.')
      return
    }

    if (!usernamePattern.test(username)) {
      setError('Usernames are 3 to 50 characters and can use letters, numbers, hyphens and underscores.')
      return
    }

    if (!emailPattern.test(email)) {
      setError('Enter a valid email address.')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await signUp({ full_name: fullName, email, username, password: form.password })
      navigate('/dashboard')
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
        <h1 className="font-display text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="text-sm text-brown dark:text-dark-text/80">It's free, and you'll be building your first form in a minute.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-brown-dark dark:text-dark-text">Username</span>
          <input
            type="text"
            value={form.username}
            onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
            className="w-full rounded-2xl border border-warm-gray bg-cream px-4 py-3 outline-none transition focus:border-primary dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
            placeholder="janedoe"
            pattern="[a-zA-Z0-9_-]{3,50}"
            title="3-50 characters: letters, numbers, hyphens, underscores only"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-brown-dark dark:text-dark-text">Full name</span>
          <input
            type="text"
            value={form.full_name}
            onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
            className="w-full rounded-2xl border border-warm-gray bg-cream px-4 py-3 outline-none transition focus:border-primary dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
            placeholder="Jane Doe"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-brown-dark dark:text-dark-text">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-2xl border border-warm-gray bg-cream px-4 py-3 outline-none transition focus:border-primary dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-brown-dark dark:text-dark-text">Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            className="w-full rounded-2xl border border-warm-gray bg-cream px-4 py-3 outline-none transition focus:border-primary dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
            placeholder="Create a password"
            minLength="8"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-brown-dark dark:text-dark-text">Confirm password</span>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
            className="w-full rounded-2xl border border-warm-gray bg-cream px-4 py-3 outline-none transition focus:border-primary dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
            placeholder="Confirm password"
            minLength="8"
            required
          />
        </label>
        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-teal-600 px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-sm text-brown dark:text-dark-text/80">
        Already have an account?{' '}
        <Link className="font-semibold text-teal-700 hover:text-teal-800" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  )
}
