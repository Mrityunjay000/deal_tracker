import type { Deal } from '../types/deal'
import { STAGES, STAGE_COLORS } from '../types/deal'

interface Props {
  deals: Deal[]
  onSelect: (deal: Deal) => void
}

export function Pipeline({ deals, onSelect }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {STAGES.map(stage => {
        const stageDeals = deals.filter(d => d.stage === stage.key)
        const stageValue = stageDeals.reduce((s, d) => s + d.value, 0)
        const colors = STAGE_COLORS[stage.key]

        return (
          <div key={stage.key} className="flex-shrink-0 w-60">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className={`text-xs font-semibold uppercase tracking-wide ${colors.text}`}>
                {stage.label}
              </span>
              <span className="text-xs text-gray-400">
                {stageDeals.length} · ${stageValue.toLocaleString()}
              </span>
            </div>

            <div className={`min-h-28 rounded-xl ${colors.bg} p-2 space-y-2`}>
              {stageDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} onClick={() => onSelect(deal)} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DealCard({ deal, onClick }: { deal: Deal; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow"
    >
      <p className="text-sm font-medium text-gray-900 truncate">{deal.company}</p>
      <p className="text-xs text-gray-400 truncate mt-0.5">{deal.title}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm font-semibold text-gray-800">${deal.value.toLocaleString()}</span>
        <span className="text-xs text-gray-400">{deal.probability}%</span>
      </div>
      {deal.closeDate && (
        <p className="text-xs text-gray-400 mt-1">Close: {deal.closeDate}</p>
      )}
    </button>
  )
}
