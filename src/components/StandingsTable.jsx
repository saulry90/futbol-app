import { Fragment, useState } from 'react'
import TeamSchedule from './TeamSchedule'
import { useStandings } from '../hooks/useStandings'
import { zoneStyles } from '../data/zones'

// Nombre y color de la zona de un equipo: los nuestros si la conocemos,
// y si no, los que manda ESPN
function getZone(team) {
  const known = zoneStyles[team.zone]
  return {
    label: known?.label ?? team.zone,
    color: known?.color ?? team.zoneColor,
  }
}

function StandingsTable({ leagueId }) {
  const { standings, status } = useStandings(leagueId)
  const [selectedTeam, setSelectedTeam] = useState(null)

  if (status === 'loading') {
    return <p>Cargando tabla...</p>
  }

  if (status === 'error') {
    return <p>No se pudo cargar la tabla. Inténtalo más tarde.</p>
  }

  const zones = new Map()
  standings.forEach((team) => {
    const { label, color } = getZone(team)
    if (team.zone && !zones.has(label)) {
      zones.set(label, color)
    }
  })

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
                style={{ borderLeftWidth: 4, borderLeftColor: getZone(team).color }}
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
      {zones.size > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          {[...zones].map(([name, color]) => (
            <li key={name} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default StandingsTable