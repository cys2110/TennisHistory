import { gql } from "@apollo/client/core"

export const getH2H = (p1Id: string, p2Id: string) => {
    const call = gql`
        query ExampleQuery($p1Id: String!, $p2Id: String!) {
            p1:players(
                where: {
                    id: $p1Id
                }
            ) {
                bh1
                career_high
                ch_date
                country {
                    id
                    name
                }
                dob
                first_name
                full_name
                height_cm
                id
                last_name
                loss
                pm_USD
                rh
                titles
                turned_pro {
                    id
                }
                win
            }
            p2:players(
                where: {
                    id: $p2Id
                }
            ) {
                bh1
                career_high
                ch_date
                country {
                    id
                    name
                }
                dob
                first_name
                full_name
                height_cm
                id
                last_name
                loss
                pm_USD
                rh
                titles
                turned_pro {
                    id
                }
                win
            }
            p1Wins:matchesAggregate(
                where: {
                    AND: [
                        {
                            winner: {
                                player: {
                                    id: $p1Id
                                }
                            }
                        },
                        {
                            scores_SOME: {
                                player: {
                                    id: $p2Id
                                }
                            }
                        }
                    ]
                }
            ) {
                count
            }
            p2Wins:matchesAggregate(
                where: {
                    AND: [
                        {
                            winner: {
                                player: {
                                    id: $p2Id
                                }
                            }
                        },
                        {
                            scores_SOME: {
                                player: {
                                    id: $p1Id
                                }
                            }
                        }
                    ]
                }
            ) {
                count
            }
            matches(
                where: {
                    AND: [
                        {
                            scores_SOME: {
                                player: {
                                    id: $p1Id
                                }
                            }
                        },
                        {
                            scores_SOME: {
                                player: {
                                    id: $p2Id
                                }
                            }
                        }
                    ]
                },
                options: {
                    sort: [
                        {
                            sort_date: ASC
                        }
                    ]
                }
            ) {
                event {
                    id
                    surface {
                        environment
                        hard_type
                        surface
                    }
                    year {
                        id
                    }
                    tournament {
                        id
                        name
                    }
                }
                match_no
                winner {
                    player {
                        id
                        last_name
                        full_name
                        first_name
                    }
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
                }
                round
                loser {
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
    `
    return {query: call, variables: { p1Id, p2Id }}
}