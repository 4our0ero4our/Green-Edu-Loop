import { Coins, Gift } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'
import { fetchWasteLogs } from '../lib/firestore'

function prettyDate(timestamp) {
  if (!timestamp?.seconds) return 'Just now'
  return new Date(timestamp.seconds * 1000).toLocaleString()
}

export default function WalletPage() {
  const { currentUser, profile } = useAuth()
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadLogs() {
      if (!currentUser) return
      setIsLoading(true)
      const transactions = await fetchWasteLogs(currentUser.uid)
      setLogs(transactions)
      setIsLoading(false)
    }

    loadLogs()
  }, [currentUser, profile?.totalPoints])

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-gradient-to-r from-eco-600 to-eco-700 p-5 text-white shadow-sm">
        <p className="text-sm text-eco-50">Your Reward Wallet</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-4xl font-bold">{profile?.totalPoints ?? 0}</p>
          <Coins className="h-9 w-9" />
        </div>
        <p className="mt-1 text-sm text-eco-100">Coins earned by responsible waste drops.</p>
      </section>

      <button
        onClick={() => toast.info('Redemption coming in Phase 2!')}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-earth-200 px-4 py-3 text-sm font-semibold text-earth-700 transition hover:bg-earth-300"
      >
        <Gift className="h-4 w-4" />
        Redeem Points
      </button>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-slate-900">All Transactions</h3>
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading transactions...</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-slate-500">
            No transactions yet. Head to Scan and log your first drop.
          </p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">{log.wasteType}</p>
                  <p className="text-xs text-slate-500">{prettyDate(log.timestamp)}</p>
                </div>
                <p className="text-sm font-bold text-amber-600">+{log.pointsEarned}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
