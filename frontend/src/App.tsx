import { useState } from 'react'
import { useDeals } from './hooks/useDeals'
import { Metrics } from './components/Metrics'
import { Pipeline } from './components/Pipeline'
import { DealList } from './components/DealList'
import { DealDetail } from './components/DealDetail'
import { ForecastChart } from './components/ForecastChart'
import type { Deal } from './types/deal'

type Tab = 'pipeline' | 'list' | 'forecast'

const TABS: { key: Tab; label: string }[] = [
  { key: 'pipeline', label: 'Pipeline' },
  { key: 'list',     label: 'List' },
  { key: 'forecast', label: 'Forecast' },
]

export default function App() {
  const { deals, loading, error } = useDeals()
  const [tab, setTab]             = useState<Tab>('pipeline')
  const [selected, setSelected]   = useState<Deal | null>(null)

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <p className="text-gray-400 text-sm">Loading deals...</p>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <p className="text-red-500 text-sm font-medium">Could not reach the backend</p>
        <p className="text-gray-400 text-xs mt-1">{error}</p>
        <p className="text-gray-400 text-xs mt-3">Make sure the API is running: <code className="bg-gray-100 px-1 rounded">cd backend && uvicorn main:app</code></p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Deal Tracker</h1>
        <span className="text-xs text-gray-400">{deals.length} deals</span>
      </header>

      <main className="max-w-screen-2xl mx-auto px-6 py-6 space-y-5">
        <Metrics deals={deals} />

        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'pipeline' && <Pipeline deals={deals} onSelect={setSelected} />}
        {tab === 'list'     && <DealList deals={deals} onSelect={setSelected} />}
        {tab === 'forecast' && <ForecastChart deals={deals} />}
      </main>

      {selected && <DealDetail deal={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
