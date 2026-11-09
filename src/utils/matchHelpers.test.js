import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatDate, formatDateTime, getResultColor } from './matchHelpers.js'

test('getResultColor: una victoria se pinta en verde', () => {
  assert.equal(getResultColor('2', '1'), 'text-green-600')
})

test('getResultColor: una derrota se pinta en rojo', () => {
  assert.equal(getResultColor('0', '3'), 'text-red-600')
})

test('getResultColor: un empate se pinta en gris', () => {
  assert.equal(getResultColor('1', '1'), 'text-slate-600')
})

test('getResultColor: si falta algún marcador devuelve cadena vacía', () => {
  assert.equal(getResultColor(undefined, '1'), '')
  assert.equal(getResultColor('1', null), '')
})

test('getResultColor: compara números y no texto ("10" gana a "9")', () => {
  assert.equal(getResultColor('10', '9'), 'text-green-600')
})

test('getResultColor: un 0-0 es un empate, no un dato ausente', () => {
  assert.equal(getResultColor('0', '0'), 'text-slate-600')
})

test('getResultColor: un marcador que no es un número se trata como empate (comportamiento actual)', () => {
  assert.equal(getResultColor('abc', '1'), 'text-slate-600')
})

test('formatDate: una fecha válida se muestra como día y mes', () => {
  // A las 12:00 UTC el día es el mismo en casi cualquier zona horaria
  assert.equal(formatDate('2026-11-07T12:00Z'), '07 nov')
})

test('formatDate: si la fecha no es válida devuelve lo que recibió', () => {
  assert.equal(formatDate('basura'), 'basura')
  assert.equal(formatDate(''), '')
  assert.equal(formatDate(undefined), undefined)
})

test('formatDateTime: una fecha válida se muestra con día, mes y hora', () => {
  // La hora exacta depende de la zona horaria, así que solo comprobamos su forma
  assert.match(formatDateTime('2026-11-07T12:00Z'), /^07 nov,? \d{2}:\d{2}$/)
})

test('formatDateTime: si la fecha no es válida devuelve lo que recibió', () => {
  assert.equal(formatDateTime('basura'), 'basura')
  assert.equal(formatDateTime(''), '')
  assert.equal(formatDateTime(undefined), undefined)
})
