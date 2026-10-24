import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowsDownUp,
  ChartBar,
  DownloadSimple,
  Eye,
  FileText,
  FloppyDisk,
  GitBranch,
  PencilLine,
  PencilSimple,
  QrCode,
} from '@phosphor-icons/react'
import { useAuth } from '../hooks/useAuth.jsx'

const features = [
  {
    icon: ArrowsDownUp,
    title: 'Five question types',
    text: 'Short answer, paragraph, multiple choice, checkboxes and dropdowns. Drag questions around until the order feels right.',
  },
  {
    icon: GitBranch,
    title: 'Sections that branch',
    text: 'Split a long form into pages, and send people to a different section depending on what they pick.',
  },
  {
    icon: FloppyDisk,
    title: 'Drafts that stick around',
    text: 'Close the tab halfway through building a form and your draft is still there when you come back.',
  },
  {
    icon: QrCode,
    title: 'A link and a QR code',
    text: 'Every public form gets both. Paste the link in a chat or print the code on a flyer.',
  },
  {
    icon: PencilSimple,
    title: 'Answers people can fix',
    text: 'Turn on response editing and respondents can go back and correct a typo after they submit.',
  },
  {
    icon: DownloadSimple,
    title: 'Charts and an Excel export',
    text: 'See responses over time and per question, or download the whole lot as a spreadsheet.',
  },
]

const steps = [
  {
    title: 'Write your questions',
    text: 'Start with a blank form, add questions and sections, and preview it before anyone else sees it.',
  },
  {
    title: 'Send it out',
    text: 'Share the link or the QR code. The people filling it in don\'t need an account.',
  },
  {
    title: 'Read the answers',
    text: 'Responses show up on the form\'s analytics page. Export to Excel when you want to dig in.',
  },
]

const tips = [
  {
    icon: GitBranch,
    text: 'Add sections to a form and you can route people to one based on their answer to a multiple choice or dropdown question.',
  },
  {
    icon: Eye,
    text: 'Use Preview on the edit page to click through a form the way a respondent would, without sending a test submission.',
  },
  {
    icon: QrCode,
    text: 'The edit page has a QR code for every public form, ready to screenshot or print.',
  },
  {
    icon: DownloadSimple,
    text: 'Analytics has a Download Excel button that exports every response to a spreadsheet.',
  },
]

function FormMockup() {
  return (
    <div className="relative isolate">
      <div className="absolute -inset-4 -z-10 rotate-2 rounded-3xl bg-primary/10 dark:bg-primary/20" aria-hidden="true" />
      <div className="overflow-hidden rounded-2xl border border-warm-gray bg-beige shadow-warm dark:border-dark-border dark:bg-dark-surface">
        <div className="h-2 bg-primary" />
        <div className="space-y-5 p-6">
          <div>
            <p className="font-display text-xl font-bold text-brown-dark dark:text-dark-text">Saturday potluck</p>
            <p className="mt-1 text-sm text-brown dark:text-dark-text/70">Tell us what you're bringing so we don't end up with six salads.</p>
          </div>
          <div className="rounded-xl border border-warm-gray bg-cream p-4 dark:border-dark-border-alt dark:bg-dark-elevated">
            <p className="text-sm font-semibold text-brown-dark dark:text-dark-text">
              What are you bringing?<span className="text-rose-600"> *</span>
            </p>
            <div className="mt-3 space-y-2 text-sm text-brown-dark dark:text-dark-text">
              {['A main dish', 'A side or salad', 'Dessert', 'Drinks'].map((option, index) => (
                <div key={option} className="flex items-center gap-3">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                      index === 2 ? 'border-primary' : 'border-warm-gray dark:border-dark-border-alt'
                    }`}
                  >
                    {index === 2 ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                  </span>
                  {option}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-warm-gray bg-cream p-4 dark:border-dark-border-alt dark:bg-dark-elevated">
            <p className="text-sm font-semibold text-brown-dark dark:text-dark-text">Anything we should know about allergies?</p>
            <div className="mt-3 h-9 rounded-md border border-warm-gray bg-beige-dark px-3 py-2 text-sm text-brown/60 dark:border-dark-border-alt dark:bg-dark-surface dark:text-dark-text/50">
              No nuts, please
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-brown dark:text-dark-text/60">Page 1 of 2</span>
            <span className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Next</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    const firstName = user?.full_name?.split(' ')[0]

    return (
      <div className="space-y-10">
        <section className="space-y-2">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Hi{firstName ? ` ${firstName}` : ''}, good to see you.
          </h1>
          <p className="text-lg text-brown dark:text-dark-text/80">What are you working on today?</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <Link
            to="/forms/new"
            className="group rounded-2xl border border-warm-gray bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-glow transition hover:-translate-y-1 hover:shadow-xl dark:border-primary/30"
          >
            <PencilLine size={28} weight="duotone" />
            <p className="mt-4 font-display text-lg font-bold">New form</p>
            <p className="text-sm text-orange-100">Start with a blank page</p>
          </Link>

          <Link
            to="/dashboard"
            className="group rounded-2xl border border-warm-gray bg-beige p-6 transition hover:-translate-y-1 hover:shadow-md dark:border-dark-border dark:bg-dark-surface"
          >
            <FileText size={28} weight="duotone" className="text-primary" />
            <p className="mt-4 font-display text-lg font-bold dark:text-dark-text">My forms</p>
            <p className="text-sm text-brown dark:text-dark-text/70">Edit, share or delete what you've made</p>
          </Link>

          <Link
            to="/dashboard"
            className="group rounded-2xl border border-warm-gray bg-beige p-6 transition hover:-translate-y-1 hover:shadow-md dark:border-dark-border dark:bg-dark-surface"
          >
            <ChartBar size={28} weight="duotone" className="text-primary" />
            <p className="mt-4 font-display text-lg font-bold dark:text-dark-text">Responses</p>
            <p className="text-sm text-brown dark:text-dark-text/70">Pick a form, then open its analytics</p>
          </Link>
        </section>

        <section className="rounded-3xl border border-warm-gray bg-beige/50 p-8 dark:border-dark-border dark:bg-dark-surface/50">
          <h2 className="font-display text-2xl font-bold dark:text-dark-text">A few things that are easy to miss</h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {tips.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon size={20} weight="duotone" />
                </div>
                <p className="text-sm leading-6 text-brown dark:text-dark-text/80">{text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-28">
      {/* Hero */}
      <section className="grid gap-14 pt-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-7">
          <h1 className="font-display max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Ask your questions. Get your answers.
          </h1>
          <p className="max-w-lg text-lg leading-8 text-brown dark:text-dark-text/80">
            FormFlow is a form builder for sign-ups, surveys, RSVPs and anything else where you need answers from a
            group of people. Make a form, send a link, and watch the responses come in.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-primary-dark"
            >
              Make your first form
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link
              to="/login"
              className="text-sm font-semibold text-brown-dark underline-offset-4 hover:underline dark:text-dark-text"
            >
              I already have an account
            </Link>
          </div>
          <p className="text-sm text-brown/80 dark:text-dark-text/60">Free to use. People answering your form don't need an account.</p>
        </div>
        <FormMockup />
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl font-bold tracking-tight">Three steps, start to finish</h2>
        <ol className="mt-10 grid gap-10 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-primary pt-5">
              <span className="font-display text-4xl font-black text-primary/30">{index + 1}</span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 leading-7 text-brown dark:text-dark-text/80">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight">What's in the box</h2>
          <p className="mt-3 text-lg text-brown dark:text-dark-text/80">
            FormFlow keeps the feature list short on purpose. Here's all of it.
          </p>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-warm-gray bg-warm-gray sm:grid-cols-2 lg:grid-cols-3 dark:border-dark-border dark:bg-dark-border">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-beige p-6 dark:bg-dark-surface">
              <Icon size={24} weight="duotone" className="text-primary" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-brown dark:text-dark-text/80">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="mx-auto max-w-3xl rounded-3xl border border-warm-gray bg-beige p-8 sm:p-10 dark:border-dark-border dark:bg-dark-surface">
        <h2 className="font-display text-2xl font-bold">About your data</h2>
        <div className="mt-4 space-y-4 leading-7 text-brown dark:text-dark-text/80">
          <p>
            We don't sell your data. Your forms live in your account, and you decide which ones are public. Switch a
            form to private and nobody can open it from the link. Delete a form and it's gone.
          </p>
          <p>
            FormFlow is built on open-source tools, and there are no hidden fees. If you have a question about how we
            handle your data, ask us and you'll get a straight answer.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-br from-primary to-primary-dark px-8 py-10 text-white shadow-glow sm:flex-row sm:items-center sm:px-12">
          <div>
            <h2 className="font-display text-3xl font-bold">Got something to ask?</h2>
            <p className="mt-2 text-orange-100">Your first form takes a few minutes to set up.</p>
          </div>
          <Link
            to="/register"
            className="shrink-0 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-primary shadow transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Create a free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="-mx-4 border-t border-warm-gray pt-14 pb-8 sm:-mx-6 lg:-mx-8 dark:border-dark-border-subtle">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link to="/" className="font-display text-xl font-black text-brown-dark dark:text-dark-text">
                FormFlow
              </Link>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-brown dark:text-dark-text/80">
                A small, friendly form builder for people who want to ask a question and get on with their day.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-brown-dark dark:text-dark-text">Product</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/register" className="text-sm text-brown transition hover:text-brown-dark dark:text-dark-text/80 dark:hover:text-dark-text">
                    Create an account
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-sm text-brown transition hover:text-brown-dark dark:text-dark-text/80 dark:hover:text-dark-text">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-sm text-brown transition hover:text-brown-dark dark:text-dark-text/80 dark:hover:text-dark-text">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-brown-dark dark:text-dark-text">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-brown transition hover:text-brown-dark dark:text-dark-text/80 dark:hover:text-dark-text">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-brown transition hover:text-brown-dark dark:text-dark-text/80 dark:hover:text-dark-text">
                    Terms of service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-brown transition hover:text-brown-dark dark:text-dark-text/80 dark:hover:text-dark-text">
                    Cookie policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-warm-gray pt-8 text-sm text-brown dark:border-dark-border-subtle dark:text-dark-text/70">
            <p>© {new Date().getFullYear()} FormFlow</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
