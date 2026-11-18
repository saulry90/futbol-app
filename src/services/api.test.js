import { test, afterEach, mock } from 'node:test'
import assert from 'node:assert/strict'
import { fetchStandings, fetchTeamSchedule } from './api.js'

// Crea una entrada con la forma de ESPN (solo los campos que lee api.js)
function entry(position, name, note) {
  const stat = (statName, displayValue) => ({ name: statName, displayValue })

  return {
    team: {
      id: String(100 + position),
      displayName: name,
      logos: [{ href: `https://logos.test/${position}.png` }],
    },
    stats: [
      stat('rank', String(position)),
      stat('gamesPlayed', '9'),
      stat('wins', '6'),
      stat('ties', '3'),
      stat('losses', '0'),
      stat('pointDifferential', '+20'),
      stat('points', '21'),
    ],
    note,
  }
}

// Sustituye fetch por una versión falsa que devuelve las entradas indicadas
function mockEspn(entries) {
  mock.method(globalThis, 'fetch', async () => ({
    ok: true,
    status: 200,
    json: async () => ({ children: [{ standings: { entries } }] }),
  }))
}

afterEach(() => {
  mock.restoreAll()
})

test('fetchStandings: convierte una entrada de ESPN en los campos que usa la app', async () => {
  const champions = { color: '#81D6AC', description: 'Champions League' }
  // Dos equipos con zona, para que la primera no se considere aislada
  mockEspn([entry(1, 'Bayern Munich', champions), entry(2, 'Dortmund', champions)])

  const standings = await fetchStandings('ger.1')

  assert.deepEqual(standings[0], {
    position: '1',
    name: 'Bayern Munich',
    teamId: '101',
    logo: 'https://logos.test/1.png',
    gamesPlayed: '9',
    wins: '6',
    ties: '3',
    losses: '0',
    goalDifference: '+20',
    points: '21',
    zone: 'Champions League',
    zoneColor: '#81D6AC',
  })
})

test('fetchStandings: arregla el # repetido de los colores y respeta los correctos', async () => {
  mockEspn([
    entry(1, 'Bayern Munich', { color: '#81D6AC', description: 'Champions League' }),
    entry(2, 'Dortmund', { color: '##B5E7CE', description: 'Champions League' }),
  ])

  const standings = await fetchStandings('ger.1')

  assert.deepEqual(
    standings.map((t) => t.zoneColor),
    ['#81D6AC', '#B5E7CE'],
  )
})

test('fetchStandings: un equipo sin nota de ESPN queda sin zona ni color', async () => {
  const champions = { color: '#81D6AC', description: 'Champions League' }
  mockEspn([
    entry(1, 'Bayern Munich', champions),
    entry(2, 'Dortmund', champions),
    entry(3, 'Leipzig'), // sin nota: no pertenece a ninguna zona
  ])

  const standings = await fetchStandings('ger.1')

  assert.equal(standings[2].zone, undefined)
  assert.equal(standings[2].zoneColor, undefined)
})

test('fetchStandings: aplica las dos reglas de zonas', async () => {
  const zone = (description) => ({ color: '#123456', description })
  mockEspn([
    entry(1, 'Equipo 1', zone('Champions League')),
    entry(2, 'Equipo 2', zone('Champions League')),
    entry(3, 'Equipo 3', zone('Europa League')),
    entry(4, 'Equipo 4', zone('Europa League')), // la regla de Europa lo pasa a Conference
    entry(5, 'Equipo 5', zone('Conference League qualifying')), // y este se queda sin zona
    entry(6, 'Equipo 6'),
    entry(7, 'Equipo 7', zone('Europa League')), // aislado: la otra regla se la quita
    entry(8, 'Equipo 8'),
  ])

  const standings = await fetchStandings('ger.1')

  assert.deepEqual(
    standings.map((t) => t.zone),
    [
      'Champions League',
      'Champions League',
      'Europa League',
      'Conference League qualifying',
      undefined,
      undefined,
      undefined,
      undefined,
    ],
  )
})

test('fetchStandings: pide la tabla de la liga indicada a ESPN', async () => {
  mockEspn([])

  await fetchStandings('ger.1')

  const calls = globalThis.fetch.mock.calls
  assert.equal(calls.length, 1)
  assert.equal(
    calls[0].arguments[0],
    'https://site.web.api.espn.com/apis/v2/sports/soccer/ger.1/standings',
  )
})

test('fetchStandings: lanza un error si ESPN responde con fallo', async () => {
  mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 500 }))

  await assert.rejects(fetchStandings('ger.1'), { message: 'Error 500 al obtener la tabla' })
})

// Crea un partido con la forma de ESPN (solo los campos que lee fetchTeamSchedule).
// El equipo "10" juega en casa contra el "20".
function event({ homeScore = '2', awayScore = '1', completed = true, state = 'post' } = {}) {
  const competitor = (id, name, homeAway, score) => ({
    team: { id, displayName: name, logos: [{ href: `https://logos.test/${id}.png` }] },
    homeAway,
    score: { displayValue: score },
  })

  return {
    date: '2026-03-01T12:00Z',
    competitions: [
      {
        competitors: [
          competitor('10', 'Local', 'home', homeScore),
          competitor('20', 'Visitante', 'away', awayScore),
        ],
        status: { type: { completed, state, description: 'Full Time' } },
      },
    ],
  }
}

// Igual que mockEspn, pero con la forma de respuesta del calendario
function mockSchedule(events) {
  mock.method(globalThis, 'fetch', async () => ({
    ok: true,
    status: 200,
    json: async () => ({ events }),
  }))
}

test('fetchTeamSchedule: convierte un partido de ESPN en los campos que usa la app', async () => {
  mockSchedule([event()])

  const matches = await fetchTeamSchedule('ger.1', '10')

  assert.deepEqual(matches[0], {
    date: '2026-03-01T12:00Z',
    opponent: 'Visitante',
    opponentLogo: 'https://logos.test/20.png',
    homeAway: 'home',
    ourScore: '2',
    oppScore: '1',
    completed: true,
    state: 'post',
    status: 'Full Time',
  })
})

test('fetchTeamSchedule: si el equipo es el visitante, invierte rival, localía y marcadores', async () => {
  mockSchedule([event()])

  const matches = await fetchTeamSchedule('ger.1', '20')

  assert.equal(matches[0].opponent, 'Local')
  assert.equal(matches[0].homeAway, 'away')
  assert.equal(matches[0].ourScore, '1')
  assert.equal(matches[0].oppScore, '2')
})

test('fetchTeamSchedule: por defecto pide los partidos jugados, sin parámetros extra', async () => {
  mockSchedule([])

  await fetchTeamSchedule('ger.1', '10')

  assert.equal(
    globalThis.fetch.mock.calls[0].arguments[0],
    'https://site.web.api.espn.com/apis/site/v2/sports/soccer/ger.1/teams/10/schedule',
  )
})

test('fetchTeamSchedule: los próximos partidos se piden con ?fixture=true', async () => {
  mockSchedule([event({ completed: false, state: 'pre' })])

  const matches = await fetchTeamSchedule('ger.1', '10', 'upcoming')

  assert.equal(
    globalThis.fetch.mock.calls[0].arguments[0],
    'https://site.web.api.espn.com/apis/site/v2/sports/soccer/ger.1/teams/10/schedule?fixture=true',
  )
  assert.equal(matches[0].completed, false)
  assert.equal(matches[0].state, 'pre')
})

test('fetchTeamSchedule: lanza un error si ESPN responde con fallo', async () => {
  mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 500 }))

  await assert.rejects(fetchTeamSchedule('ger.1', '10'), {
    message: 'Error 500 al obtener el calendario',
  })
})
