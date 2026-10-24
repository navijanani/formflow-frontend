import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { downloadExcel, getFormAnalytics } from '../services/formService'

const chartColors = ['#7c3aed', '#2563eb', '#059669', '#f59e0b', '#dc2626', '#0891b2']

function groupTimeline(items) {
  const grouped = items.reduce((acc, item) => {
    const date = new Date(item.submitted_at).toLocaleDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  return Object.entries(grouped).map(([date, responses]) => ({ date, responses }))
}

function QuestionChart({ question }) {
  const chartData = question.answer_distribution.map((item) => ({
    name: item.answer || 'Blank',
    count: item.count,
    percentage: item.percentage,
  }))

  return (
    <div className="rounded-lg border border-warm-gray bg-beige p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-brown-dark dark:text-dark-text">{question.question_text}</h2>
          <p className="mt-1 text-sm text-brown dark:text-dark-text/70">
            {question.question_type} · {question.total_responses} responses
          </p>
        </div>
        {question.is_required ? (
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">Required</span>
        ) : null}
      </div>

      {chartData.length ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="count" nameKey="name" outerRadius={88} label>
                  {chartData.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 lg:col-span-2">
            {chartData.map((item, index) => (
              <div key={item.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: chartColors[index % chartColors.length] }}
                    />
                    {item.name}
                  </span>
                  <span>
                    {item.count} · {Math.round(item.percentage)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-beige-dark dark:bg-dark-elevated">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-5 rounded-md bg-beige-dark px-4 py-3 text-sm text-brown dark:bg-dark-elevated dark:text-dark-text">No answers yet.</p>
      )}
    </div>
  )
}

export default function AnalyticsPage() {
  const { formId } = useParams()
  const [analytics, setAnalytics] = useState(null)
  const [status, setStatus] = useState('Loading analytics...')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    getFormAnalytics(formId)
      .then((data) => {
        setAnalytics(data)
        setStatus('')
      })
      .catch(() => setStatus('There are no analytics for this form yet.'))
  }, [formId])

  const handleExport = async () => {
    setExporting(true)
    try {
      await downloadExcel(formId)
    } catch {
      setStatus('The export didn\'t work. Try again in a moment.')
    } finally {
      setExporting(false)
    }
  }

  const timelineData = useMemo(() => groupTimeline(analytics?.submission_timeline || []), [analytics])
  const questionResponseData = useMemo(
    () =>
      (analytics?.questions || []).map((question) => ({
        question: question.question_text,
        responses: question.total_responses,
      })),
    [analytics],
  )

  if (!analytics) {
    return <p className="text-center text-sm text-brown dark:text-dark-text">{status}</p>
  }

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-warm-gray bg-beige p-6 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-primary">Analytics</p>
            <h1 className="mt-1 font-display text-3xl font-bold dark:text-dark-text">{analytics.form_title}</h1>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting || analytics.total_submissions === 0}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-brown/20 dark:disabled:bg-dark-elevated"
          >
            {exporting ? 'Exporting...' : 'Download Excel'}
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md bg-beige-dark p-4 dark:bg-dark-elevated">
            <p className="text-sm text-brown dark:text-dark-text/80">Total responses</p>
            <p className="mt-1 text-3xl font-semibold dark:text-dark-text">{analytics.total_submissions}</p>
          </div>
          <div className="rounded-md bg-beige-dark p-4 dark:bg-dark-elevated">
            <p className="text-sm text-brown dark:text-dark-text/80">Questions</p>
            <p className="mt-1 text-3xl font-semibold dark:text-dark-text">{analytics.questions.length}</p>
          </div>
          <div className="rounded-md bg-beige-dark p-4 dark:bg-dark-elevated">
            <p className="text-sm text-brown dark:text-dark-text/80">Latest response</p>
            <p className="mt-2 text-sm font-semibold dark:text-dark-text">
              {analytics.submission_timeline[0]?.submitted_at
                ? new Date(analytics.submission_timeline[0].submitted_at).toLocaleString()
                : 'None yet'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-warm-gray bg-beige p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <h2 className="font-semibold dark:text-dark-text">Response timeline</h2>
          <div className="mt-4 h-72">
            {timelineData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 8, right: 16, left: -24, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="responses" stroke="#c2410c" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-md bg-beige-dark text-sm text-brown dark:bg-dark-elevated dark:text-dark-text/70">
                No submissions yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-warm-gray bg-beige p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <h2 className="font-semibold dark:text-dark-text">Question response counts</h2>
          <div className="mt-4 h-72">
            {questionResponseData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={questionResponseData} margin={{ top: 8, right: 16, left: -24, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="question" tick={{ fontSize: 12 }} interval={0} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="responses" fill="#c2410c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-md bg-beige-dark text-sm text-brown dark:bg-dark-elevated dark:text-dark-text/70">
                No questions yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <h2 className="text-xl font-semibold">Answers by question</h2>
        {analytics.questions.map((question) => (
          <QuestionChart key={question.question_id} question={question} />
        ))}
      </div>
    </section>
  )
}
