import { useState } from 'react'
import type { Deal, DealStage } from '../types/deal'
import { STAGES, STAGE_COLORS } from '../types/deal'

interface Props {
  deals: Deal[]
  onSelect: (deal: Deal) => void
}

type SortKey = 'company' | 'value' | 'probability' | 'closeDate' | 'stage'

export function DealList({ deals, onSelect }: Props) {
  const [search, setSearch]           = useState('')
  const [stageFilter, setStageFilter] = useState<DealStage | 'all'>('all')
  const [sortKey, setSortKey]         = useState<SortKey>('value')
  const [sortDesc, setSortDesc]       = useState(true)

  const filtered = deals
    .filter(d => {
      const q = search.toLowerCase()
      return (
        (d.company.toLowerCase().includes(q) || d.title.toLowerCase().includes(q)) &&
        (stageFilter === 'all' || d.stage === stageFilter)
      )
    })
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv))
      return sortDesc ? -cmp : cmp
    })

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDesc(d => !d)
    else { setSortKey(key); setSortDesc(true) }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search company or deal..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={stageFilter}
          onChange={e => setStageFilter(e.target.value as DealStage | 'all')}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All stages</option>
          {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <Th label="Company"     k="company"     current={sortKey} desc={sortDesc} toggle={toggleSort} />
              <Th label="Stage"       k="stage"       current={sortKey} desc={sortDesc} toggle={toggleSort} />
              <Th label="Value"       k="value"       current={sortKey} desc={sortDesc} toggle={toggleSort} />
              <Th label="Probability" k="probability" current={sortKey} desc={sortDesc} toggle={toggleSort} />
              <Th label="Close Date"  k="closeDate"   current={sortKey} desc={sortDesc} toggle={toggleSort} />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(deal => (
              <tr key={deal.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(deal)}>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{deal.company}</p>
                  <p className="text-xs text-gray-400 truncate max-w-xs">{deal.title}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STAGE_COLORS[deal.stage].pill}`}>
                    {deal.stage}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">${deal.value.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{deal.probability}%</td>
                <td className="px-4 py-3 text-sm text-gray-600">{deal.closeDate || '—'}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">
                  No deals match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({
  label, k, current, desc, toggle,
}: {
  label: string
  k: SortKey
  current: SortKey
  desc: boolean
  toggle: (k: SortKey) => void
}) {
  return (
    <th
      className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-800 select-none"
      onClick={() => toggle(k)}
    >
      {label}{current === k ? (desc ? ' ↓' : ' ↑') : ''}
    </th>
  )
}
