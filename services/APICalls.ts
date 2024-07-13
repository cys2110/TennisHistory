export const getEditionDetails = (id: number) => {
    const call = gql `
        query Event() {
            events  {
                seeds {
                    seed
                    rank
                    player {
                        id
                        first_name
                        last_name
                        full_name
                        country {
                            id
                            name
                        }
                    }
                }
                lda {
                    rank
                    player {
                        id
                        first_name
                        last_name
                        full_name
                        country {
                            id
                            name
                        }
                    }
                }
                lls {
                    id
                    first_name
                    last_name
                    full_name
                    country {
                        id
                        name
                    }
                }
                alts {
                    id
                    first_name
                    last_name
                    full_name
                    country {
                        id
                        name
                    }
                }
                wds {
                    reason
                    player {
                        id
                        first_name
                        last_name
                        full_name
                        country {
                            id
                            name
                        }
                    }
                }
                rets {
                    reason
                    player {
                        id
                        first_name
                        last_name
                        full_name
                        country {
                            id
                            name
                        }
                    }
                }
                wos {
                    reason
                    player {
                        id
                        first_name
                        last_name
                        full_name
                        country {
                            id
                            name
                        }
                    }
                }
                defs {
                    reason
                    player {
                        id
                        first_name
                        last_name
                        full_name
                        country {
                            id
                            name
                        }
                    }
                }
            }
        }
    `
}

export const getResults = (id: number) => {
    const call = gql `
        query Event($id: Int!) {
            events (
                where: { id: $id }
            ) {
                resultSeeds {
                    seeds
                }
                statuses {
                    Alt
                    WC
                    PR
                    Q
                    LL
                    SE
                }
                rounds {
                    round
                    matches {
                        id
                        match_no
                        date
                        duration
                        umpire
                        court
                        winner {
                            id
                            first_name
                            last_name
                            full_name
                            country {
                                id
                                name
                            }
                        }
                        loser {
                            id
                            first_name
                            last_name
                            full_name
                            country {
                                id
                                name
                            }
                        }
                        winner_score {
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
                        loser_score {
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
    return {query: call, variables: { id }}
}

export const getDraw = (id: number) => {
    const call = gql `
        query Event($id: Int!) {
            events (
                where: { id: $id }
            ) {
                resultSeeds {
                    seeds
                }
                statuses {
                    Alt
                    WC
                    PR
                    Q
                    LL
                    SE
                }
                draw {
                    round
                    matches {
                        id
                        match_no
                        incomplete
                        winner
                        p1 {
                            id
                            first_name
                            last_name
                            full_name
                            country {
                                id
                                name
                            }
                        }
                        p2 {
                            id
                            first_name
                            last_name
                            full_name
                            country {
                                id
                                name
                            }
                        }
                        p1_score {
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
                        p2_score {
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
    return {query: call, variables: { id }}
}