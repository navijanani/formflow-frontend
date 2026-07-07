import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CaretLeft, CaretRight, Eye } from '@phosphor-icons/react'

import { getPublicForm, getPublicResponse, submitPublicForm, updatePublicResponse } from '../services/formService'
import { useAuth } from '../hooks/useAuth'
import { useDebounce } from '../hooks/useDebounce'

function normalizeType(type) {
  return String(type || 'short answer').toLowerCase().replaceAll('_', ' ')
}

function isEmptyAnswer(answer) {
  return answer === undefined || answer === null || answer === '' || (Array.isArray(answer) && answer.length === 0)
}

function QuestionField({ question, value, error, onChange, disabled = false }) {
  const type = normalizeType(question.question_type)
  const options = question.options || []
  const baseInputClass = [
    'mt-4 w-full rounded-md border px-3 py-2 outline-none transition focus:border-primary',
    error ? 'border-rose-300 bg-rose-50' : 'border-warm-gray bg-beige-dark dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text',
    disabled ? 'cursor-not-allowed opacity-60' : '',
  ].join(' ')

  const toggleCheckbox = (optionText) => {
    const current = Array.isArray(value) ? value : []
    onChange(current.includes(optionText) ? current.filter((item) => item !== optionText) : [...current, optionText])
  }

  return (
    <div className="rounded-lg border border-warm-gray bg-cream p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
      <p className="text-sm font-semibold text-brown-dark dark:text-dark-text">
        {question.question_text}
        {question.is_required ? <span className="text-rose-600"> *</span> : null}
      </p>

      {type === 'paragraph' ? (
        <textarea
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          className={`${baseInputClass} min-h-28 resize-y`}
          aria-invalid={Boolean(error)}
          disabled={disabled}
        />
      ) : null}

      {type === 'multiple choice' || type === 'radio' ? (
        <div className="mt-4 space-y-3">
          {options.map((option) => (
            <label key={option.id} className={`flex items-center gap-3 text-sm text-brown-dark dark:text-dark-text ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={value === option.option_text}
                onChange={() => onChange(option.option_text)}
                className="h-4 w-4 border-warm-gray text-primary"
                disabled={disabled}
              />
              {option.option_text}
            </label>
          ))}
        </div>
      ) : null}

      {type === 'checkboxes' || type === 'checkbox' ? (
        <div className="mt-4 space-y-3">
          {options.map((option) => (
            <label key={option.id} className={`flex items-center gap-3 text-sm text-brown-dark dark:text-dark-text ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                checked={Array.isArray(value) && value.includes(option.option_text)}
                onChange={() => toggleCheckbox(option.option_text)}
                className="h-4 w-4 rounded border-warm-gray text-primary"
                disabled={disabled}
              />
              {option.option_text}
            </label>
          ))}
        </div>
      ) : null}

      {type === 'dropdown' || type === 'select' ? (
        <select
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          className={baseInputClass}
          aria-invalid={Boolean(error)}
          disabled={disabled}
        >
          <option value="">Choose an option</option>
          {options.map((option) => (
            <option key={option.id} value={option.option_text}>
              {option.option_text}
            </option>
          ))}
        </select>
      ) : null}

      {type === 'number' ? (
        <input
          type="number"
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          className={baseInputClass}
          aria-invalid={Boolean(error)}
          disabled={disabled}
        />
      ) : null}

      {!['paragraph', 'multiple choice', 'radio', 'checkboxes', 'checkbox', 'dropdown', 'select', 'number'].includes(type) ? (
        <input
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          className={baseInputClass}
          aria-invalid={Boolean(error)}
          disabled={disabled}
        />
      ) : null}

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
    </div>
  )
}

export default function PublicFormPage() {
  const { publicId } = useParams()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const isPreviewMode = searchParams.get('preview') === 'true'
  const [form, setForm] = useState(null)
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('Loading form...')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [responseId, setResponseId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [visibleSectionIds, setVisibleSectionIds] = useState(new Set())
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  // Debounce answers to avoid evaluating logic rules on every keystroke
  const debouncedAnswers = useDebounce(answers, 300)

  useEffect(() => {
    getPublicForm(publicId)
      .then((data) => {
        setForm(data)
        setStatus('')
      })
      .catch(() => setStatus('This form is not available.'))
  }, [publicId])

  const sortedQuestions = useMemo(
    () => [...(form?.questions || [])].sort((first, second) => first.order_index - second.order_index),
    [form],
  )

  const sortedSections = useMemo(
    () => [...(form?.sections || [])].sort((first, second) => first.order_index - second.order_index),
    [form],
  )

  // Group questions by section
  const questionsWithoutSection = useMemo(
    () => sortedQuestions.filter((q) => !q.section_id),
    [sortedQuestions],
  )

  const questionsBySection = useMemo(
    () =>
      sortedSections.map((section) => ({
        section,
        questions: sortedQuestions.filter((q) => q.section_id === section.id),
      })),
    [sortedSections, sortedQuestions],
  )

  // Evaluate logic rules and update visible sections
  useEffect(() => {
    if (!form || !sortedQuestions.length) return

    const newVisibleSections = new Set()
    
    sortedQuestions.forEach((question) => {
      const answer = debouncedAnswers[question.id]
      if (!answer || !question.logic_rules || question.logic_rules.length === 0) return

      // Find matching logic rule
      const matchingRule = question.logic_rules.find((rule) => {
        if (Array.isArray(answer)) {
          return answer.includes(rule.trigger_option)
        }
        return answer === rule.trigger_option
      })

      if (matchingRule && matchingRule.target_section_id) {
        newVisibleSections.add(matchingRule.target_section_id)
      }
    })

    setVisibleSectionIds(newVisibleSections)
  }, [debouncedAnswers, form, sortedQuestions])

  // Filter visible sections
  const visibleQuestionsBySection = useMemo(
    () => questionsBySection.filter(({ section }) => visibleSectionIds.has(section.id)),
    [questionsBySection, visibleSectionIds],
  )

  // Build pages: first page = questions without section, then each visible section is a page
  const pages = useMemo(() => {
    const result = []
    
    // First page: questions without section (if any)
    if (questionsWithoutSection.length > 0) {
      result.push({
        type: 'intro',
        title: null,
        description: null,
        questions: questionsWithoutSection,
      })
    }
    
    // Each visible section is a page
    visibleQuestionsBySection.forEach(({ section, questions }) => {
      result.push({
        type: 'section',
        title: section.title,
        description: section.description,
        sectionId: section.id,
        questions,
      })
    })
    
    return result
  }, [questionsWithoutSection, visibleQuestionsBySection])

  // Keep currentPageIndex in bounds
  useEffect(() => {
    if (currentPageIndex >= pages.length && pages.length > 0) {
      setCurrentPageIndex(pages.length - 1)
    }
  }, [pages.length, currentPageIndex])

  const currentPage = pages[currentPageIndex] || null
  const isFirstPage = currentPageIndex === 0
  const isLastPage = currentPageIndex === pages.length - 1

  const parseAnswerText = (answerText) => {
    try {
      // Try to parse as JSON (for checkboxes)
      return JSON.parse(answerText)
    } catch {
      // Return as string if not JSON
      return answerText
    }
  }

  const loadResponse = async (respId) => {
    try {
      const response = await getPublicResponse(publicId, respId)
      const loadedAnswers = {}
      response.answers.forEach((answer) => {
        loadedAnswers[answer.question_id] = parseAnswerText(answer.answer_text)
      })
      setAnswers(loadedAnswers)
      setResponseId(respId)
      setIsEditing(true)
      setSubmitted(false)
      setCurrentPageIndex(0)
      setStatus('')
    } catch (error) {
      setStatus('Unable to load response')
    }
  }

  const validate = () => {
    const nextErrors = {}

    sortedQuestions.forEach((question) => {
      if (question.is_required && isEmptyAnswer(answers[question.id])) {
        nextErrors[question.id] = 'This question is required.'
      }
    })

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const validateCurrentPage = () => {
    if (!currentPage) return true
    
    const nextErrors = {}
    
    currentPage.questions.forEach((question) => {
      if (question.is_required && isEmptyAnswer(answers[question.id])) {
        nextErrors[question.id] = 'This question is required.'
      }
    })
    
    setErrors((current) => ({ ...current, ...nextErrors }))
    return Object.keys(nextErrors).length === 0
  }

  const goToNextPage = () => {
    if (!validateCurrentPage()) {
      setStatus('Please answer all required questions on this page.')
      return
    }
    
    setStatus('')
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToPreviousPage = () => {
    setStatus('')
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    setStatus('')

    if (!validate()) {
      setStatus('Please answer all required questions.')
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        answers: sortedQuestions.map((question) => ({
          question_id: question.id,
          answer: answers[question.id] ?? null,
        })),
      }

      let result
      if (isEditing && responseId) {
        result = await updatePublicResponse(publicId, responseId, payload)
        setStatus('Your response has been updated.')
      } else {
        result = await submitPublicForm(publicId, payload)
        setResponseId(result.response_id)
        setStatus('Your response has been recorded.')
      }
      
      setSubmitted(true)
      setIsEditing(false)
    } catch (error) {
      setStatus(error?.response?.data?.detail || 'Unable to submit response')
    } finally {
      setSubmitting(false)
    }
  }

  if (!form) {
    return <p className="text-center text-sm text-brown dark:text-dark-text">{status}</p>
  }

  if (submitted) {
    return (
      <section className="mx-auto max-w-2xl">
        {user ? (
          <div className="mb-4">
            <Link
              to={`/forms/${form.id}/edit`}
              className="inline-flex items-center gap-2 rounded-md border border-warm-gray bg-cream px-4 py-2 text-sm font-semibold text-brown-dark transition hover:bg-beige dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text dark:hover:bg-dark-surface"
            >
              <ArrowLeft size={16} weight="bold" />
              Back to Edit
            </Link>
          </div>
        ) : null}
        <div className="overflow-hidden rounded-lg border border-warm-gray bg-beige shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <div className="h-2 bg-primary" />
          <div className="p-6">
            <h1 className="font-display text-2xl font-bold dark:text-dark-text">Response submitted</h1>
            <p className="mt-3 text-brown dark:text-dark-text">{status}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {form.allow_response_edit ? (
                <button
                  type="button"
                  onClick={() => loadResponse(responseId)}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  Edit this response
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setAnswers({})
                  setErrors({})
                  setResponseId(null)
                  setIsEditing(false)
                  setCurrentPageIndex(0)
                  setStatus('')
                }}
                className="rounded-md border border-warm-gray px-4 py-2 text-sm font-semibold text-brown-dark transition hover:bg-brown-dark hover:text-white hover:border-brown-dark dark:border-dark-border-alt dark:text-dark-text dark:hover:bg-dark-text dark:hover:text-dark-bg"
              >
                Submit another response
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-2xl">
      {user && form ? (
        <div className="mb-4">
          <Link
            to={`/forms/${form.id}/edit`}
            className="inline-flex items-center gap-2 rounded-md border border-warm-gray bg-cream px-4 py-2 text-sm font-semibold text-brown-dark transition hover:bg-beige dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text dark:hover:bg-dark-surface"
          >
            <ArrowLeft size={16} weight="bold" />
            Back to Edit
          </Link>
        </div>
      ) : null}
      <form onSubmit={(e) => { if (isPreviewMode) e.preventDefault(); else submit(e); }} className="space-y-4" noValidate>
        {isPreviewMode ? (
          <div className="rounded-md border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-medium text-primary dark:border-primary/30 dark:bg-primary/20">
            <div className="flex items-center gap-2">
              <Eye size={20} weight="duotone" />
              <span>Preview Mode - This form cannot be submitted in preview mode</span>
            </div>
          </div>
        ) : isEditing ? (
          <div className="rounded-md border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-medium text-primary dark:border-primary/30 dark:bg-primary/20">
            You are editing your previous response
          </div>
        ) : null}

        {/* Progress indicator */}
        {pages.length > 1 ? (
          <div className="rounded-md border border-warm-gray bg-beige px-4 py-3 dark:border-dark-border dark:bg-dark-surface">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-brown-dark dark:text-dark-text">
                Page {currentPageIndex + 1} of {pages.length}
              </span>
              <div className="flex gap-1">
                {pages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 w-8 rounded-full transition ${
                      idx === currentPageIndex
                        ? 'bg-primary'
                        : idx < currentPageIndex
                        ? 'bg-primary/50'
                        : 'bg-warm-gray dark:bg-dark-border-alt'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-lg border border-warm-gray bg-beige shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <div className="h-2 bg-primary" />
          <div className="p-6">
            <h1 className="font-display text-3xl font-bold dark:text-dark-text">{form.title}</h1>
            {form.description ? <p className="mt-3 text-brown dark:text-dark-text">{form.description}</p> : null}
          </div>
        </div>

        {/* Current page content */}
        {currentPage ? (
          <div className="space-y-4">
            {/* Section header (if this page has a section) */}
            {currentPage.type === 'section' ? (
              <div className="rounded-lg border-2 border-primary/30 bg-primary/5 px-5 py-4 dark:bg-primary/10">
                <h2 className="font-display text-xl font-bold text-primary">{currentPage.title}</h2>
                {currentPage.description ? (
                  <p className="mt-2 text-sm text-brown dark:text-dark-text/70">{currentPage.description}</p>
                ) : null}
              </div>
            ) : null}

            {/* Questions on this page */}
            {currentPage.questions.map((question) => (
              <QuestionField
                key={question.id}
                question={question}
                value={answers[question.id]}
                error={errors[question.id]}
                onChange={(answer) => {
                  setAnswers((current) => ({ ...current, [question.id]: answer }))
                  setErrors((current) => ({ ...current, [question.id]: '' }))
                }}
                disabled={isPreviewMode}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-warm-gray bg-cream p-5 text-sm text-brown shadow-sm dark:border-dark-border dark:bg-dark-surface dark:text-dark-text">
            No questions have been added yet.
          </div>
        )}

        {status ? <p className="rounded-md bg-beige px-4 py-3 text-sm text-brown-dark shadow-sm dark:bg-dark-surface dark:text-dark-text">{status}</p> : null}
        
        {/* Navigation and submit buttons */}
        {pages.length > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={isFirstPage}
              className="inline-flex items-center gap-2 rounded-md border border-warm-gray px-4 py-2 text-sm font-semibold text-brown-dark transition hover:bg-beige disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark-border-alt dark:text-dark-text dark:hover:bg-dark-surface"
            >
              <CaretLeft size={16} weight="bold" />
              Previous
            </button>

            {isLastPage ? (
              <button
                type="submit"
                disabled={submitting || sortedQuestions.length === 0 || isPreviewMode}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update' : 'Submit')}
              </button>
            ) : (
              <button
                type="button"
                onClick={goToNextPage}
                disabled={isPreviewMode}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                Next
                <CaretRight size={16} weight="bold" />
              </button>
            )}
          </div>
        ) : null}
      </form>
    </section>
  )
}
