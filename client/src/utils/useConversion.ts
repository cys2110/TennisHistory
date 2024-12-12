import convert from 'convert'
import { DateTime, Duration } from 'luxon'

export function useConversion() {
  const percentage = (value1: number, total: number) => {
    return parseInt(((value1 / total) * 100).toFixed(0))
  }

  const formatCurrency = (currency: string, amount: number) => {
    return amount.toLocaleString('en-GB', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    })
  }

  const formatDate = (ISODate: string) => {
    const date = DateTime.fromISO(ISODate)
    return date.setLocale('gb').toLocaleString(DateTime.DATE_HUGE)
  }

  const smallDate = (ISOdate: string) => {
    const date = DateTime.fromISO(ISOdate)
    return date.setLocale('gb').toLocaleString(DateTime.DATE_SHORT)
  }

  const shorterDate = (ISOdate: string) => {
    const date = DateTime.fromISO(ISOdate)
    return date.setLocale('gb').toLocaleString(DateTime.DATE_FULL)
  }

  const formattedDates = (start: string, end: string) => {
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

  const formatTime = (time: number) => {
    const minutes = Duration.fromObject({ minutes: time })
    return minutes.toFormat('hh:mm')
  }

  const convertToFt = (cm: number) => {
    const ftDecimal = convert(cm, 'cm').to('ft')
    const ft = Math.floor(ftDecimal)
    const inches = Math.round((ftDecimal - ft) * 12)
    return `${ft}'${inches}"`
  }

  return {
    percentage,
    formatCurrency,
    formatDate,
    smallDate,
    formattedDates,
    formatTime,
    convertToFt,
    shorterDate,
  }
}
