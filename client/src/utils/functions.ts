import { DateTime, Duration } from 'luxon'
import convert from 'convert'
import { StatusInfo } from './types'

// FIXME: Delete extraneous functions

export const encodeName = (name: string) => {
  return name.replace(/ /g, '_')
}

export const unencodeName = (name: string) => {
  return name.replace(/_/g, ' ')
}

export const headshot = (player: string) => {
  return new URL(`https://www.atptour.com/-/media/alias/player-headshot/${player}`).href
}

export const gladiator = (player: string) => {
  return new URL(`https://www.atptour.com/-/media/alias/player-gladiator-headshot/${player}`).href
}

export const categorySrc = (category: string) => {
  return new URL(`../assets/category/${category}.svg`, import.meta.url).href
}

export const percentage = (value1: number, total: number) => {
  return parseInt(((value1 / total) * 100).toFixed(0))
}

export const formatCurrency = (currency: string, amount: number) => {
  return amount.toLocaleString('en-GB', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  })
}

export const formatDate = (ISODate: string) => {
  const date = DateTime.fromISO(ISODate)
  return date.setLocale('gb').toLocaleString(DateTime.DATE_HUGE)
}

export const smallDate = (ISOdate: string) => {
  const date = DateTime.fromISO(ISOdate)
  return date.setLocale('gb').toLocaleString(DateTime.DATE_SHORT)
}

export const formattedDates = (start: string, end: string) => {
  const startDateISO = DateTime.fromISO(start)
  const endDateISO = DateTime.fromISO(end)
  const startDate =
    startDateISO.year !== endDateISO.year
      ? startDateISO.setLocale('gb').toFormat('dd MMMM yyyy')
      : startDateISO.month !== endDateISO.month
        ? startDateISO.setLocale('gb').toFormat('dd MMMM')
        : startDateISO.setLocale('gb').toFormat('dd')
  const endDate = endDateISO.setLocale('gb').toFormat('dd MMMM yyyy')

  return `${startDate} - ${endDate}`
}

export const formatTime = (time: number) => {
  const minutes = Duration.fromObject({ minutes: time })
  return minutes.toFormat('hh:mm')
}

export const convertToFt = (cm: number) => {
  const ftDecimal = convert(cm, 'cm').to('ft')
  const ft = Math.floor(ftDecimal)
  const inches = Math.round((ftDecimal - ft) * 12)
  return `${ft}'${inches}"`
}

export const getLowerTb = (score1: number, score2: number) => {
  return score1 > score2 ? score2 : score1
}

export const getEntry = (entry: { seed: number | null; status: StatusInfo | null }) => {
  if (entry.seed && entry.status) {
    return `(${entry.seed} ${entry.status})`
  } else if (entry.seed || entry.status) {
    return `(${entry.seed || entry.status})`
  }
}

export const updateDocumentTitle = (title: string) => {
  document.title = `${title} | TennisHistory`
}
