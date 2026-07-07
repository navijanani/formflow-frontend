import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { fetchCurrentUser, loginUser, registerUser } from '../services/authService'
import { TOKEN_STORAGE_KEY } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem(TOKEN_STORAGE_KEY))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))
  const signInInFlightRef = useRef(null)

  useEffect(() => {
    if (!token) {
      setUser(null)
      return
    }

    let isActive = true
    setLoading(true)

    fetchCurrentUser()
      .then((currentUser) => {
        if (isActive) {
          setUser(currentUser)
        }
      })
      .catch(() => {
        if (isActive) {
          window.localStorage.removeItem(TOKEN_STORAGE_KEY)
          setToken(null)
          setUser(null)
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [token])

  useEffect(() => {
    const clearSession = () => {
      setToken(null)
      setUser(null)
      setLoading(false)
    }

    window.addEventListener('formflow:unauthorized', clearSession)
    return () => window.removeEventListener('formflow:unauthorized', clearSession)
  }, [])

  const signIn = async (credentials) => {
    if (signInInFlightRef.current) {
      return signInInFlightRef.current
    }

    const request = loginUser({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    })
      .then((data) => {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token)
        setToken(data.access_token)
        // Don't call fetchCurrentUser here - the useEffect will handle it
        return data
      })
      .finally(() => {
        signInInFlightRef.current = null
      })

    signInInFlightRef.current = request
    return request
  }

  const signUp = async (payload) => {
    await registerUser({
      full_name: payload.full_name.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    })
    return signIn({ email: payload.email, password: payload.password })
  }

  const signOut = () => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signOut,
    }),
    [loading, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
