import { DateTime, Duration } from 'luxon'

// variables

export const API_URL = 'https://tennis-history-backend-a82162895ecd.herokuapp.com/'

// functions

export const categorySrc = (category: string) => {
    return new URL(`../assets/category/${category}.svg`, import.meta.url).href
}

export const flagSrc = (country: string) => {
    return new URL(`../assets/flags/${country}.svg`, import.meta.url).href
}

export const headshot = (player: string) => {
    return new URL(`https://www.atptour.com/-/media/alias/player-headshot/${player}`).href
}

export const gladiator = (player: string) => {
    return new URL(`https://www.atptour.com/-/media/alias/player-gladiator-headshot/${player}`).href
}

export const formattedDates = (start: Date, end: Date) => {
    const startDate = DateTime.fromISO(start)
    const endDate = DateTime.fromISO(end)

    if (startDate.year !== endDate.year) {
        return `${startDate.setLocale('gb').toFormat('dd MMMM yyyy')} - ${endDate.setLocale('gb').toFormat('dd MMMM yyyy')}`
    } else if (startDate.month !== endDate.month) {
        return `${startDate.setLocale('gb').toFormat('dd MMMM')} - ${endDate.setLocale('gb').toFormat('dd MMMM yyyy')}`
    } else {
        return `${startDate.day} - ${endDate.setLocale('gb').toFormat('dd MMMM yyyy')}`
    }
}

export const formatDate = (ISODate: Date) => {
    const date = DateTime.fromISO(ISODate)
    return date.setLocale('gb').toLocaleString(DateTime.DATE_HUGE)
}

export const formatCurrency = (currency: string, amount: number) => {
    return amount.toLocaleString('en-gb', {style: 'currency', currency: currency})
}

export const formatTime = (time: number) => {
    const minutes = Duration.fromObject({minutes: time})
    return minutes.toFormat('hh:mm')
}

export const encodeName = (name: string) => {
    return name.replace(/ /g, '_')
}

export const status = (seed: number | null, status: string | null) => {
    return seed && status ? `(${seed} ${status})` : seed ? `(${seed})` : `(${status})`
}

export const round = (roundNumber: string) => {
    switch (roundNumber) {
        case '128':
            return 'Round of 128'
        case '64':
            return 'Round of 64'
        case '32':
            return 'Round of 32'
        case '16':
            return 'Round of 16'
        case 'QF':
            return 'Quarterfinals'
        case 'SF':
            return 'Semifinals'
        case 'F':
            return 'Final'
    }
}

export const incomplete = (status: string) => {
    switch (status) {
        case 'R':
            return 'Ret.'
        case 'D':
            return 'Def.'
        case 'WO':
            return 'Walkover'
    }
}

export const plays = (hand: boolean) => {
    return hand ? 'Right-handed' : 'Left-handed'
}

export const bh = (value: boolean) => {
    return value ? 'One-handed' : 'Two-handed'
}

export const percentage = (value1: number, total: number) => {
    return value1 / total * 100
}

type GenericObject = { [key: string]: any };

export function groupObjectsByKey(array: GenericObject[], key: string): { [key: string]: GenericObject[] } {
  const groupedArrays: { [key: string]: GenericObject[] } = {};

  array.forEach(obj => {
    const value = obj[key];
    if (!groupedArrays[value]) {
      groupedArrays[value] = [obj];
    } else {
      groupedArrays[value].push(obj);
    }
  });

  return groupedArrays;
}

export function tiebreak (matchScore: number, tiebreakScore: number) {
    if (matchScore === 6) {
        return tiebreakScore
    } else {
        return
    }
}