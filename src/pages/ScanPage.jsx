import { Camera, CameraOff, CheckCircle2, Play, StopCircle } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import WasteLogModal from '../components/WasteLogModal'
import { useAuth } from '../contexts/AuthContext'
import { addWasteLog } from '../lib/firestore'

const QR_REGION_ID = 'waste-qr-reader'
const WASTE_TYPES = ['Plastic', 'Glass', 'General']

function extractWasteType(decodedText) {
  const normalized = decodedText.toLowerCase()

  for (const type of WASTE_TYPES) {
    if (normalized.includes(type.toLowerCase())) return type
  }

  try {
    const parsed = JSON.parse(decodedText)
    const candidate = parsed?.wasteType || parsed?.type
    if (typeof candidate === 'string') {
      const match = WASTE_TYPES.find((type) => type.toLowerCase() === candidate.toLowerCase())
      if (match) return match
    }
  } catch {
    // Not a JSON QR payload, ignore parsing.
  }

  return 'General'
}

export default function ScanPage() {
  const { currentUser, refreshProfile } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('Plastic')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [scannerStatus, setScannerStatus] = useState('idle')
  const [lastScan, setLastScan] = useState('')
  const scannerRef = useRef(null)

  const stopScanner = async () => {
    if (!scannerRef.current) return
    try {
      await scannerRef.current.stop()
    } catch {
      // Ignore if scanner is already stopped.
    }
    try {
      await scannerRef.current.clear()
    } catch {
      // Ignore clear errors.
    }
    scannerRef.current = null
    setScannerStatus('stopped')
  }

  const startScanner = async () => {
    if (scannerStatus === 'running') return

    try {
      setScannerStatus('starting')
      const scanner = new Html5Qrcode(QR_REGION_ID)
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 230, height: 230 } },
        async (decodedText) => {
          const detectedType = extractWasteType(decodedText)
          setLastScan(decodedText)
          setSelectedType(detectedType)
          await stopScanner()
          setIsModalOpen(true)
          toast.success(`QR detected: ${detectedType}`)
        }
      )

      setScannerStatus('running')
    } catch (error) {
      setScannerStatus('error')
      toast.error('Camera access failed. Allow camera permission and try again.')
    }
  }

  useEffect(() => {
    return () => {
      if (!scannerRef.current) return
      scannerRef.current
        .stop()
        .catch(() => {})
        .finally(() => {
          scannerRef.current?.clear().catch(() => {})
          scannerRef.current = null
        })
    }
  }, [])

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
          Scan a real QR code with your camera to auto-detect waste type.
        </p>

        <div className="relative mt-4 overflow-hidden rounded-2xl border-2 border-dashed border-eco-300 bg-eco-50 p-6">
          <div id={QR_REGION_ID} className="mx-auto min-h-[220px] w-full overflow-hidden rounded-xl bg-white" />

          {showSuccess && (
            <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-eco-900/50">
              <div className="rounded-2xl bg-white px-6 py-4 text-center shadow-2xl">
                <CheckCircle2 className="mx-auto h-10 w-10 text-eco-600" />
                <p className="mt-2 text-sm font-semibold text-slate-900">Waste logged successfully!</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={startScanner}
            disabled={scannerStatus === 'running' || scannerStatus === 'starting'}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-eco-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-eco-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Play className="h-4 w-4" />
            {scannerStatus === 'starting' ? 'Starting Camera...' : 'Start Camera Scan'}
          </button>
          <button
            onClick={stopScanner}
            disabled={scannerStatus !== 'running'}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <StopCircle className="h-4 w-4" />
            Stop Scan
          </button>
        </div>

        <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <p className="inline-flex items-center gap-1 font-medium">
            {scannerStatus === 'running' ? (
              <>
                <Camera className="h-3.5 w-3.5 text-eco-700" /> Camera active
              </>
            ) : (
              <>
                <CameraOff className="h-3.5 w-3.5 text-slate-500" /> Camera inactive
              </>
            )}
          </p>
          {lastScan ? <p className="mt-1 truncate">Last QR data: {lastScan}</p> : null}
        </div>
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
