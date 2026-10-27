const BASE_URL = 'https://site.web.api.espn.com/apis/v2/sports/soccer'

export async function fetchStandings(leagueId) {
  const response = await fetch(`${BASE_URL}/${leagueId}/standings`)
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