import { gql } from "@apollo/client/core"

export const getUpcomingEvents = (date: Date) =>{
    const call = gql`
        query Upcoming($date: Date!) {
            events(
                where: {end_date_GT: $date}
                options: {sort: [{start_date: ASC}]}
            ) {
                id
                category
                end_date
                sponsor_name
                start_date
                surface {
                    environment
                    hard_type
                    surface
                }
                tournament {
                    id
                    name
                }
                venue {
                    city
                    country {
                            id
                            name
                        }
                    }
                year {
                    id
                }
            }
        }
    `
    return {query: call, variables: { date }}
}

export const getEventsByYear = (year: number) => {
    const call = gql`
        query EventByYear($year: Int!) {
            events(
                where: { year: { id: $year } }
                options: {
                    sort: [
                        { start_date: ASC }
                    ]
                }
            ) {
                category
                end_date
                id
                sponsor_name
                start_date
                surface {
                    environment
                    hard_type
                    surface
                }
                venue {
                    city
                    country {
                        id
                        name
                    }
                }
                year {
                    id
                }
                tournament {
                    id
                    name
                }
            }
        }
    `
    return {query: call, variables: { year }}
}

export const getEvent = (id: number) => {
    const call = gql`
        query EventLayout($id: Int!) {
            events(
                where: { id: $id }
            ) {
                category
                draw_type
                sponsor_name
                start_date
                end_date
                id
                surface {
                    environment
                    hard_type
                    surface
                }
                tournament {
                    id
                    name
                }
                venue {
                    city
                    country {
                        id
                        name
                    }
                }
                year {
                    id
                }
            }
        }
    `
    return {query: call, variables: { id }}
}

export const getEventDetails = (id: number) => {
    const call = gql`
        query getEventDetails($id: Int!) {
            events(
                where: { id: $id }
            ) {
                id
                venue {
                    city
                    name
                    country {
                        id
                        name
                    }
                }
                surface {
                    environment
                    hard_type
                    surface
                }
                pm
                r64_pts
                r64_pm
                r32_pts
                r32_pm
                r16_pts
                r16_pm
                r128_pts
                r128_pm
                quarterfinalist_pts
                quarterfinalist_pm
                semifinalist_pm
                semifinalist_pts
                finalist_pm
                finalist_pts
                currency
                tfc
                winner_pm
                winner_pts
                supervisors {
                    id
                }
            }
        }
    `
    return {query: call, variables: { id }}
}