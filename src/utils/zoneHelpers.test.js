import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fixEuropeanZones, removeIsolatedZones } from './zoneHelpers.js'

// Crea un equipo de prueba con la zona indicada (o sin zona)
const team = (position, zone) => ({
  position: String(position),
  zone,
  zoneColor: zone ? '#000' : undefined,
})

// Lista de zonas de un resultado, para compararla de un vistazo
const zonesOf = (teams) => teams.map((t) => t.zone)

test('removeIsolatedZones: quita la zona de un equipo sin vecinos con zona', () => {
  const teams = [
    team(1, 'Champions League'),
    team(2, 'Champions League'),
    team(3, undefined),
    team(4, 'Europa League'), // aislado: ni el 3 ni el 5 tienen zona
    team(5, undefined),
    team(6, undefined),
  ]

  assert.deepEqual(zonesOf(removeIsolatedZones(teams)), [
    'Champions League',
    'Champions League',
    undefined,
    undefined,
    undefined,
    undefined,
  ])
})

test('removeIsolatedZones: conserva la zona de un solo equipo si está pegada a otra', () => {
  const teams = [
    team(1, 'Champions League'),
    team(2, 'Champions League'),
    team(3, 'Europa League'), // pegado al 2, que sí tiene zona
    team(4, undefined),
    team(5, undefined),
    team(6, undefined),
  ]

  assert.deepEqual(zonesOf(removeIsolatedZones(teams)), [
    'Champions League',
    'Champions League',
    'Europa League',
    undefined,
    undefined,
    undefined,
  ])
})

test('removeIsolatedZones: quita la zona del primer o del último equipo si están aislados', () => {
  const first = [team(1, 'Europa League'), team(2, undefined), team(3, undefined)]
  const last = [team(1, undefined), team(2, undefined), team(3, 'Europa League')]

  assert.deepEqual(zonesOf(removeIsolatedZones(first)), [undefined, undefined, undefined])
  assert.deepEqual(zonesOf(removeIsolatedZones(last)), [undefined, undefined, undefined])
})

test('removeIsolatedZones: conserva la zona del primer o del último equipo si su vecino tiene zona', () => {
  const first = [team(1, 'Champions League'), team(2, 'Champions League'), team(3, undefined)]
  const last = [team(1, undefined), team(2, 'Relegation'), team(3, 'Relegation')]

  assert.deepEqual(zonesOf(removeIsolatedZones(first)), ['Champions League', 'Champions League', undefined])
  assert.deepEqual(zonesOf(removeIsolatedZones(last)), [undefined, 'Relegation', 'Relegation'])
})

test('removeIsolatedZones: no rompe con una lista vacía ni con una lista sin zonas', () => {
  assert.deepEqual(removeIsolatedZones([]), [])
  assert.deepEqual(
    zonesOf(removeIsolatedZones([team(1, undefined), team(2, undefined)])),
    [undefined, undefined],
  )
})

test('removeIsolatedZones: no modifica la lista que recibe', () => {
  const teams = [
    team(1, 'Champions League'), // aislado: se quitará en el resultado
    team(2, undefined),
    team(3, 'Europa League'), // aislado: se quitará en el resultado
    team(4, undefined),
  ]
  const copy = structuredClone(teams)

  removeIsolatedZones(teams)

  assert.deepEqual(teams, copy)
})

test('fixEuropeanZones: Europa, Europa y Conference seguidas pasan a Europa, Conference y nada', () => {
  const teams = [
    team(1, 'Champions League'),
    team(2, 'Europa League'),
    team(3, 'Europa League'), // el segundo Europa es en realidad Conference
    team(4, 'Conference League qualifying'), // el que ESPN llama Conference no lleva nada
    team(5, undefined),
  ]

  assert.deepEqual(zonesOf(fixEuropeanZones(teams)), [
    'Champions League',
    'Europa League',
    'Conference League qualifying',
    undefined,
    undefined,
  ])
})

test('fixEuropeanZones: no cambia nada si tras dos Europa no viene una Conference', () => {
  const teams = [team(1, 'Europa League'), team(2, 'Europa League'), team(3, 'Champions League')]

  assert.deepEqual(zonesOf(fixEuropeanZones(teams)), [
    'Europa League',
    'Europa League',
    'Champions League',
  ])
})

test('fixEuropeanZones: no cambia nada si solo hay un puesto de Europa League', () => {
  const teams = [team(1, 'Europa League'), team(2, 'Conference League qualifying'), team(3, undefined)]

  assert.deepEqual(zonesOf(fixEuropeanZones(teams)), [
    'Europa League',
    'Conference League qualifying',
    undefined,
  ])
})

test('fixEuropeanZones: aplica la regla aunque el patrón esté en otra posición de la tabla', () => {
  const teams = [
    team(1, 'Champions League'),
    team(2, 'Champions League'),
    team(3, 'Champions League'),
    team(4, 'Europa League'),
    team(5, 'Europa League'),
    team(6, 'Conference League qualifying'),
    team(7, undefined),
  ]

  assert.deepEqual(zonesOf(fixEuropeanZones(teams)), [
    'Champions League',
    'Champions League',
    'Champions League',
    'Europa League',
    'Conference League qualifying',
    undefined,
    undefined,
  ])
})

test('fixEuropeanZones: no rompe con una lista vacía', () => {
  assert.deepEqual(fixEuropeanZones([]), [])
})

test('fixEuropeanZones: el segundo Europa recibe el color de la Conference', () => {
  const teams = [
    { ...team(1, 'Europa League'), zoneColor: '#aaaaaa' },
    { ...team(2, 'Europa League'), zoneColor: '#bbbbbb' },
    { ...team(3, 'Conference League qualifying'), zoneColor: '#cccccc' },
  ]

  const colors = fixEuropeanZones(teams).map((t) => t.zoneColor)

  assert.deepEqual(colors, ['#aaaaaa', '#cccccc', undefined])
})

test('fixEuropeanZones: no modifica la lista que recibe', () => {
  const teams = [
    team(1, 'Europa League'),
    team(2, 'Europa League'),
    team(3, 'Conference League qualifying'),
  ]
  const copy = structuredClone(teams)

  fixEuropeanZones(teams)

  assert.deepEqual(teams, copy)
})
