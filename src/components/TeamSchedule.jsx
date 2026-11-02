import { formatDate, getResultColor } from '../utils/matchHelpers'
import { useTeamSchedule } from '../hooks/useTeamSchedule'

function TeamSchedule({ leagueId, teamId, ourTeamName, ourTeamLogo }) {
  const { matches, status } = useTeamSchedule(leagueId, teamId)

  if (status === 'loading') {
    return <p>Cargando partidos...</p>
  }

  if (status === 'error') {
    return <p>No se pudieron cargar los partidos.</p>
  }

  if (matches.length === 0) {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Últimos partidos</h3>
        <p className="mt-2 text-sm text-slate-500">No hay partidos disponibles.</p>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Últimos partidos</h3>
      <ul className="mt-2 space-y-1">
        {matches.map((match, index) => (
          <li key={index} className="border-t border-slate-200 py-2 text-sm">
            <span className="text-slate-500">{formatDate(match.date)}</span> —{' '}
            {match.homeAway === 'home' ? (
              <span className="inline-flex items-center gap-1">
                {ourTeamLogo && <img src={ourTeamLogo} alt={ourTeamName} className="h-4 w-4" />}
                {ourTeamName}
                {' '}
                {match.completed ? (
                  <span className={`font-semibold ${getResultColor(match.ourScore, match.oppScore)}`}>
                    {match.ourScore} - {match.oppScore}
                  </span>
                ) : (
                  <span className="text-slate-500">{match.status}</span>
                )}
                {' '}
                {match.opponentLogo && <img src={match.opponentLogo} alt={match.opponent} className="h-4 w-4" />}
                {match.opponent}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                {match.opponentLogo && <img src={match.opponentLogo} alt={match.opponent} className="h-4 w-4" />}
                {match.opponent}
                {' '}
                {match.completed ? (
                  <span className={`font-semibold ${getResultColor(match.ourScore, match.oppScore)}`}>
                    {match.ourScore} - {match.oppScore}
                  </span>
                ) : (
                  <span className="text-slate-500">{match.status}</span>
                )}
                {' '}
                {ourTeamLogo && <img src={ourTeamLogo} alt={ourTeamName} className="h-4 w-4" />}
                {ourTeamName}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TeamSchedule