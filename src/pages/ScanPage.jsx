import { Camera, CheckCircle2, QrCode } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import WasteLogModal from '../components/WasteLogModal'
import { useAuth } from '../contexts/AuthContext'
import { addWasteLog } from '../lib/firestore'

export default function ScanPage() {
  const { currentUser, refreshProfile } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('Plastic')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmitWasteLog = async () => {
    if (!currentUser) return

    setIsSubmitting(true)
    try {
      const points = await addWasteLog(currentUser.uid, selectedType)
      await refreshProfile()
      setIsModalOpen(false)
      setShowSuccess(true)
      toast.success(`Great job! +${points} coins added.`)
      setTimeout(() => setShowSuccess(false), 1800)
    } catch (error) {
      toast.error('Unable to save waste drop. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Waste Drop Scanner</h2>
        <p className="mt-1 text-sm text-slate-600">
          Use the demo scanner to quickly log waste during your pitch.
        </p>

        <div className="relative mt-4 overflow-hidden rounded-2xl border-2 border-dashed border-eco-300 bg-eco-50 p-6">
          <div className="flex h-52 flex-col items-center justify-center rounded-xl bg-white">
            <Camera className="h-10 w-10 text-eco-600" />
            <p className="mt-3 text-sm font-medium text-slate-700">Camera Placeholder</p>
            <p className="text-xs text-slate-500">QR detection simulated for demo reliability</p>
          </div>

          {showSuccess && (
            <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-eco-900/50">
              <div className="rounded-2xl bg-white px-6 py-4 text-center shadow-2xl">
                <CheckCircle2 className="mx-auto h-10 w-10 text-eco-600" />
                <p className="mt-2 text-sm font-semibold text-slate-900">Waste logged successfully!</p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-eco-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-eco-700"
        >
          <QrCode className="h-4 w-4" />
          Simulate QR Scan (Demo)
        </button>
      </section>

      <section className="rounded-2xl border border-earth-200 bg-earth-100/70 p-4">
        <h3 className="text-sm font-semibold text-earth-700">Points Rules</h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          <li>Plastic: +10 coins</li>
          <li>Glass: +15 coins</li>
          <li>General Waste: +5 coins</li>
        </ul>
      </section>

      <WasteLogModal
        isOpen={isModalOpen}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitWasteLog}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
