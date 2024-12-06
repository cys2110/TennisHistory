import { DateTime, Duration } from 'luxon'
import convert from 'convert'

export const encodeName = (name) => {
  return name.replace(/ /g, '_')
}

export const unencodeName = (name) => {
  return name.replace(/_/g, ' ')
}

export const headshot = (player) => {
  return new URL(`https://www.atptour.com/-/media/alias/player-headshot/${player}`).href
}

export const gladiator = (player) => {
  return new URL(`https://www.atptour.com/-/media/alias/player-gladiator-headshot/${player}`).href
}

export const categorySrc = (category) => {
  return new URL(`../assets/category/${category}.svg`, import.meta.url).href
}

export const flag = (country) => {
  return new URL(`../assets/flags/${country}.svg`, import.meta.url).href
}

export const percentage = (value1, total) => {
  return parseInt(((value1 / total) * 100).toFixed(0))
}

export const formatCurrency = (currency, amount) => {
  return amount.toLocaleString('en-GB', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  })
}

export const formatDate = (ISODate) => {
  const date = DateTime.fromISO(ISODate)
  return date.setLocale('gb').toLocaleString(DateTime.DATE_HUGE)
}

export const smallDate = (ISOdate) => {
  const date = DateTime.fromISO(ISOdate)
  return date.setLocale('gb').toLocaleString(DateTime.DATE_SHORT)
}

export const formattedDates = (start, end) => {
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

export const formatTime = (time) => {
  const minutes = Duration.fromObject({ minutes: time })
  return minutes.toFormat('hh:mm')
}

export const convertToFt = (cm) => {
  const ftDecimal = convert(cm, 'cm').to('ft')
  const ft = Math.floor(ftDecimal)
  const inches = Math.round((ftDecimal - ft) * 12)
  return `${ft}'${inches}"`
}

export const getLowerTb = (score1, score2) => {
  return score1 > score2 ? score2 : score1
}

export const getEntry = (entry) => {
  if (entry.seed && entry.status) {
    return `(${entry.seed} ${entry.status})`
  } else if (entry.seed || entry.status) {
    return `(${entry.seed || entry.status})`
  }
}

export const updateDocumentTitle = (title) => {
  document.title = title
}
