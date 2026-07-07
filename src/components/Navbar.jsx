import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Sun, MoonStars } from '@phosphor-icons/react'

import { useAuth } from '../hooks/useAuth.jsx'
import { useTheme } from '../hooks/useTheme.jsx'

const linkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-primary text-white shadow-glow'
      : 'text-brown hover:bg-beige-dark hover:text-brown-dark dark:text-dark-text dark:hover:bg-dark-elevated',
  ].join(' ')

export default function Navbar() {
  const { isAuthenticated, signOut, user } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-warm-gray bg-cream/90 backdrop-blur-xl transition-colors duration-300 dark:border-dark-border-subtle dark:bg-dark-bg/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary p-1.5">
            <img src="/logo.svg" alt="FormFlow Logo" className="h-full w-full" />
          </div>
          <span className="font-display text-2xl font-black tracking-tight text-brown-dark dark:text-dark-text">
            FormFlow
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/forms/new" className={linkClass}>
                Create
              </NavLink>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-warm-gray px-4 py-2 text-sm font-medium text-brown-dark transition hover:border-brown hover:bg-beige dark:border-dark-border-alt dark:text-dark-text dark:hover:bg-dark-elevated"
              >
                Sign out{user?.full_name ? `, ${user.full_name}` : ''}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-warm-gray px-3 py-2 text-brown-dark transition hover:border-brown hover:bg-beige dark:border-dark-border-alt dark:text-dark-text dark:hover:bg-dark-elevated"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={20} weight="duotone" /> : <MoonStars size={20} weight="duotone" />}
          </button>
        </nav>
      </div>
    </header>
  )
}
