export function getResultColor(ourScore, oppScore) {
  if (ourScore == null || oppScore == null) return ''
  if (Number(ourScore) > Number(oppScore)) return 'text-green-600'
  if (Number(ourScore) < Number(oppScore)) return 'text-red-600'
  return 'text-slate-600'
}

export function formatDateTime(dateString) {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) return dateString

  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(dateString) {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) return dateString

  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
  })
}