import { Leaf, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

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
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-eco-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-eco-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <UserPlus className="h-4 w-4" />
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

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
