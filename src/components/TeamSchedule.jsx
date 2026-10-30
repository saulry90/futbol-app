import { useEffect, useState } from 'react'
import { fetchTeamSchedule } from '../services/api'

function TeamSchedule({ leagueId, teamId }) {
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
        setStatus('error')
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [leagueId, teamId])

  if (status === 'loading') {
    return <p>Cargando partidos...</p>
  }

  if (status === 'error') {
    return <p>No se pudieron cargar los partidos.</p>
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Últimos partidos</h3>
      <ul className="mt-2 space-y-1">
        {matches.map((match, index) => (
          <li key={index} className="border-t border-slate-200 py-2 text-sm">
            <span className="text-slate-500">{match.date}</span> — {match.homeAway === 'home' ? 'vs' : '@'} {match.opponent}{' '}
            {match.completed ? (
              <span className="font-semibold">
                {match.ourScore} - {match.oppScore}
              </span>
            ) : (
              <span className="text-slate-500">{match.status}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TeamSchedule