import { useState } from 'react'
import { formatDate, formatDateTime, getResultColor } from '../utils/matchHelpers'
import { useTeamSchedule } from '../hooks/useTeamSchedule'

const INITIAL_VISIBLE = 5

function TeamLabel({ name, logo }) {
  return (
    <>
      {logo && <img src={logo} alt={name} className="h-4 w-4" />}
      {name}
    </>
  )
}

function MatchScore({ match }) {
  if (match.completed) {
    return (
      <span className={`font-semibold ${getResultColor(match.ourScore, match.oppScore)}`}>
        {match.ourScore} - {match.oppScore}
      </span>
    )
  }

  // state 'pre' = aún no ha empezado; otros estados (en juego, aplazado...) muestran su descripción
  return <span className="text-slate-500">{match.state === 'pre' ? 'vs' : match.status}</span>
}

function MatchList({ leagueId, teamId, ourTeamName, ourTeamLogo, type }) {
  const { matches, status } = useTeamSchedule(leagueId, teamId, type)
  const [showAll, setShowAll] = useState(false)

  if (status === 'loading') {
    return <p className="mt-4">Cargando partidos...</p>
  }

  if (status === 'error') {
    return <p className="mt-4">No se pudieron cargar los partidos.</p>
  }

  if (matches.length === 0) {
    return <p className="mt-4 text-sm text-slate-500">No hay partidos disponibles.</p>
  }

  const displayedMatches = showAll ? matches : matches.slice(0, INITIAL_VISIBLE)

  return (
    <div className="mt-2">
      <ul className="space-y-1">
        {displayedMatches.map((match, index) => {
          const isHome = match.homeAway === 'home'
          const ourTeam = <TeamLabel name={ourTeamName} logo={ourTeamLogo} />
          const opponent = <TeamLabel name={match.opponent} logo={match.opponentLogo} />

          return (
            <li key={index} className="border-t border-slate-200 py-2 text-sm">
              <span className="text-slate-500">
                {match.completed ? formatDate(match.date) : formatDateTime(match.date)}
              </span>{' '}
              —{' '}
              <span className="inline-flex items-center gap-1">
                {isHome ? ourTeam : opponent}
                <MatchScore match={match} />
                {isHome ? opponent : ourTeam}
              </span>
            </li>
          )
        })}
      </ul>
      {matches.length > INITIAL_VISIBLE && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="mt-3 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showAll ? 'Mostrar menos' : 'Mostrar más'}
        </button>
      )}
    </div>
  )
}

export default MatchList
