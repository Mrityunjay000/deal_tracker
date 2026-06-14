import { useState, useEffect, useCallback } from 'react'
import type { Deal } from '../types/deal'

const API_BASE = 'http://localhost:8000'

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDeals = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/deals`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setDeals(await res.json())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDeals() }, [fetchDeals])

  // SSE: re-fetch whenever any .md file changes on disk
  useEffect(() => {
    const source = new EventSource(`${API_BASE}/stream`)
    source.onmessage = () => fetchDeals()
    source.onerror = () => source.close()
    return () => source.close()
  }, [fetchDeals])

  return { deals, loading, error, refetch: fetchDeals }
}
