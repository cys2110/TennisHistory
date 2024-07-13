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

export const getMatchStats = (matchNo: number, eventId: number) => {
    const call = gql `
        query Matches($matchNo: Int, eventId: Int) {
            matches (
                where: {match_no: $matchNo, event: {id: $eventId}}
            ) {
                court
                date
                duration
                incomplete
                umpire
                winner
                p1 {
                    aces
                    avg_sv1_kph
                    bp_opps
                    avg_sv2_kph
                    bps_converted
                    bps_faced
                    bps_saved
                    dfs
                    incomplete
                    max_speed_kph
                    net
                    net_w
                    ret1_pts
                    ret1_pts_w
                    ret2_pts
                    ret2_pts_w
                    s1
                    s2
                    s3
                    s4
                    s5
                    serve1_pts
                    serve1_pts_w
                    serve2_pts
                    serve2_pts_w
                    t1
                    t2
                    t3
                    t4
                    t5
                    ues
                    winners
                    player {
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
                p2 {
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
                    aces
                    dfs
                    serve1_pts_w
                    serve1_pts
                    serve2_pts_w
                    serve2_pts
                    ret1_pts_w
                    ret1_pts
                    ret2_pts_w
                    ret2_pts
                    bps_faced
                    bps_saved
                    bp_opps
                    bps_converted
                    net_w
                    net
                    winners
                    ues
                    max_speed_kph
                    avg_sv1_kph
                    avg_sv2_kph
                    incomplete
                    player {
                        first_name
                        full_name
                        last_name
                        id
                        country {
                            id
                            name
                        }
                    }
                }
            }
        }
    `
    return {query: call, variables: { matchNo, eventId }}
}