import { ArrowRight, Camera, Coins, Leaf, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { fetchWasteLogs } from '../lib/firestore'

function formatDate(timestamp) {
  if (!timestamp?.seconds) return 'Just now'
  return new Date(timestamp.seconds * 1000).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export default function DashboardPage() {
  const { currentUser, profile } = useAuth()
  const [recentLogs, setRecentLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadRecentLogs() {
      if (!currentUser) return
      setIsLoading(true)
      const logs = await fetchWasteLogs(currentUser.uid, 3)
      setRecentLogs(logs)
      setIsLoading(false)
    }

    loadRecentLogs()
  }, [currentUser])

  return (
    <div className="space-y-4 pb-2">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Hello, {profile?.name ?? 'Eco Hero'} 👋</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900">Ready to make today greener?</h2>

        <div className="mt-4 rounded-2xl bg-gradient-to-r from-eco-600 to-eco-700 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-eco-50">Total Eco Coins</p>
              <p className="text-3xl font-bold">{profile?.totalPoints ?? 0}</p>
            </div>
            <div className="rounded-full bg-white/20 p-3">
              <Coins className="h-7 w-7" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Link
          to="/scan"
          className="rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5"
        >
          <Camera className="mb-2 h-5 w-5 text-eco-700" />
          <p className="text-sm font-semibold text-slate-900">Scan Waste</p>
          <p className="mt-1 text-xs text-slate-500">Log a new drop</p>
        </Link>

        <Link
          to="/learn"
          className="rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5"
        >
          <Leaf className="mb-2 h-5 w-5 text-eco-700" />
          <p className="text-sm font-semibold text-slate-900">Learn</p>
          <p className="mt-1 text-xs text-slate-500">Eco tips + chatbot</p>
        </Link>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
          <Sparkles className="h-4 w-4 text-eco-600" />
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-500">Loading activity...</p>
        ) : recentLogs.length === 0 ? (
          <p className="text-sm text-slate-500">No activity yet. Scan your first waste drop!</p>
        ) : (
          <ul className="space-y-2">
            {recentLogs.map((log) => (
              <li
                key={log.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{log.wasteType} waste</p>
                  <p className="text-xs text-slate-500">{formatDate(log.timestamp)}</p>
                </div>
                <p className="text-sm font-semibold text-amber-600">+{log.pointsEarned}</p>
              </li>
            ))}
          </ul>
        )}

        <Link
          to="/wallet"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-eco-700"
        >
          View all transactions
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  )
}
