import { useDate } from 'vuetify';

export function headshot(player) {
    return new URL(`https://www.atptour.com/-/media/alias/player-headshot/${player}`).href
}

export function gladiator(player) {
    return new URL(`https://www.atptour.com/-/media/alias/player-gladiator-headshot/${player}`).href
}

export function flagSrc (country) {
    return new URL(`../assets/flags/${country}.svg`, import.meta.url).href
}

export function categorySrc(category) {
    return new URL(`../assets/${category}.svg`, import.meta.url).href
}

export function formattedDates(start, end) {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const date = useDate()

    if (date.getYear(startDate) === date.getYear(endDate) && date.isSameMonth(startDate, endDate)) {
        return `${date.getDate(startDate)} - ${date.getDate(endDate)} ${date.format(startDate, 'monthAndYear')}`
    } else if (date.getYear(startDate) === date.getYear(endDate)) {
        return `${date.format(startDate, 'monthAndDate')} - ${date.format(endDate, 'monthAndDate')} ${date.getYear(startDate)}`
    } else {
        return `${date.format(startDate, 'monthAndDate')} - ${date.format(endDate, 'monthAndDate')} ${date.getYear(endDate)}`
    }
}

export function formatDate(value) {
    const date = useDate()
    return date.format(value, 'fullDateWithWeekday')
}

export function formatTime(time) {
    const hour = Math.floor(time / 60)
    const minutes = time % 60
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
    return `${hour}:${formattedMinutes}`
}

export function formatCurrency (currency, number) {
    return number.toLocaleString('en-GB', {style: 'currency', currency: currency})
}

export function joinArray (array) {
    return array.join(', ')
}

export function groupObjectsByKey(array, key) {
    const groupedArrays = {};
    
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

export function tiebreak (matchScore, tiebreakScore) {
    if (matchScore === 6) {
        return tiebreakScore
    } else {
        return
    }
}

export function round (roundNumber) {
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

export function status (seed, status) {
    if (seed && status) {
        return `(${seed} ${status})`
    } else if (seed) {
        return `(${seed})`
    } else {
        return `(${status})`
    }
}

export function incomplete (status) {
    switch (status) {
        case 'R':
            return 'Retirement'
        case 'D':
            return 'Default'
        case 'WO':
            return 'Walkover'
    }
}

export function plays (value) {
    return value ? `Right-handed` : `Left-handed`
}

export function bh (value) {
    return value ? `One-handed` : `Two-handed`
}