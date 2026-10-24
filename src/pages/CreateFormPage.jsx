import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { createForm } from '../services/formService'

const questionTypes = ['Short answer', 'Paragraph', 'Multiple choice', 'Checkboxes', 'Dropdown']
const draftKey = 'formflow_create_form_draft'
const defaultForm = {
  title: 'Untitled form',
  description: '',
  is_public: true,
  allow_response_edit: true,
}

const createSection = () => ({
  id: crypto.randomUUID(),
  title: 'Section title',
  description: '',
})

const createQuestion = (sectionId = null) => ({
  id: crypto.randomUUID(),
  text: 'Untitled question',
  type: questionTypes[0],
  required: false,
  sectionId,
  options: ['Option 1'],
  logicRules: [], // { trigger_option: string, action_type: 'go_to_section', target_section_id: number }
})

function loadDraft() {
  try {
    const draft = JSON.parse(window.localStorage.getItem(draftKey))
    if (draft?.form && Array.isArray(draft?.questions)) {
      return {
        form: draft.form,
        questions: draft.questions,
        sections: Array.isArray(draft.sections) ? draft.sections : [],
      }
    }
  } catch {
    window.localStorage.removeItem(draftKey)
  }

  return { form: defaultForm, questions: [createQuestion()], sections: [] }
}

function SortableQuestion({ question, index, sections, onChange, onAddOption, onOptionChange, onRemoveOption, onLogicChange, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id })
  const hasOptions = ['Multiple choice', 'Checkboxes', 'Dropdown'].includes(question.type)
  const canHaveLogic = ['Multiple choice', 'Dropdown'].includes(question.type)
  const hasLogic = question.logicRules && question.logicRules.length > 0

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={[
        'rounded-lg border border-warm-gray bg-beige p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface',
        isDragging ? 'relative z-10 shadow-warm ring-2 ring-primary/30' : '',
      ].join(' ')}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab rounded-md border border-warm-gray px-3 py-1 text-sm text-brown active:cursor-grabbing"
          aria-label={`Drag question ${index + 1}`}
        >
          ::
        </button>
        <span className="text-xs font-semibold uppercase tracking-wide text-brown">Question {index + 1}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_190px]">
        <input
          value={question.text}
          onChange={(event) => onChange(question.id, { text: event.target.value })}
          className="rounded-md border border-warm-gray bg-beige-dark px-3 py-2 outline-none focus:border-primary dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
          placeholder="Question"
        />
        <select
          value={question.type}
          onChange={(event) => onChange(question.id, { type: event.target.value })}
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
              <span className="h-3 w-3 rounded-full border border-brown" />
              <input
                value={option}
                onChange={(event) => onOptionChange(question.id, optionIndex, event.target.value)}
                className="flex-1 rounded-md border border-warm-gray bg-beige-dark px-3 py-2 text-sm outline-none focus:border-primary dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
                placeholder={`Option ${optionIndex + 1}`}
              />
              <button
                type="button"
                onClick={() => onRemoveOption(question.id, optionIndex)}
                className="rounded-md px-2 py-2 text-sm font-semibold text-brown hover:bg-beige dark:text-dark-text dark:hover:bg-dark-elevated"
                disabled={question.options.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onAddOption(question.id)}
            className="rounded-md px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            Add option
          </button>
        </div>
      ) : null}

      {canHaveLogic && sections.length > 0 ? (
        <div className="mt-4 space-y-3 rounded-md border border-primary/30 bg-primary/5 p-4 dark:bg-primary/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">Logic Rules</span>
            {hasLogic ? (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                {question.logicRules.length}
              </span>
            ) : null}
          </div>
          {question.options.map((option, optionIndex) => {
            const existingRule = question.logicRules?.find((r) => r.trigger_option === option)
            return (
              <div key={optionIndex} className="flex items-center gap-2 text-sm">
                <span className="text-brown dark:text-dark-text">If answer is</span>
                <span className="font-semibold text-brown-dark dark:text-dark-text">"{option}"</span>
                <span className="text-brown dark:text-dark-text">→</span>
                <select
                  value={existingRule?.target_section_id || ''}
                  onChange={(e) => onLogicChange(question.id, option, e.target.value || null)}
                  className="flex-1 rounded-md border border-primary/50 bg-white px-2 py-1 text-xs outline-none focus:border-primary dark:bg-dark-elevated dark:text-dark-text"
                >
                  <option value="">Continue to next</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      Go to: {section.title}
                    </option>
                  ))}
                </select>
              </div>
            )
          })}
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between border-t border-warm-gray pt-4 dark:border-dark-border-alt">
        <button
          type="button"
          onClick={() => onDelete(question.id)}
          className="rounded-md px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
        >
          Delete question
        </button>
        <label className="flex items-center gap-2 text-sm text-brown dark:text-dark-text">
          Required
          <input
            type="checkbox"
            checked={question.required}
            onChange={(event) => onChange(question.id, { required: event.target.checked })}
            className="h-4 w-4 rounded border-warm-gray text-primary"
          />
        </label>
      </div>
    </div>
  )
}

// Memoize to prevent re-renders when other questions change
const MemoizedSortableQuestion = memo(SortableQuestion)

function PreviewField({ question }) {
  const hasOptions = ['Multiple choice', 'Checkboxes', 'Dropdown'].includes(question.type)

  return (
    <div className="rounded-lg border border-warm-gray bg-cream p-4 dark:border-dark-border-alt dark:bg-dark-elevated">
      <p className="text-sm font-semibold text-brown-dark dark:text-dark-text">
        {question.text || 'Untitled question'}
        {question.required ? <span className="text-rose-600"> *</span> : null}
      </p>
      {question.type === 'Paragraph' ? (
        <textarea className="mt-3 min-h-20 w-full rounded-md border border-warm-gray bg-beige-dark px-3 py-2 dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text" disabled />
      ) : null}
      {question.type === 'Short answer' ? (
        <input className="mt-3 w-full rounded-md border border-warm-gray bg-beige-dark px-3 py-2 dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text" disabled />
      ) : null}
      {question.type === 'Dropdown' ? (
        <select className="mt-3 w-full rounded-md border border-warm-gray bg-beige-dark px-3 py-2 text-sm dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text" disabled>
          {question.options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : null}
      {hasOptions && question.type !== 'Dropdown' ? (
        <div className="mt-3 space-y-2">
          {question.options.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-brown dark:text-dark-text/80">
              <input type={question.type === 'Checkboxes' ? 'checkbox' : 'radio'} disabled />
              {option || 'Option'}
            </label>
          ))}
        </div>
      ) : null}
    </div>
  )
}

// Memoize preview field
const MemoizedPreviewField = memo(PreviewField)

export default function CreateFormPage() {
  const navigate = useNavigate()
  const draft = useMemo(loadDraft, [])
  const [form, setForm] = useState(draft.form)
  const [sections, setSections] = useState(draft.sections)
  const [questions, setQuestions] = useState(draft.questions)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [draftStatus, setDraftStatus] = useState('Draft saved locally')
  const questionIds = useMemo(() => questions.map((question) => question.id), [questions])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    setDraftStatus('Saving draft...')
    const timeoutId = window.setTimeout(() => {
      window.localStorage.setItem(draftKey, JSON.stringify({ form, sections, questions, savedAt: new Date().toISOString() }))
      setDraftStatus('Draft saved locally')
    }, 1500)

    return () => window.clearTimeout(timeoutId)
  }, [form, sections, questions])

  const updateQuestion = useCallback((questionId, patch) => {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question
        }

        const nextQuestion = { ...question, ...patch }
        if (patch.type && !['Multiple choice', 'Checkboxes', 'Dropdown'].includes(patch.type)) {
          nextQuestion.options = ['Option 1']
        }
        return nextQuestion
      }),
    )
  }, [])

  const updateSection = useCallback((sectionId, patch) => {
    setSections((current) =>
      current.map((section) => (section.id === sectionId ? { ...section, ...patch } : section)),
    )
  }, [])

  const deleteSection = useCallback((sectionId) => {
    // Move questions from this section to no section
    setQuestions((current) =>
      current.map((q) => (q.sectionId === sectionId ? { ...q, sectionId: null } : q)),
    )
    setSections((current) => current.filter((s) => s.id !== sectionId))
  }, [])

  const updateLogic = useCallback((questionId, triggerOption, targetSectionId) => {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question
        }

        const existingRules = question.logicRules || []
        let newRules

        if (targetSectionId === null) {
          // Remove rule for this option
          newRules = existingRules.filter((r) => r.trigger_option !== triggerOption)
        } else {
          // Add or update rule for this option
          const ruleIndex = existingRules.findIndex((r) => r.trigger_option === triggerOption)
          if (ruleIndex >= 0) {
            newRules = [...existingRules]
            newRules[ruleIndex] = {
              trigger_option: triggerOption,
              action_type: 'go_to_section',
              target_section_id: targetSectionId,
            }
          } else {
            newRules = [
              ...existingRules,
              {
                trigger_option: triggerOption,
                action_type: 'go_to_section',
                target_section_id: targetSectionId,
              },
            ]
          }
        }

        return { ...question, logicRules: newRules }
      }),
    )
  }, [])

  const deleteQuestion = useCallback((questionId) => {
    setQuestions((current) => current.filter((q) => q.id !== questionId))
  }, [])

  const addOption = useCallback((questionId) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? { ...question, options: [...question.options, `Option ${question.options.length + 1}`] }
          : question,
      ),
    )
  }, [])

  const updateOption = useCallback((questionId, optionIndex, value) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option, index) => (index === optionIndex ? value : option)),
            }
          : question,
      ),
    )
  }, [])

  const removeOption = useCallback((questionId, optionIndex) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? { ...question, options: question.options.filter((_, index) => index !== optionIndex) }
          : question,
      ),
    )
  }, [])

  const handleDragEnd = useCallback(({ active, over }) => {
    if (!over || active.id === over.id) {
      return
    }

    setQuestions((current) => {
      const oldIndex = current.findIndex((question) => question.id === active.id)
      const newIndex = current.findIndex((question) => question.id === over.id)
      return arrayMove(current, oldIndex, newIndex)
    })
  }, [])

  const saveForm = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        ...form,
        sections: sections.map((s, idx) => ({
          title: s.title,
          description: s.description || '',
          order_index: idx,
          client_id: s.id,  // Send frontend UUID as client_id
        })),
        questions: questions.map((q, idx) => ({
          question_text: q.text,
          question_type: q.type,
          is_required: q.required,
          order_index: idx,
          section_client_id: q.sectionId || null,  // Send frontend section UUID
          options: q.options.map((opt) => ({ option_text: opt })),
          logic_rules: (q.logicRules || []).map((rule) => ({
            trigger_option: rule.trigger_option,
            action_type: rule.action_type,
            target_section_client_id: rule.target_section_id || null,  // Send frontend section UUID
          })),
        })),
      }
      const created = await createForm(payload)
      window.localStorage.removeItem(draftKey)
      navigate(`/forms/${created.id}/edit`)
    } catch (error) {
      setError(error?.response?.data?.detail || 'Unable to create form')
    } finally {
      setSaving(false)
    }
  }

  // Group questions by section - memoized to avoid repeated filtering
  const questionsWithoutSection = useMemo(
    () => questions.filter((q) => !q.sectionId),
    [questions]
  )
  
  const questionsBySection = useMemo(
    () => sections.map((section) => ({
      section,
      questions: questions.filter((q) => q.sectionId === section.id),
    })),
    [sections, questions]
  )

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <form onSubmit={saveForm} className="space-y-5">
        <div className="rounded-md border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-medium text-primary dark:border-primary/30 dark:bg-primary/20">
          {draftStatus}
        </div>
        <div className="overflow-hidden rounded-lg border border-warm-gray bg-beige shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <div className="h-2 bg-primary" />
          <div className="space-y-4 p-6">
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              className="font-display w-full border-0 border-b border-warm-gray px-0 pb-3 text-3xl font-bold outline-none focus:border-primary dark:border-dark-border-alt dark:bg-transparent dark:text-dark-text"
              required
            />
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              className="min-h-20 w-full resize-y rounded-md border border-warm-gray bg-beige-dark px-3 py-2 text-sm outline-none focus:border-primary dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text"
              placeholder="Form description"
            />
            <label className="flex items-center gap-3 text-sm font-medium text-brown-dark dark:text-dark-text">
              <input
                type="checkbox"
                checked={form.is_public}
                onChange={(event) => setForm((current) => ({ ...current, is_public: event.target.checked }))}
                className="h-4 w-4 rounded border-warm-gray text-primary"
              />
              Accept public responses
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-brown-dark dark:text-dark-text">
              <input
                type="checkbox"
                checked={form.allow_response_edit}
                onChange={(event) => setForm((current) => ({ ...current, allow_response_edit: event.target.checked }))}
                className="h-4 w-4 rounded border-warm-gray text-primary"
              />
              Let people edit their answers after submitting
            </label>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questionIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {/* Questions without section */}
              {questionsWithoutSection.map((question, index) => (
                <MemoizedSortableQuestion
                  key={question.id}
                  question={question}
                  index={questions.indexOf(question)}
                  sections={sections}
                  onChange={updateQuestion}
                  onAddOption={addOption}
                  onOptionChange={updateOption}
                  onRemoveOption={removeOption}
                  onLogicChange={updateLogic}
                  onDelete={deleteQuestion}
                />
              ))}
              
              {questionsWithoutSection.length > 0 && sections.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setSections((current) => [...current, createSection()])}
                  className="w-full rounded-md border border-dashed border-warm-gray bg-transparent px-4 py-3 text-sm font-semibold text-brown transition hover:bg-beige dark:border-dark-border-alt dark:text-dark-text dark:hover:bg-dark-surface"
                >
                  ＋ Add section
                </button>
              ) : null}

              {/* Sections with their questions */}
              {questionsBySection.map(({ section, questions: sectionQuestions }) => (
                <div key={section.id} className="space-y-4">
                  {/* Section header */}
                  <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 dark:bg-primary/10">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-3">
                        <input
                          value={section.title}
                          onChange={(e) => updateSection(section.id, { title: e.target.value })}
                          className="w-full border-0 border-b border-primary/30 bg-transparent pb-2 text-lg font-bold text-primary outline-none focus:border-primary"
                          placeholder="Section title"
                        />
                        <input
                          value={section.description}
                          onChange={(e) => updateSection(section.id, { description: e.target.value })}
                          className="w-full border-0 bg-transparent text-sm text-brown outline-none dark:text-dark-text/80"
                          placeholder="Section description (optional)"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteSection(section.id)}
                        className="rounded-md px-2 py-1 text-xs font-semibold text-brown hover:bg-primary/20 dark:text-dark-text"
                      >
                        Delete section
                      </button>
                    </div>
                  </div>

                  {/* Questions in this section */}
                  {sectionQuestions.map((question) => (
                    <MemoizedSortableQuestion
                      key={question.id}
                      question={question}
                      index={questions.indexOf(question)}
                      sections={sections}
                      onChange={updateQuestion}
                      onAddOption={addOption}
                      onOptionChange={updateOption}
                      onRemoveOption={removeOption}
                      onLogicChange={updateLogic}
                      onDelete={deleteQuestion}
                    />
                  ))}

                  {/* Add question to this section */}
                  <button
                    type="button"
                    onClick={() => setQuestions((current) => [...current, createQuestion(section.id)])}
                    className="w-full rounded-md border border-dashed border-primary/50 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20"
                  >
                    ＋ Add question to this section
                  </button>

                  {/* Add another section */}
                  <button
                    type="button"
                    onClick={() => setSections((current) => [...current, createSection()])}
                    className="w-full rounded-md border border-dashed border-warm-gray bg-transparent px-4 py-3 text-sm font-semibold text-brown transition hover:bg-beige dark:border-dark-border-alt dark:text-dark-text dark:hover:bg-dark-surface"
                  >
                    ＋ Add section
                  </button>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {error ? <p className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setQuestions((current) => [...current, createQuestion()])}
              className="rounded-md border border-warm-gray bg-cream px-4 py-2 text-sm font-semibold text-brown-dark transition hover:bg-brown-dark hover:text-white hover:border-brown-dark dark:border-dark-border-alt dark:bg-dark-elevated dark:text-dark-text dark:hover:bg-dark-text dark:hover:text-dark-bg"
            >
              Add question
            </button>
            {sections.length === 0 ? (
              <button
                type="button"
                onClick={() => setSections((current) => [...current, createSection()])}
                className="rounded-md border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
              >
                Add section
              </button>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Create form'}
          </button>
        </div>
      </form>

      <aside className="h-fit rounded-lg border border-warm-gray bg-beige p-4 lg:sticky lg:top-24 dark:border-dark-border dark:bg-dark-surface">
        <p className="text-sm font-semibold text-primary">Live preview</p>
        <div className="mt-4 space-y-3">
          <div className="overflow-hidden rounded-lg border border-warm-gray bg-cream dark:border-dark-border-alt dark:bg-dark-surface">
            <div className="h-2 bg-primary" />
            <div className="p-4">
              <h2 className="font-display text-xl font-bold dark:text-dark-text">{form.title || 'Untitled form'}</h2>
              {form.description ? <p className="mt-2 text-sm text-brown dark:text-dark-text">{form.description}</p> : null}
            </div>
          </div>
          
          {/* Questions without section */}
          {questionsWithoutSection.map((question) => (
            <MemoizedPreviewField key={question.id} question={question} />
          ))}
          
          {/* Sections with their questions */}
          {questionsBySection.map(({ section, questions: sectionQuestions }) => (
            <div key={section.id} className="space-y-3">
              <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 dark:bg-primary/10">
                <h3 className="font-semibold text-primary">{section.title || 'Section'}</h3>
                {section.description ? (
                  <p className="mt-1 text-xs text-brown dark:text-dark-text/70">{section.description}</p>
                ) : null}
              </div>
              {sectionQuestions.map((question) => (
                <MemoizedPreviewField key={question.id} question={question} />
              ))}
            </div>
          ))}
        </div>
      </aside>
    </section>
  )
}
