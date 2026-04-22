import { X } from 'lucide-react'
import { POINT_RULES } from '../lib/firestore'

const wasteOptions = ['Plastic', 'Glass', 'General']

export default function WasteLogModal({
  isOpen,
  selectedType,
  onTypeChange,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-slate-900/45 p-4 sm:items-center">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Log Waste Drop</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-3 text-sm text-slate-600">
          Pick the waste type to award eco coins and save this drop to Firestore.
        </p>

        <div className="space-y-2">
          {wasteOptions.map((type) => (
            <label
              key={type}
              className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                selectedType === type
                  ? 'border-eco-500 bg-eco-50 text-eco-800'
                  : 'border-slate-200 hover:border-eco-300'
              }`}
            >
              <span className="font-medium">{type}</span>
              <span className="font-semibold text-amber-600">+{POINT_RULES[type]} coins</span>
              <input
                type="radio"
                className="hidden"
                name="wasteType"
                value={type}
                checked={selectedType === type}
                onChange={() => onTypeChange(type)}
              />
            </label>
          ))}
        </div>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="mt-5 w-full rounded-xl bg-eco-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-eco-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : 'Confirm Waste Drop'}
        </button>
      </div>
    </div>
  )
}
