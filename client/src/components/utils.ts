import { DateTime } from 'luxon'

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

export const encodeName = (name: string) => {
    return name.replace(/ /g, '_')
}

// types

export interface UpcomingEdition {
    id: number,
    sponsor_name: string | null,
    category: string | null,
    city: string,
    country: string,
    start_date: Date,
    end_date: Date,
    environment: string,
    surface: string,
    hard_type: string | null,
    Tournament: {
        id: number,
        name: string
    }
}

export interface EditionsOfTournament {
    id: number,
    edition_no: number,
    year: number,
    final_score: string | null,
    end_date: Date,
    winner: {
        full_name: string,
        first_name: string,
        last_name: string,
        id: string,
        country: string
    },
    finalist: {
        full_name: string,
        first_name: string,
        last_name: string,
        id: string,
        country: string
    }
}

export interface Tournament {
    id: number,
    name: string,
    start_year: number,
    end_year: number | null,
    website: string | null,
    Editions: EditionsOfTournament[]
}