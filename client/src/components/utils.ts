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

export const encodeName = (name: string) => {
    return name.replace(/ /g, '_')
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

// types

export interface UpcomingEdition {
    id: number,
    edition_no: number,
    sponsor_name: string | null,
    category: string | null,
    city: string,
    country: string,
    start_date: Date,
    end_date: Date,
    environment: string,
    surface: string,
    hard_type: string | null,
    Tournament: SearchTournament
}

export interface ArchiveEdition extends UpcomingEdition {
    year: number,
}

export interface EditionsOfTournament {
    id: number,
    edition_no: number,
    year: number,
    final_score: string | null,
    end_date: Date,
    winner: PlayerSearch,
    finalist: PlayerSearch
}

export interface Tournament extends SearchTournament {
    start_year: number,
    end_year: number | null,
    website: string | null,
    Editions: EditionsOfTournament[]
}

export interface SearchTournament {
    id: number,
    name: string
}

export interface PlayerSearch {
    id: string,
    first_name: string,
    last_name: string,
    full_name: string,
    country: string,
}

export interface Player extends PlayerSearch {
    country_yr: number | null,
    prev_country: string | null,
    prev_country_yr: number | null,
    first_country: string | null,
    status: boolean,
    turned_pro: number,
    retired: number | null,
    dob: Date | null,
    rh: boolean | null,
    bh1: boolean | null,
    height_cm: number | null,
    height_ft: string | null,
    coaches: string[] | null,
    career_high: number | null,
    ch_date: Date | null,
    pm_USD: number,
    titles: number,
    win: number,
    loss: number,
    gladiator: boolean,
    ao_round: string | null,
    ao_years: number[] | null,
    rg_round: string | null,
    rg_years: number[] | null,
    wimbledon_round: string | null,
    wimbledon_years: number[] | null,
    uso_round: string | null,
    uso_years: number[] | null,
    finals_round: string | null,
    finals_years: number[] | null,
    davis_round: string | null,
    davis_years: number[] | null,
    olympics_round: string | null,
    olympics_years: number[] | null,
    hopman_round: string | null,
    hopman_years: number[] | null,
    gs_cup_round: string | null,
    gs_cup_years: number[] | null,
    wct_round: string | null,
    wct_years: number[] | null,
    createdAt: Date,
    updatedAt: Date
}

export interface MatchH2H {
    id: number,
    round: string,
    incomplete: string | null,
    s1p1: number | null,
    s1p2: number | null,
    t1p1: number | null,
    t1p2: number | null,
    s2p1: number | null,
    s2p2: number | null,
    t2p1: number | null,
    t2p2: number | null,
    s3p1: number | null,
    s3p2: number | null,
    t3p1: number | null,
    t3p2: number | null,
    s4p1: number | null,
    s4p2: number | null,
    t4p1: number | null,
    t4p2: number | null,
    s5p1: number | null,
    s5p2: number | null,
    t5p1: number | null,
    t5p2: number | null,
    createdAt: Date,
    updatedAt: Date,
    p1: string,
    p2: string,
    EditionId: number,
    p1_no: number,
    p2_no: number,
    TieId: number | null,
    winner_id: string,
    Edition: {
        year: number,
        environment: string,
        surface: string,
        edition_no: number,
        Tournament: SearchTournament
    }
}