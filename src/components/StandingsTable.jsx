import { Fragment, useState } from 'react'
import TeamSchedule from './TeamSchedule'
import { useStandings } from '../hooks/useStandings'

function StandingsTable({ leagueId }) {
  const { standings, status } = useStandings(leagueId)
  const [showAll, setShowAll] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)

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
          <Fragment key={team.teamId}>
            <tr
              onClick={() => {
                setSelectedTeam((prev) => (prev?.teamId === team.teamId ? null : team))
              }}
              className="border-t border-slate-200 cursor-pointer hover:bg-slate-50"
            >
              <td
                className="p-2"
                style={{ borderLeftWidth: 4, borderLeftColor: team.zoneColor }}
              >
                {team.position}
              </td>
              <td className="p-2">
                <button
                  type="button"
                  aria-expanded={selectedTeam?.teamId === team.teamId}
                  className="text-left cursor-pointer"
                >
                  <img src={team.logo} alt="" className="mr-2 inline h-5 w-5" />
                  {team.name}
                </button>
              </td>
              <td className="p-2 text-center">{team.gamesPlayed}</td>
              <td className="p-2 text-center">{team.wins}</td>
              <td className="p-2 text-center">{team.ties}</td>
              <td className="p-2 text-center">{team.losses}</td>
              <td className="p-2 text-center">{team.goalDifference}</td>
              <td className="p-2 text-right font-bold">{team.points}</td>
            </tr>

            {selectedTeam?.teamId === team.teamId && (
              <tr>
                <td colSpan={8} className="p-0">
                  <div className="p-3 bg-slate-50">
                    <TeamSchedule
                      leagueId={leagueId}
                      teamId={team.teamId}
                      ourTeamName={team.name}
                      ourTeamLogo={team.logo}
                    />
                  </div>
                </td>
              </tr>
            )}
          </Fragment>
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