import { useEffect, useState } from 'react'
import { fetchTeamSchedule } from '../services/api'

export function useTeamSchedule(leagueId, teamId) {
  const [matches, setMatches] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setStatus('loading')
      try {
        const data = await fetchTeamSchedule(leagueId, teamId)
        if (cancelled) return
        setMatches(data)
        setStatus('ready')
      } catch (error) {
        if (cancelled) return
        console.error(error)
        setStatus('error')
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [leagueId, teamId])

  return { matches, status }
}