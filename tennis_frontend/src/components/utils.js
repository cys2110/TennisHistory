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
    const options = { year: 'numeric', month: 'long', day:'numeric'}
    const datedStart = new Date(start)
    const startDay = datedStart.getDate()
    const startMonth = datedStart.getMonth()
    const startYear = datedStart.getFullYear()
    const datedEnd = new Date(end)
    const endDay = datedEnd.getDate()
    const endMonth = datedEnd.getMonth()
    const endYear = datedEnd.getFullYear()

    const startDate = datedStart.toLocaleDateString('en-gb', options)
    const endDate = datedEnd.toLocaleDateString('en-gb', options)

    if (startMonth === endMonth && startYear === endYear) {
        return `${startDay}-${endDay} ${getMonthName(startMonth)} ${startYear}`
    } else if (startYear === endYear) {
        return `${startDay} ${getMonthName(startMonth)}-${endDay} ${getMonthName(endMonth)} ${startYear}`
    } else {
        return `${startDate} - ${endDate}`
    }
}

function getMonthName(monthIndex) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return months[monthIndex]
}

export function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day:'numeric'}
    const newDate = new Date(date)
    return newDate.toLocaleDateString('en-gb', options)
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