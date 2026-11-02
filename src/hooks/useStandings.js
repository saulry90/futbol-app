import { useEffect, useState } from 'react'
import { fetchStandings } from '../services/api'

export function useStandings(leagueId) {
  const [standings, setStandings] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setStatus('loading')
      try {
        const data = await fetchStandings(leagueId)
        if (cancelled) return
        setStandings(data)
        setStatus('ready')
      } catch (error) {
        if (cancelled) return
        setStatus('error')
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [leagueId])

  return { standings, status }
}