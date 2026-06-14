import type { Deal } from '../types/deal'

interface Props { deals: Deal[] }

export function Metrics({ deals }: Props) {
  const active  = deals.filter(d => d.stage !== 'closed-lost')
  const won     = deals.filter(d => d.stage === 'closed-won')
  const lost    = deals.filter(d => d.stage === 'closed-lost')

  const totalPipeline   = active.reduce((s, d) => s + d.value, 0)
  const weightedForecast = active.reduce((s, d) => s + d.value * (d.probability / 100), 0)
  const winRate = (won.length + lost.length) > 0
    ? (won.length / (won.length + lost.length)) * 100
    : 0
  const avgDealSize = active.length > 0 ? totalPipeline / active.length : 0

  const cards = [
    { label: 'Total Pipeline',     value: fmt(totalPipeline) },
    { label: 'Weighted Forecast',  value: fmt(Math.round(weightedForecast)) },
    { label: 'Active Deals',       value: String(active.length) },
    { label: 'Win Rate',           value: `${Math.round(winRate)}%` },
    { label: 'Avg Deal Size',      value: fmt(Math.round(avgDealSize)) },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {cards.map(c => (
        <div key={c.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
          <p className="text-xs text-gray-400 uppercase tracking-wide">{c.label}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{c.value}</p>
        </div>
      ))}
    </div>
  )
}

function fmt(n: number) {
  return `$${n.toLocaleString()}`
}
