import { gql } from "@apollo/client/core"

export const getUpcomingEditions = (date: Date) => {
    const call = gql `
        query UpcomingEditions($date: Date!) {
            events (
                where: {end_date_GT: $date}
                options: {sort: [{start_date: ASC}]}
            ) {
                id
                category {
                    id
                }
                sponsor_name
                tournament {
                    id
                    name
                }
                venue {
                    name
                    city
                    country {
                        id
                        name
                    }
                }
                start_date
                end_date
                surface {
                    environment
                    surface
                    hard_type
                }
                year {
                    id
                }
            }
        }
    `
    return {query: call, variables: { date }}
}

export const getEditionByYear = (year: number) => {
    const call = gql `
        query EditionByYear($year: Int!) {
            events(
                where: { year: { id: $year } }
                options: {
                    sort: [
                        { start_date: ASC }
                    ]
                }
            ) {
                id
                year {
                    id
                }
                category {
                    id
                }
                sponsor_name
                tournament {
                    name
                    id
                }
                venue {
                    city
                    country {
                        id
                        name
                    }
                }
                surface {
                    environment
                    surface
                    hard_type
                }
                start_date
                end_date
            }
        }
    `
    return {query: call, variables: { year }}
}

export const getPlayer = (id: string) => {
    const call = gql `
        query Player($id: String!) {
            players (
                where: { id: $id }
            ) {
                id
                first_name
                last_name
                full_name
                countryConnection {
                    edges {
                        node {
                            id
                            name
                        }
                        properties {
                            start_date
                            end_date
                        }
                    }
                }
                prev_countriesConnection {
                    edges {
                        node {
                            id
                            name
                        }
                        properties {
                            start_date
                            end_date
                        }
                    }
                }
                turned_pro {
                    id
                }
                retired {
                    id
                }
                dob
                rh
                bh1
                height_cm
                career_high
                ch_date
                pm_USD
                titles
                win
                loss
                gladiator
            }
        }
    `
    return {query: call, variables: { id }}
}

export const getPlayerTitles = (id: string) => {
    const call = gql `
        query PlayerTitles($id: String!) {
            players (
                where: { id: $id }
            ) {
                titlesByYear {
                    year
                    count
                    events {
                        id
                        sponsor_name
                        tournament_id
                        tournament_name
                        environment
                        surface
                        hard_type
                    }
                }
                finalsByYear {
                    year
                    count
                    events {
                        id
                        sponsor_name
                        tournament_id
                        tournament_name
                        environment
                        surface
                        hard_type
                    }
                }
            }
        }
    `
    return {query: call, variables: { id }}
}

export const getWLIndex = (id: string) => {
    const call = gql `
        query Player($id: String!) {
            players (
                where: { id: $id }
            ) {
                indexFinals
                indexMatches {
                    clayWins
                    clayTotal
                    carpetWins
                    carpetTotal
                    grassWins
                    grassTotal
                    hardWins
                    hardTotal
                    indoorWins
                    indoorTotal
                    gsWins
                    gsTotal
                    mastersWins
                    mastersTotal
                    decidersTotal
                    decidersWins
                    set5Total
                    set5Wins
                    overallWins
                    overallTotal
                    outdoorWins
                    outdoorTotal
                }
                indexTb {
                    tbWins
                    tbTotal
                }
                indexOpponents {
                    lhTotal
                    lhWins
                    rhTotal
                    rhWins
                    v10Wins
                    v10Total
                    lose1Total
                    lose1Wins
                    win1Total
                    win1Wins
                }
                indexTitles {
                    overallTitles
                    clayTitles
                    grassTitles
                    hardTitles
                    carpetTitles
                    indoorTitles
                    outdoorTitles
                    gsTitles
                    mastersTitles
                }
            }
        }
    `
    return {query: call, variables: { id }}
}

export const getPlayerStats = (id: string, year?: number | undefined, surface?: string | undefined) => {
    const call = gql `
        query Player($id: String!, $year: Int, $surface: String) {
            players (
                where: { id: $id }
            ) {
                stats (year: $year, surface: $surface) {
                    aces
                    dfs
                    serve1_pts_w
                    serve1_pts
                    serve2_pts_w
                    serve2_pts
                    bps_saved
                    bps_faced
                    ret1_pts_w
                    ret1_pts
                    ret2_pts_w
                    ret2_pts
                    bp_opps
                    bps_converted
                }
                retired {
                    id
                }
                turned_pro {
                    id
                }
            }
        }
    `
    return {query: call, variables: { id, year, surface }}
}

export const getPlayerActivity = (id: string, year: number) => {
    const call = gql `
        query Player($id: String!, $year: Int!) {
            players (
                where: { id: $id }
            ) {
                yearStats(year: $year) {
                    win
                    loss
                    titles
                }
                tournaments(year: $year) {
                    id
                    sponsor_name
                    tournamentId
                    tournamentName
                    category
                    start_date
                    end_date
                    environment
                    surface
                    hard_type
                    city
                    countryId
                    countryName
                    currency
                    rank
                    points
                    pm
                    matches {
                        round
                        winner_id
                        incomplete
                        opp_first_name
                        opp_last_name
                        opp_id
                        opp_countryCode
                        opp_countryName
                        opp_rank
                        p_scores {
                            s1
                            s2
                            s3
                            s4
                            s5
                            t1
                            t2
                            t3
                            t4
                            t5
                            incomplete
                        }
                        opp_scores {
                            s1
                            s2
                            s3
                            s4
                            s5
                            t1
                            t2
                            t3
                            t4
                            t5
                            incomplete
                        }
                    }
                }
            }
        }
    `
    return {query: call, variables: { id, year }}
}