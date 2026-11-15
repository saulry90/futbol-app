// ESPN a veces marca a un equipo suelto (p. ej., con plaza europea por otra
// vía). Si un equipo con zona no tiene ningún vecino con zona, se la quitamos.
export function removeIsolatedZones(teams) {
  return teams.map((team, i) => {
    const hasNeighbor = teams[i - 1]?.zone || teams[i + 1]?.zone
    return team.zone && !hasNeighbor ? { ...team, zone: undefined, zoneColor: undefined } : team
  })
}

// ESPN marca dos puestos de Europa League seguidos, pero solo hay uno: el
// segundo es Conference y el que ESPN llama Conference no lleva nada.
// Patrón: [Europa, Europa, Conference] pasa a [Europa, Conference, nada]
export function fixEuropeanZones(teams) {
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
