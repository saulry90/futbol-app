import { useEffect, useState } from 'react'
import { fetchStandings } from '../services/api'

function StandingsTable({ leagueId }) {
  const [standings, setStandings] = useState([])
  const [status, setStatus] = useState('loading')
  const [showAll, setShowAll] = useState(false)

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

    // Reset view when league changes
    setShowAll(false)

    load()

    return () => {
      cancelled = true
    }
  }, [leagueId])

  if (status === 'loading') {
    return <p>Cargando tabla...</p>
  }

  if (status === 'error') {
    return <p>No se pudo cargar la tabla. Inténtalo más tarde.</p>
  }

  const displayedStandings = showAll ? standings : standings.slice(0, 5)

  return (
    <div>
      <table className="mt-4 w-full border-collapse">
        <thead>
          <tr className="text-left text-sm text-slate-500">
            <th className="p-2">#</th>
            <th className="p-2">Equipo</th>
            <th className="p-2 text-center">PJ</th>
            <th className="p-2 text-center">G</th>
            <th className="p-2 text-center">E</th>
            <th className="p-2 text-center">P</th>
            <th className="p-2 text-center">GD</th>
            <th className="p-2 text-right">Pts</th>
          </tr>
        </thead>
        <tbody>
          {displayedStandings.map((team) => (
            <tr key={team.name} className="border-t border-slate-200">
              <td
                className="p-2"
                style={{ borderLeftWidth: 4, borderLeftColor: team.zoneColor }}
              >
                {team.position}
              </td>
              <td className="p-2">
                <img src={team.logo} alt={team.name} className="mr-2 inline h-5 w-5" />
                {team.name}
              </td>
              <td className="p-2 text-center">{team.gamesPlayed}</td>
              <td className="p-2 text-center">{team.wins}</td>
              <td className="p-2 text-center">{team.ties}</td>
              <td className="p-2 text-center">{team.losses}</td>
              <td className="p-2 text-center">{team.goalDifference}</td>
              <td className="p-2 text-right font-bold">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {standings.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showAll ? 'Mostrar menos' : 'Mostrar más'}
        </button>
      )}
    </div>
  )
}

export default StandingsTable