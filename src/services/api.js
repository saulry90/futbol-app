const API_ROOT = 'https://site.web.api.espn.com/apis'
const STANDINGS_URL = `${API_ROOT}/v2/sports/soccer`
const SITE_URL = `${API_ROOT}/site/v2/sports/soccer`

// ESPN a veces marca a un equipo suelto (p. ej., con plaza europea por otra
// vía). Si un equipo con zona no tiene ningún vecino con zona, se la quitamos.
function removeIsolatedZones(teams) {
  return teams.map((team, i) => {
    const hasNeighbor = teams[i - 1]?.zone || teams[i + 1]?.zone
    return team.zone && !hasNeighbor ? { ...team, zone: undefined, zoneColor: undefined } : team
  })
}

// ESPN marca dos puestos de Europa League seguidos, pero solo hay uno: el
// segundo es Conference y el que ESPN llama Conference no lleva nada.
// Patrón: [Europa, Europa, Conference] pasa a [Europa, Conference, nada]
function fixEuropeanZones(teams) {
  // ¿Empieza el patrón en la posición i?
  const isPattern = (i) =>
    teams[i]?.zone === 'Europa League' &&
    teams[i + 1]?.zone === 'Europa League' &&
    teams[i + 2]?.zone === 'Conference League qualifying'

  return teams.map((team, i) => {
    // Segundo puesto de Europa League: pasa a ser Conference
    if (isPattern(i - 1)) {
      return { ...team, zone: teams[i + 1].zone, zoneColor: teams[i + 1].zoneColor }
    }
    // Puesto que ESPN llamaba Conference: se queda sin zona
    if (isPattern(i - 2)) {
      return { ...team, zone: undefined, zoneColor: undefined }
    }
    return team
  })
}

export async function fetchStandings(leagueId) {
  const response = await fetch(`${STANDINGS_URL}/${leagueId}/standings`)
  if (!response.ok) {
    throw new Error(`Error ${response.status} al obtener la tabla`)
  }
  const data = await response.json()

  const entries = data.children[0].standings.entries

  const teams = entries.map((entry) => {
    const stats = {}
    entry.stats.forEach((stat) => {
      stats[stat.name] = stat.displayValue
    })

    return {
      position: stats.rank,
      name: entry.team.displayName,
      teamId: entry.team.id,
      logo: entry.team.logos[0]?.href,
      gamesPlayed: stats.gamesPlayed,
      wins: stats.wins,
      ties: stats.ties,
      losses: stats.losses,
      goalDifference: stats.pointDifferential,
      points: stats.points,
      zone: entry.note?.description,
      zoneColor: entry.note?.color?.replace(/^#+/, '#'),
    }
  })

  return removeIsolatedZones(fixEuropeanZones(teams))
}

// type: 'past' (partidos jugados) o 'upcoming' (partidos por jugar)
export async function fetchTeamSchedule(leagueId, teamId, type = 'past') {
  const query = type === 'upcoming' ? '?fixture=true' : ''
  const response = await fetch(`${SITE_URL}/${leagueId}/teams/${teamId}/schedule${query}`)
  if (!response.ok) {
    throw new Error(`Error ${response.status} al obtener el calendario`)
  }
  const data = await response.json()

  return data.events.map((event) => {
    const competition = event.competitions[0]
    const competitors = competition.competitors

    const ourTeam = competitors.find((c) => String(c.team.id) === String(teamId))
    const opponent = competitors.find((c) => String(c.team.id) !== String(teamId))

    return {
      date: event.date,
      opponent: opponent?.team.displayName,
      opponentLogo: opponent?.team.logos?.[0]?.href,
      homeAway: ourTeam?.homeAway,
      ourScore: ourTeam?.score?.displayValue,
      oppScore: opponent?.score?.displayValue,
      completed: competition.status.type.completed,
      state: competition.status.type.state,
      status: competition.status.type.description,
    }
  })
}
