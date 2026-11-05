import { Fragment, useState } from 'react'
import TeamSchedule from './TeamSchedule'
import { useStandings } from '../hooks/useStandings'

function StandingsTable({ leagueId }) {
  const { standings, status } = useStandings(leagueId)
  const [selectedTeam, setSelectedTeam] = useState(null)

  if (status === 'loading') {
    return <p>Cargando tabla...</p>
  }

  if (status === 'error') {
    return <p>No se pudo cargar la tabla. Inténtalo más tarde.</p>
  }

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
        {standings.map((team) => (
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
    </div>
  )
}

export default StandingsTable