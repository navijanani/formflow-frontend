import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './hooks/useAuth.jsx'
import { ThemeProvider } from './hooks/useTheme.jsx'

const appTree = (
  <ErrorBoundary>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </ErrorBoundary>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  import.meta.env.DEV ? appTree : <React.StrictMode>{appTree}</React.StrictMode>,
)
