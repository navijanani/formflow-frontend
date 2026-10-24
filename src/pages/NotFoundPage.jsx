import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-white/80 bg-white/85 p-8 text-center shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">404</p>
      <h2 className="mt-3 font-display text-2xl font-bold">We can't find that page</h2>
      <p className="mt-4 text-brown dark:text-dark-text/80">The link might be old, or there may be a typo in the address.</p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-full bg-brown-dark px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 dark:bg-primary dark:hover:bg-primary-dark"
      >
        Go to the home page
      </Link>
    </div>
  )
}
