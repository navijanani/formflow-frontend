import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretLeft, CaretRight, Trash } from '@phosphor-icons/react'

import { useAuth } from '../hooks/useAuth.jsx'
import { listForms, deleteForm } from '../services/formService'

export default function DashboardPage() {
  const { user } = useAuth()
  const [forms, setForms] = useState([])
  const [status, setStatus] = useState('Loading forms...')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const pageSize = 12

  useEffect(() => {
    setLoading(true)
    setStatus('Loading forms...')
    listForms(page, pageSize)
      .then((data) => {
        setForms(data.items)
        setTotalPages(data.total_pages)
        setTotal(data.total)
        setStatus('')
      })
      .catch(() => setStatus('We couldn\'t load your forms. Try refreshing the page.'))
      .finally(() => setLoading(false))
  }, [page])

  const handleDelete = async (formId, formTitle) => {
    if (!window.confirm(`Delete "${formTitle}"? You won't be able to get it back.`)) {
      return
    }

    setDeleting(formId)
    try {
      await deleteForm(formId)
      setForms((current) => current.filter((f) => f.id !== formId))
      setStatus('Form deleted.')
      setTimeout(() => setStatus(''), 3000)
    } catch (error) {
      setStatus(error?.response?.data?.detail || 'Unable to delete form')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">{user?.full_name || user?.email || 'Workspace'}</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">Your forms</h1>
        </div>
        <Link to="/forms/new" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
          Blank form
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/forms/new" className="flex min-h-44 items-center justify-center rounded-lg border border-dashed border-primary/30 bg-beige text-sm font-semibold text-primary shadow-sm hover:bg-primary/10 dark:border-primary/40 dark:bg-dark-surface">
          Create a new form
        </Link>
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="min-h-44 rounded-lg border border-warm-gray bg-beige p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface"
              >
                <div className="h-2 w-16 animate-pulse rounded-full bg-primary/40" />
                <div className="mt-4 h-6 w-3/4 animate-pulse rounded bg-warm-gray/60 dark:bg-dark-border" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-warm-gray/50 dark:bg-dark-border-alt" />
                <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-warm-gray/50 dark:bg-dark-border-alt" />
                <div className="mt-6 flex items-center gap-2">
                  <div className="h-8 w-14 animate-pulse rounded bg-warm-gray/60 dark:bg-dark-border" />
                  <div className="h-8 w-16 animate-pulse rounded bg-warm-gray/60 dark:bg-dark-border" />
                  <div className="h-8 w-20 animate-pulse rounded bg-warm-gray/60 dark:bg-dark-border" />
                </div>
              </div>
            ))
          : null}
        {!loading && forms.map((form) => (
          <div key={form.id} className="rounded-lg border border-warm-gray bg-beige p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
            <div className="h-2 w-16 rounded-full bg-primary" />
            <h2 className="mt-4 line-clamp-2 font-display text-lg font-bold dark:text-dark-text">{form.title}</h2>
            <p className="mt-2 line-clamp-2 min-h-10 text-sm text-brown dark:text-dark-text/80">{form.description || 'No description'}</p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                <Link to={`/forms/${form.id}/edit`} className="rounded-md bg-brown-dark px-3 py-2 text-xs font-semibold text-white hover:bg-brown dark:bg-primary dark:hover:bg-primary-dark">
                  Edit
                </Link>
                <Link to={`/forms/${form.id}/public`} className="rounded-md border border-warm-gray px-3 py-2 text-xs font-semibold text-brown-dark transition hover:bg-brown-dark hover:text-white hover:border-brown-dark dark:border-dark-border-alt dark:text-dark-text dark:hover:bg-dark-text dark:hover:text-dark-bg">
                  Public
                </Link>
                <Link to={`/forms/${form.id}/analytics`} className="rounded-md border border-warm-gray px-3 py-2 text-xs font-semibold text-brown-dark transition hover:bg-brown-dark hover:text-white hover:border-brown-dark dark:border-dark-border-alt dark:text-dark-text dark:hover:bg-dark-text dark:hover:text-dark-bg">
                  Analytics
                </Link>
              </div>
              <button
                onClick={() => handleDelete(form.id, form.title)}
                disabled={deleting === form.id}
                className="rounded-md p-2 text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-rose-900/20"
                title="Delete form"
              >
                <Trash size={16} weight="duotone" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {status && status !== 'Loading forms...' ? <p className="text-sm text-brown dark:text-dark-text">{status}</p> : null}
      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4 border-t border-warm-gray pt-6 dark:border-dark-border">
          <p className="text-sm text-brown dark:text-dark-text">
            Showing {forms.length} of {total} forms
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-md border border-warm-gray px-3 py-2 text-sm font-semibold text-brown-dark transition hover:bg-beige disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border-alt dark:text-dark-text dark:hover:bg-dark-elevated"
            >
              <CaretLeft size={16} weight="bold" />
              Previous
            </button>
            <span className="text-sm text-brown dark:text-dark-text">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 rounded-md border border-warm-gray px-3 py-2 text-sm font-semibold text-brown-dark transition hover:bg-beige disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border-alt dark:text-dark-text dark:hover:bg-dark-elevated"
            >
              Next
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
