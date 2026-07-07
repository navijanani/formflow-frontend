import { Link } from 'react-router-dom'
import { 
  PencilLine, 
  ShareNetwork, 
  ChartBar, 
  Check, 
  Lightning, 
  Lock,
  Shield,
  FileText
} from '@phosphor-icons/react'
import { useAuth } from '../hooks/useAuth.jsx'

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return (
      <div className="space-y-10">
        {/* Welcome Header */}
        <section className="space-y-4 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome back{user?.full_name ? `, ${user.full_name}` : ''}!
          </h1>
          <p className="text-lg text-brown dark:text-dark-text/80">
            Ready to build something amazing?
          </p>
        </section>

        {/* Quick Actions */}
        <section className="grid gap-4 sm:grid-cols-3">
          <Link
            to="/forms/new"
            className="group rounded-2xl border border-warm-gray bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-glow transition hover:-translate-y-1 hover:shadow-xl dark:border-primary/30"
          >
            <div className="flex items-center gap-3">
              <PencilLine size={28} weight="duotone" />
              <div>
                <p className="font-display text-lg font-bold">Create Form</p>
                <p className="text-sm text-orange-100">Start from scratch</p>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className="group rounded-2xl border border-warm-gray bg-beige p-6 transition hover:-translate-y-1 hover:shadow-md dark:border-dark-border dark:bg-dark-surface"
          >
            <div className="flex items-center gap-3">
              <FileText size={28} weight="duotone" className="text-primary" />
              <div>
                <p className="font-display text-lg font-bold dark:text-dark-text">Your Forms</p>
                <p className="text-sm text-brown dark:text-dark-text/70">Manage & view</p>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className="group rounded-2xl border border-warm-gray bg-beige p-6 transition hover:-translate-y-1 hover:shadow-md dark:border-dark-border dark:bg-dark-surface"
          >
            <div className="flex items-center gap-3">
              <ChartBar size={28} weight="duotone" className="text-primary" />
              <div>
                <p className="font-display text-lg font-bold dark:text-dark-text">Analytics</p>
                <p className="text-sm text-brown dark:text-dark-text/70">View insights</p>
              </div>
            </div>
          </Link>
        </section>

        {/* Features Overview */}
        <section className="rounded-3xl border border-warm-gray bg-beige/50 p-8 backdrop-blur dark:border-dark-border dark:bg-dark-surface/50">
          <h2 className="font-display text-center text-2xl font-bold dark:text-dark-text">Everything you need</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ShareNetwork size={24} weight="duotone" className="text-primary" />
              </div>
              <p className="font-semibold dark:text-dark-text">Public Sharing</p>
              <p className="text-sm text-brown dark:text-dark-text/70">Share forms via simple links</p>
            </div>
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Lightning size={24} weight="duotone" className="text-primary" />
              </div>
              <p className="font-semibold dark:text-dark-text">Lightning Fast</p>
              <p className="text-sm text-brown dark:text-dark-text/70">Instant form creation & responses</p>
            </div>
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Lock size={24} weight="duotone" className="text-primary" />
              </div>
              <p className="font-semibold dark:text-dark-text">Secure & Private</p>
              <p className="text-sm text-brown dark:text-dark-text/70">Your data stays protected</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            Smart Form Builder
          </span>
          <div className="space-y-4">
            <h1 className="font-display max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
              Create, share, and analyze forms with ease.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-brown dark:text-dark-text/80">
              Build custom forms, collect responses, track analytics, and manage everything from one powerful dashboard. Share public forms with a simple link and let users edit their responses.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-dark hover:-translate-y-0.5"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-warm-gray px-5 py-3 text-sm font-semibold text-brown-dark transition hover:border-brown hover:bg-beige dark:border-dark-border dark:text-dark-text dark:hover:border-dark-border-alt dark:hover:bg-dark-elevated"
            >
              Sign in
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-warm-gray/50 bg-beige/80 p-6 shadow-warm backdrop-blur dark:border-dark-border dark:bg-dark-surface/80">
          <div className="space-y-4">
            <div className="rounded-2xl bg-primary p-5 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-200">Form Builder</p>
              <p className="font-display mt-3 text-xl font-semibold">Drag, drop, and design</p>
              <p className="mt-2 text-sm leading-6 text-orange-50">
                Create forms with multiple question types, reorder questions with drag-and-drop, and customize themes to match your brand.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-warm-gray bg-cream p-4 dark:border-dark-border-alt dark:bg-dark-elevated">
                <p className="text-sm font-semibold text-brown-dark dark:text-dark-text">Public Sharing</p>
                <p className="mt-2 text-sm text-brown dark:text-dark-text/80">Share forms via simple links, collect unlimited responses</p>
              </div>
              <div className="rounded-2xl border border-warm-gray bg-cream p-4 dark:border-dark-border-alt dark:bg-dark-elevated">
                <p className="text-sm font-semibold text-brown-dark dark:text-dark-text">Analytics</p>
                <p className="mt-2 text-sm text-brown dark:text-dark-text/80">Track submissions, view charts, export to Excel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight">How it works</h2>
          <p className="mt-3 text-lg text-brown dark:text-dark-text">Get up and running in minutes, not hours</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="group relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
              <PencilLine size={24} weight="duotone" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Design your form</h3>
            <p className="mt-2 text-brown dark:text-dark-text">
              Add questions, choose from multiple types like multiple choice, checkboxes, or text fields. Drag to reorder—it's that simple.
            </p>
          </div>
          <div className="group relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
              <ShareNetwork size={24} weight="duotone" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Share with anyone</h3>
            <p className="mt-2 text-brown dark:text-dark-text">
              Copy your form link and share it anywhere. No login required for your respondents—just click and submit.
            </p>
          </div>
          <div className="group relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
              <ChartBar size={24} weight="duotone" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">See the insights</h3>
            <p className="mt-2 text-brown dark:text-dark-text">
              Watch responses roll in real-time. View charts, download to Excel, and make data-driven decisions faster.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight">Everything you need, nothing you don't</h2>
          <p className="mt-3 text-lg text-brown dark:text-dark-text">Simple tools that actually work the way you'd expect</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-warm-gray bg-beige p-6 shadow-sm transition hover:shadow-warm dark:border-dark-border dark:bg-dark-surface">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Check size={20} weight="bold" />
              </div>
              <div>
                <h3 className="font-semibold">Multiple question types</h3>
                <p className="mt-1 text-sm text-brown dark:text-dark-text">Text, paragraphs, multiple choice, checkboxes, dropdowns—we've got them all.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-warm-gray bg-beige p-6 shadow-sm transition hover:shadow-warm dark:border-dark-border dark:bg-dark-surface">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Lightning size={20} weight="bold" />
              </div>
              <div>
                <h3 className="font-semibold">Lightning fast</h3>
                <p className="mt-1 text-sm text-brown dark:text-dark-text">No lag, no waiting. Create forms and collect responses instantly.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-warm-gray bg-beige p-6 shadow-sm transition hover:shadow-warm dark:border-dark-border dark:bg-dark-surface">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Lock size={20} weight="bold" />
              </div>
              <div>
                <h3 className="font-semibold">Your data is private</h3>
                <p className="mt-1 text-sm text-brown dark:text-dark-text">Secure authentication and encrypted data. Your forms, your data, your control.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-3xl text-center">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark px-8 py-12 text-white shadow-glow">
          <h2 className="font-display text-3xl font-bold">Ready to build better forms?</h2>
          <p className="mt-3 text-lg text-orange-100">Join others who are already collecting responses smarter, not harder.</p>
          <Link
            to="/register"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Start for free
          </Link>
        </div>
      </section>

      {/* Privacy & License Section */}
      <section className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight">Built with trust in mind</h2>
          <p className="mt-3 text-lg text-brown dark:text-dark-text">Your privacy matters, and so does transparency</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-warm-gray bg-beige p-8 shadow-sm dark:border-dark-border dark:bg-dark-surface">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <Shield size={24} weight="duotone" />
              </div>
              <h3 className="text-xl font-semibold">Privacy First</h3>
            </div>
            <p className="mt-4 leading-relaxed text-brown dark:text-dark-text">
              We don't sell your data, period. Your forms and responses are encrypted and stored securely. You control who sees what, and you can delete everything anytime.
            </p>
            <p className="mt-4 text-sm text-brown/70 dark:text-dark-text/70">
              We use industry-standard security practices to keep your information safe. Your trust is our responsibility.
            </p>
          </div>
          <div className="rounded-2xl border border-warm-gray bg-beige p-8 shadow-sm dark:border-dark-border dark:bg-dark-surface">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <FileText size={24} weight="duotone" />
              </div>
              <h3 className="text-xl font-semibold">Open & Transparent</h3>
            </div>
            <p className="mt-4 leading-relaxed text-brown dark:text-dark-text">
              FormFlow is built with modern open-source technologies. We believe in transparency—no hidden fees, no surprise limitations, no confusing terms.
            </p>
            <p className="mt-4 text-sm text-brown/70 dark:text-dark-text/70">
              Questions about how we handle data? Just ask. We're here to help, not hide behind legal jargon.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="-mx-4 border-t border-warm-gray pt-16 pb-8 sm:-mx-6 lg:-mx-8 dark:border-dark-border-subtle">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link to="/" className="font-display text-xl font-black text-brown-dark dark:text-dark-text">
                FormFlow
              </Link>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-brown dark:text-dark-text">
                The simple, powerful way to create forms and collect responses. Built for humans who just want things to work.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-brown-dark dark:text-dark-text">Product</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/register" className="text-sm text-brown transition hover:text-brown-dark dark:text-dark-text/80 dark:hover:text-dark-text">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-sm text-brown transition hover:text-brown-dark dark:text-dark-text/80 dark:hover:text-dark-text">
                    Sign In
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
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-brown transition hover:text-brown-dark dark:text-dark-text/80 dark:hover:text-dark-text">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-brown transition hover:text-brown-dark dark:text-dark-text/80 dark:hover:text-dark-text">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-warm-gray dark:border-dark-border-subtle pt-8 text-center text-sm text-brown dark:text-dark-text">
            <p>© {new Date().getFullYear()} FormFlow. Made with care for people who value simplicity.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
