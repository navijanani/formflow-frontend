import { Outlet } from 'react-router-dom'

import Navbar from '../components/Navbar'

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-cream text-brown-dark transition-colors duration-300 dark:bg-dark-bg dark:text-dark-text">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
