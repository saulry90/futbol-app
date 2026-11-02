import { formatDate, getResultColor } from '../utils/matchHelpers'
import { useTeamSchedule } from '../hooks/useTeamSchedule'

function TeamLabel({ name, logo }) {
  return (
    <>
      {logo && <img src={logo} alt={name} className="h-4 w-4" />}
      {name}
    </>
  )
}

function MatchScore({ match }) {
  if (!match.completed) {
    return <span className="text-slate-500">{match.status}</span>
  }

  return (
    <span className={`font-semibold ${getResultColor(match.ourScore, match.oppScore)}`}>
      {match.ourScore} - {match.oppScore}
    </span>
  )
}

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
        {matches.map((match, index) => {
          const isHome = match.homeAway === 'home'
          const ourTeam = <TeamLabel name={ourTeamName} logo={ourTeamLogo} />
          const opponent = <TeamLabel name={match.opponent} logo={match.opponentLogo} />

          return (
            <li key={index} className="border-t border-slate-200 py-2 text-sm">
              <span className="text-slate-500">{formatDate(match.date)}</span> —{' '}
              <span className="inline-flex items-center gap-1">
                {isHome ? ourTeam : opponent}
                <MatchScore match={match} />
                {isHome ? opponent : ourTeam}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TeamSchedule
