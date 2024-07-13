import { gql } from "@apollo/client/core"

export const getTournament = (id: number) => {
    const call = gql`
        query getTournament($id: Int!) {
            tournaments(
                where: { id: $id }
            ) {
                end_year {
                    id
                }
                id
                name
                website
                start_year {
                    id
                }
                events {
                    final_score
                    end_date
                    finalist {
                        first_name
                        full_name
                        id
                        last_name
                        country {
                            id
                            name
                        }
                    }
                    year(options: {
                        sort: [
                            {id: DESC}
                        ]
                    }) {
                        id
                    }
                    winner {
                        first_name
                        full_name
                        id
                        last_name
                        country {
                            id
                            name
                        }
                    }
                }
            }
        }
    `
    return {query: call, variables: { id }}
}