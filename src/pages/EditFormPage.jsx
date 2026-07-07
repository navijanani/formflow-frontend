import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

import { getForm, updateForm } from '../services/formService'

const questionTypes = ['Short answer', 'Paragraph', 'Multiple choice', 'Checkboxes', 'Dropdown']

const createQuestion = () => ({
  id: crypto.randomUUID(),
  text: 'Untitled question',
  type: questionTypes[0],
  required: false,
  options: ['Option 1'],
})

export default function EditFormPage() {
  const { formId } = useParams()
  const [form, setForm] = useState(null)
  const [questions, setQuestions] = useState([])
  const [status, setStatus] = useState('Loading form...')
  const [copyStatus, setCopyStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const loadedRef = useRef(false)

  useEffect(() => {
    getForm(formId)
      .then((data) => {
        setForm(data)
        setQuestions(
          (data.questions || []).map((q) => ({
            id: q.id,
            text: q.question_text,
            type: q.question_type,
            required: q.is_required,
            order: q.order_index,
            options: q.options.map((opt) => opt.option_text),
          })),
        )
        setStatus('')
        loadedRef.current = false
        setInitialized(true)
      })
      .catch(() => setStatus('Form not found or unavailable.'))
  }, [formId])

  useEffect(() => {
    if (!form || !initialized) {
      return undefined
    }

    if (!loadedRef.current) {
      loadedRef.current = true
      return undefined
    }

    setSaving(true)
    setStatus('Saving...')

    const timeoutId = window.setTimeout(async () => {
      try {
        await updateForm(formId, {
          title: form.title,
          description: form.description,
          is_public: form.is_public,
        })
        setStatus('Saved')
      } catch (error) {
        setStatus(error?.response?.data?.detail || 'Unable to auto-save form')
      } finally {
        setSaving(false)
      }
    }, 1800)

    return () => window.clearTimeout(timeoutId)
  }, [form?.title, form?.description, form?.is_public, formId, initialized])

  const saveForm = async (event) => {
    event.preventDefault()
    setSaving(true)
    setStatus('')

    try {
      const updated = await updateForm(formId, {
        title: form.title,
        description: form.description,
        is_public: form.is_public,
        questions: questions.map((q, idx) => ({
          question_text: q.text,
          question_type: q.type,
          is_required: q.required,
          order_index: idx,
          options: q.options.map((opt) => ({ option_text: opt })),
        })),
      })
      setForm(updated)
      setQuestions(
        (updated.questions || []).map((q) => ({
          id: q.id,
          text: q.question_text,
          type: q.question_type,
          required: q.is_required,
          order: q.order_index,
          options: q.options.map((opt) => opt.option_text),
        })),
      )
      setStatus('Saved')
    } catch (error) {
      setStatus(error?.response?.data?.detail || 'Unable to save form')
    } finally {
      setSaving(false)
    }
  }

  const updateQuestion = (questionId, patch) => {
    setQuestions((current) =>
      current.map((q) => {
        if (q.id !== questionId) return q
        const next = { ...q, ...patch }
        if (patch.type && !['Multiple choice', 'Checkboxes', 'Dropdown'].includes(patch.type)) {
          next.options = ['Option 1']
        }
        return next
      }),
    )
  }

  const addOption = (questionId) => {
    setQuestions((current) =>
      current.map((q) =>
        q.id === questionId
          ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
          : q,
      ),
    )
  }

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions((current) =>
      current.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.map((opt, i) => (i === optionIndex ? value : opt)) }
          : q,
      ),
    )
  }

  const removeOption = (questionId, optionIndex) => {
    setQuestions((current) =>
      current.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
          : q,
      ),
    )
  }

  if (!form) {
    return <p className="text-center text-sm text-brown dark:text-dark-text">{status}</p>
  }

  const shareUrl = `${window.location.origin}/forms/${form.public_id}/public`

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopyStatus('Copied')
      window.setTimeout(() => setCopyStatus(''), 1800)
    } catch {
      setCopyStatus('Copy failed')
    }
  }

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">Editing form #{form.id}</p>
          <h1 className="font-display text-2xl font-bold">Form settings</h1>
        </div>
        <div className="flex gap-2">
          <Link to={`/forms/${form.public_id}/public?preview=true`} className="rounded-md border border-warm-gray bg-cream px-4 py-2 text-sm font-semibold text-brown-dark dark:border-dark-border dark:bg-dark-elevated dark:text-dark-text">
            Preview
          </Link>
          <Link to={`/forms/${form.id}/analytics`} className="rounded-md border border-warm-gray bg-cream px-4 py-2 text-sm font-semibold text-brown-dark dark:border-dark-border dark:bg-dark-elevated dark:text-dark-text">
            Analytics
          </Link>
        </div>
      </div>
      <form onSubmit={saveForm} className="overflow-hidden rounded-lg border border-warm-gray bg-beige shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="h-2 bg-primary" />
        <div className="space-y-4 p-6">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-brown-dark dark:text-dark-text">Title</span>
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              className="w-full rounded-md border border-warm-gray bg-beige-dark px-3 py-2 outline-none focus:border-primary dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-brown-dark dark:text-dark-text">Description</span>
            <textarea
              value={form.description || ''}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              className="min-h-28 w-full resize-y rounded-md border border-warm-gray bg-beige-dark px-3 py-2 outline-none focus:border-primary dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
            />
          </label>
          <label className="flex items-center gap-3 text-sm font-medium text-brown-dark dark:text-dark-text">
            <input
              type="checkbox"
              checked={form.is_public}
              onChange={(event) => setForm((current) => ({ ...current, is_public: event.target.checked }))}
              className="h-4 w-4 rounded border-warm-gray text-primary"
            />
            Public form
          </label>
          <label className="flex items-center gap-3 text-sm font-medium text-brown-dark dark:text-dark-text">
            <input
              type="checkbox"
              checked={form.allow_response_edit}
              onChange={(event) => setForm((current) => ({ ...current, allow_response_edit: event.target.checked }))}
              className="h-4 w-4 rounded border-warm-gray text-primary"
            />
            Allow users to edit their responses
          </label>
          {status ? <p className="text-sm text-brown dark:text-dark-text">{status}</p> : null}
          <button disabled={saving} className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-70">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>

      <div className="rounded-lg border border-warm-gray bg-beige p-6 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Sharing</p>
            <h2 className="mt-1 font-display text-xl font-bold dark:text-dark-text">Public access</h2>
            <p className="mt-2 text-sm text-brown dark:text-dark-text">
              {form.is_public ? 'Anyone with this link can open and submit the form.' : 'This form is private. Turn on public access to share it.'}
            </p>
          </div>
          <label className="flex items-center gap-3 rounded-full border border-warm-gray px-4 py-2 text-sm font-semibold text-brown-dark dark:border-dark-border-alt dark:text-dark-text">
            <input
              type="checkbox"
              checked={form.is_public}
              onChange={(event) => setForm((current) => ({ ...current, is_public: event.target.checked }))}
              className="h-4 w-4 rounded border-warm-gray text-primary"
            />
            {form.is_public ? 'Public' : 'Private'}
          </label>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_180px]">
          <div className="space-y-3">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-brown-dark dark:text-dark-text">Shareable link</span>
              <input
                value={shareUrl}
                readOnly
                className="w-full rounded-md border border-warm-gray bg-beige-dark px-3 py-2 text-sm text-brown-dark outline-none dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyShareLink}
                disabled={!form.is_public}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-brown/20"
              >
                Copy link
              </button>
              <Link
                to={`/forms/${form.public_id}/public`}
                className="rounded-md border border-warm-gray px-4 py-2 text-sm font-semibold text-brown-dark transition hover:bg-brown-dark hover:text-white hover:border-brown-dark dark:border-dark-border-alt dark:text-dark-text dark:hover:bg-dark-text dark:hover:text-dark-bg"
              >
                Open public form
              </Link>
              {copyStatus ? <span className="px-2 py-2 text-sm text-brown dark:text-dark-text">{copyStatus}</span> : null}
            </div>
          </div>

          <div className="rounded-lg border border-warm-gray bg-beige-dark p-4 text-center dark:border-dark-border-alt dark:bg-dark-elevated">
            <div className={form.is_public ? '' : 'opacity-30'}>
              <QRCodeSVG value={shareUrl} size={148} level="M" includeMargin />
            </div>
            <p className="mt-3 text-xs font-medium text-brown dark:text-dark-text">QR code</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Questions</h2>
          <button
            type="button"
            onClick={() => setQuestions((current) => [...current, createQuestion()])}
            className="rounded-md border border-warm-gray bg-cream px-4 py-2 text-sm font-semibold text-brown-dark transition hover:bg-brown-dark hover:text-white hover:border-brown-dark"
          >
            Add question
          </button>
        </div>
        {questions.map((question, index) => {
          const hasOptions = ['Multiple choice', 'Checkboxes', 'Dropdown'].includes(question.type)
          return (
            <div key={question.id} className="rounded-lg border border-warm-gray bg-beige p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-brown dark:text-dark-text">Question {index + 1}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_190px]">
                <input
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                  className="rounded-md border border-warm-gray bg-beige-dark px-3 py-2 outline-none focus:border-primary dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
                  placeholder="Question"
                />
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(question.id, { type: e.target.value })}
                  className="rounded-md border border-warm-gray bg-beige-dark px-3 py-2 text-sm outline-none focus:border-primary dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
                >
                  {questionTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
              {hasOptions ? (
                <div className="mt-4 space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full border border-brown dark:border-dark-text" />
                      <input
                        value={option}
                        onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                        className="flex-1 rounded-md border border-warm-gray bg-beige-dark px-3 py-2 text-sm outline-none focus:border-primary dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(question.id, optionIndex)}
                        className="rounded-md px-2 py-2 text-sm font-semibold text-brown hover:bg-beige dark:text-dark-text dark:hover:bg-dark-elevated"
                        disabled={question.options.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(question.id)}
                    className="rounded-md px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
                  >
                    Add option
                  </button>
                </div>
              ) : null}
              <div className="mt-5 flex items-center justify-end border-t border-warm-gray pt-4 dark:border-dark-border">
                <label className="flex items-center gap-2 text-sm text-brown dark:text-dark-text">
                  Required
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                    className="h-4 w-4 rounded border-warm-gray text-primary"
                  />
                </label>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
