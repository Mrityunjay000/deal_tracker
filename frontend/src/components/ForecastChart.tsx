import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import type { Deal } from '../types/deal'

interface Props { deals: Deal[] }

export function ForecastChart({ deals }: Props) {
  const byMonth: Record<string, { pipeline: number; weighted: number }> = {}

  for (const deal of deals) {
    if (!deal.closeDate || deal.stage === 'closed-lost') continue
    const month = deal.closeDate.slice(0, 7) // YYYY-MM
    if (!byMonth[month]) byMonth[month] = { pipeline: 0, weighted: 0 }
    byMonth[month].pipeline += deal.value
    byMonth[month].weighted += deal.value * (deal.probability / 100)
  }

  const data = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({
      month,
      Pipeline: Math.round(v.pipeline),
      Weighted: Math.round(v.weighted),
    }))

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
        <p className="text-gray-400 text-sm">
          No forecast data — add <code className="bg-gray-100 px-1 rounded">close_date</code> fields to your deal files.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-sm font-medium text-gray-600 mb-6">Revenue Forecast by Close Month</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} barGap={6}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} width={60} />
          <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="Pipeline" fill="#e0e7ff" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Weighted" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
