const API_ROOT = 'https://site.web.api.espn.com/apis'
const STANDINGS_URL = `${API_ROOT}/v2/sports/soccer`
const SITE_URL = `${API_ROOT}/site/v2/sports/soccer`

export async function fetchStandings(leagueId) {
  const response = await fetch(`${STANDINGS_URL}/${leagueId}/standings`)
  if (!response.ok) {
    throw new Error(`Error ${response.status} al obtener la tabla`)
  }
  const data = await response.json()

  const entries = data.children[0].standings.entries

  return entries.map((entry) => {
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
      zoneColor: entry.note?.color,
    }
  })
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
