import { Leaf, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup, signInWithGoogle } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  const handleChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await signup(form)
      toast.success('Account created! Let the green journey begin.')
      navigate('/')
    } catch (error) {
      toast.error('Signup failed. Try a different email or stronger password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true)
    try {
      await signInWithGoogle()
      toast.success('Signed in with Google!')
      navigate('/')
    } catch (error) {
      toast.error('Google sign-in failed. Please try again.')
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-eco-50 via-white to-earth-100 px-4 py-8 md:px-8">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-2">
        <section className="hidden rounded-3xl bg-gradient-to-br from-eco-700 to-eco-900 p-10 text-white shadow-sm lg:block">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <Leaf className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-4xl font-bold leading-tight">Join the loop and make every drop count.</h2>
          <p className="mt-4 max-w-md text-eco-50">
            Create an account to log responsible waste disposal, earn coins, and learn practical sustainability tips.
          </p>
        </section>

        <div className="w-full rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-eco-100">
              <Leaf className="h-6 w-6 text-eco-700" />
            </div>
            <h1 className="text-2xl font-bold text-eco-900">Create Your Eco Account</h1>
            <p className="mt-1 text-sm text-slate-600">Track waste drops and collect reward coins.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-eco-500 focus:outline-none"
                placeholder="Aisha"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-eco-500 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input
                name="password"
                type="password"
                minLength={6}
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-eco-500 focus:outline-none"
                placeholder="Minimum 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-eco-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-eco-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <UserPlus className="h-4 w-4" />
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || isGoogleSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.4c-.2 1.2-1.4 3.6-5.4 3.6-3.2 0-5.8-2.7-5.8-6s2.6-6 5.8-6c1.8 0 3 .8 3.7 1.4L18.3 5C16.7 3.5 14.6 2.6 12 2.6 6.9 2.6 2.8 6.8 2.8 12s4.1 9.4 9.2 9.4c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1-.2-1.5H12z"
              />
              <path fill="#34A853" d="M3.8 7.5l3.2 2.3c.9-1.8 2.7-3.1 5-3.1 1.8 0 3 .8 3.7 1.4L18.3 5C16.7 3.5 14.6 2.6 12 2.6c-3.5 0-6.5 2-8.2 4.9z" />
              <path fill="#4A90E2" d="M12 21.4c2.5 0 4.6-.8 6.1-2.2l-2.9-2.4c-.8.6-1.9 1-3.2 1-2.2 0-4.1-1.4-4.8-3.4l-3.2 2.5c1.7 2.9 4.7 4.5 8 4.5z" />
              <path fill="#FBBC05" d="M7.2 14.4c-.2-.6-.4-1.2-.4-1.9s.1-1.3.4-1.9L4 8.1C3.3 9.3 2.8 10.6 2.8 12s.5 2.7 1.2 3.9l3.2-1.5z" />
            </svg>
            {isGoogleSubmitting ? 'Connecting Google...' : 'Continue with Google'}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-eco-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
