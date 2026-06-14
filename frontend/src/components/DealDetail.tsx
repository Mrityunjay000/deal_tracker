import { useEffect } from 'react'
import type { Deal } from '../types/deal'
import { STAGE_COLORS } from '../types/deal'

interface Props {
  deal: Deal
  onClose: () => void
}

export function DealDetail({ deal, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const pill = STAGE_COLORS[deal.stage].pill

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{deal.company}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{deal.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4">
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {/* Key fields */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stage">
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${pill}`}>
                {deal.stage}
              </span>
            </Field>
            <Field label="Value"><span className="text-sm font-semibold text-gray-900">${deal.value.toLocaleString()}</span></Field>
            <Field label="Probability"><span className="text-sm text-gray-700">{deal.probability}%</span></Field>
            <Field label="Close Date"><span className="text-sm text-gray-700">{deal.closeDate || '—'}</span></Field>
            <Field label="Contact"><span className="text-sm text-gray-700">{deal.contact || '—'}</span></Field>
            <Field label="Created"><span className="text-sm text-gray-700">{deal.created || '—'}</span></Field>
          </div>

          {/* Tags */}
          {deal.tags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {deal.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rendered notes */}
          {deal.notes && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Notes</p>
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: deal.notes }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      {children}
    </div>
  )
}
