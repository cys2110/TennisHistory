import { gql } from "@apollo/client/core"

export const getPlayerLayout = (id: string) => {
    const call = gql`
        query PlayerLayout($id: String!) {
            players(
                where: { id: $id }
            ) {
                id
                full_name
                first_name
                last_name
                career_high
                ch_date
                loss
                win
                titles
                pm_USD
                gladiator
                countryConnection {
                edges {
                    node {
                        id
                        name
                    }
                    properties {
                        end_date
                        start_date
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
                            end_date
                            start_date
                        }
                    }
                }
            }
        }
    `
    return {query: call, variables: { id }}
}

export const getPlayer = (id: string) => {
    const call = gql`
        query Player($id: String!) {
            players (
                where: {id: $id}
            ) {
                country {
                    id
                    name
                }
                dob
                height_cm
                rh
                bh1
                turned_pro {
                    id
                }
                retired {
                    id
                }
                coaches {
                    id
                    first_name
                    last_name
                    full_name
                }
                countryConnection {
                    edges {
                        node {
                            id
                            name
                        }
                        properties {
                            end_date
                            start_date
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
                ao: major(where: {event: {tournament: {id: 580}}}) {
                    event {
                        id
                        year {
                            id
                        }
                    }
                }
                aoAgg: majorAggregate(where: {event: {tournament: {id: 580}}}) {
                    node {
                        round {
                            longest
                        }
                    }
                    count
                }
                rg: major(where: {event: {tournament: {id: 520}}}) {
                    event {
                        id
                        year {
                            id
                        }
                    }
                }
                rgAgg: majorAggregate(where: {event: {tournament: {id: 520}}}) {
                    node {
                        round {
                            longest
                        }
                    }
                    count
                }
                wimbledon: major(where: {event: {tournament: {id: 540}}}) {
                    event {
                        id
                        year {
                            id
                        }
                    }
                }
                wimbledonAgg: majorAggregate(where: {event: {tournament: {id: 540}}}) {
                    node {
                        round {
                            longest
                        }
                    }
                    count
                }
                uso: major(where: {event: {tournament: {id: 560}}}) {
                    event {
                        id
                        year {
                            id
                        }
                    }
                }
                usoAgg: majorAggregate(where: {event: {tournament: {id: 560}}}) {
                    node {
                        round {
                            longest
                        }
                    }
                    count
                }
                finals: major(where: {event: {tournament: {id: 605}}}) {
                    event {
                        id
                        year {
                            id
                        }
                    }
                }
                finalsAgg: majorAggregate(where: {event: {tournament: {id: 605}}}) {
                    node {
                        round {
                            longest
                        }
                    }
                    count
                }
                davis: major(where: {event: {tournament: {id: 8099}}}) {
                    event {
                        id
                        year {
                            id
                        }
                    }
                }
                davisAgg: majorAggregate(where: {event: {tournament: {id: 8099}}}) {
                    node {
                        round {
                            longest
                        }
                    }
                    count
                }
                olympics: major(where: {event: {tournament: {id: 96}}}) {
                    event {
                        id
                        year {
                            id
                        }
                    }
                }
                olympicsAgg: majorAggregate(where: {event: {tournament: {id: 96}}}) {
                    node {
                        round {
                            longest
                        }
                    }
                    count
                }
                hopman: major(where: {event: {tournament: {id: 10003}}}) {
                    event {
                        id
                        year {
                            id
                        }
                    }
                }
                hopmanAgg: majorAggregate(where: {event: {tournament: {id: 10003}}}) {
                    node {
                        round {
                            longest
                        }
                    }
                    count
                }
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
    const call = gql`
        query WLIndex($id: String!) {
            players (
                where: { id: $id }
            ) {
                indexTb {
                    tbWins
                    tbTotal
                }
                indexOpponents {
                    v10Wins
                    v10Total
                    lose1Total
                    lose1Wins
                    win1Total
                    win1Wins
                }
                lhWins: scoreWinsAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null,
                                },
                                {
                                    scoresConnection_SOME: {
                                        node: {
                                            player: {
                                                AND: [
                                                    {
                                                        NOT: {
                                                            id: $id
                                                        }
                                                    },
                                                    {
                                                        rh: false
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                lhTotal: scoresAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null,
                                },
                                {
                                    scoresConnection_SOME: {
                                        node: {
                                            player: {
                                                AND: [
                                                    {
                                                        NOT: {
                                                            id: $id
                                                        }
                                                    },
                                                    {
                                                        rh: false
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                rhWins: scoreWinsAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null,
                                },
                                {
                                    scoresConnection_SOME: {
                                        node: {
                                            player: {
                                                AND: [
                                                    {
                                                        NOT: {
                                                            id: $id
                                                        }
                                                    },
                                                    {
                                                        rh: true
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                rhTotal: scoresAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null,
                                },
                                {
                                    scoresConnection_SOME: {
                                        node: {
                                            player: {
                                                AND: [
                                                    {
                                                        NOT: {
                                                            id: $id
                                                        }
                                                    },
                                                    {
                                                        rh: true
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                decidersWins: scoreWinsAggregate(
                    where: {
                        OR: [
                            {
                                AND: [
                                    {
                                        NOT: {
                                            s3: null
                                        }
                                    },
                                    {
                                        best3_NOT: null
                                    }
                                ]
                            },
                            {
                                AND: [
                                    {
                                        NOT: {
                                            s5: null
                                        }
                                    },
                                    {
                                        best5_NOT: null
                                    }
                                ]
                            }
                        ]
                    }
                ) {
                    count
                }
                decidersTotal: scoresAggregate(
                    where: {
                        OR: [
                            {
                                AND: [
                                    {
                                        NOT: {
                                            s3: null
                                        }
                                    },
                                    {
                                        best3_NOT: null
                                    }
                                ]
                            },
                            {
                                AND: [
                                    {
                                        NOT: {
                                            s5: null
                                        }
                                    },
                                    {
                                        best5_NOT: null
                                    }
                                ]
                            }
                        ]
                    }
                ) {
                    count
                }
                overallWins: scoreWinsAggregate(
                    where: {
                        match: {
                            incomplete: null
                        }
                    }
                ) {
                    count
                }
                overallTotal: scoresAggregate(
                    where: {
                        match: {
                            incomplete: null
                        }
                    }
                ) {
                    count
                }
                gsWins: scoreWinsAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {
                                        category: "Grand Slam"
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                gsTotal: scoresAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {
                                        category: "Grand Slam"
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                mastersWins: scoreWinsAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {
                                        category: "ATP Masters 1000"
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                mastersTotal: scoresAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {
                                        category: "ATP Masters 1000"
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                clayWins: scoreWinsAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {
                                        surface: {
                                            surface: "Clay"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                clayTotal: scoresAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {surface: {
                                        surface: "Clay"}
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                grassWins: scoreWinsAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {
                                        surface: {
                                            surface: "Grass"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                grassTotal: scoresAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {surface: {
                                        surface: "Grass"}
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                hardWins: scoreWinsAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {
                                        surface: {
                                            surface: "Hard"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                hardTotal: scoresAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {surface: {
                                        surface: "Hard"}
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                carpetWins: scoreWinsAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {
                                        surface: {
                                            surface: "Carpet"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                carpetTotal: scoresAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {
                                        surface: {
                                            surface: "Carpet"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                indoorWins: scoreWinsAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {
                                        surface: {
                                            environment: "Indoor"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                indoorTotal: scoresAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {surface: {
                                        environment: "Indoor"}
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                outdoorWins: scoreWinsAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {
                                        surface: {
                                            environment: "Outdoor"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                outdoorTotal: scoresAggregate(
                    where: {
                        match: {
                            AND: [
                                {
                                    incomplete: null
                                },
                                {
                                    event: {surface: {
                                        environment: "Outdoor"}
                                    }
                                }
                            ]
                        }
                    }
                ) {
                    count
                }
                set5Wins: scoreWinsAggregate(
                    where: {
                        NOT: {
                            s5: null
                        }
                    }
                ) {
                    count
                }
                set5Total: scoresAggregate(
                    where: {
                        NOT: {
                            s5: null
                        }
                    }
                ) {
                    count
                }
                overallTitles: titleAggregate {
                    count
                }
                overallFinals: finalsAggregate {
                    count
                }
                gsTitles: titleAggregate(
                    where: {
                        category: "Grand Slam"
                    }
                ) {
                    count
                }
                mastersTitles: titleAggregate(
                    where: {
                        category: "ATP Masters 1000"
                    }
                ) {
                    count
                }
                clayTitles: titleAggregate(
                    where: {
                        surface: {
                            surface: "Clay"
                        }
                    }
                ) {
                    count
                }
                grassTitles: titleAggregate(
                    where: {
                        surface: {
                            surface: "Grass"
                        }
                    }
                ) {
                    count
                }
                hardTitles: titleAggregate(
                    where: {
                        surface: {
                            surface: "Hard"
                        }
                    }
                ) {
                    count
                }
                carpetTitles: titleAggregate(
                    where: {
                        surface: {
                            surface: "Carpet"
                        }
                    }
                ) {
                    count
                }
                indoorTitles: titleAggregate(
                    where: {
                        surface: {
                            environment: "Indoor"
                        }
                    }
                ) {
                    count
                }
                outdoorTitles: titleAggregate(
                    where: {
                        surface: {
                            environment: "Outdoor"
                        }
                    }
                ) {
                    count
                }
            }
        }
    `
    return {query: call, variables: { id }}
}

export const getPlayerStats = (id: string, year?: number, surface?: string) => {
    const call = gql`
        query PlayerStats($id: String!, $year: Int, $surface: String) {
            players(
                where: { id: $id }
            ) {
                turned_pro {
                    id
                }
                retired {
                    id
                }
                scoresAggregate(
                    where: {
                        match: {
                            event: {
                                AND: [
                                    {
                                        year: {
                                            id: $year
                                        }
                                    },
                                    {
                                        surface: {
                                            surface: $surface
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ) {
                    node {
                        aces {
                            sum
                        }
                        bp_opps {
                            sum
                        }
                        bps_converted {
                            sum
                        }
                        bps_faced {
                            sum
                        }
                        bps_saved {
                            sum
                        }
                        dfs {
                            sum
                        }
                        ret1 {
                            sum
                        }
                        ret1_w {
                            sum
                        }
                        ret2 {
                            sum
                        }
                        ret2_w {
                            sum
                        }
                        serve1_pts {
                            sum
                        }
                        serve1_pts_w {
                            sum
                        }
                        serve2_pts {
                            sum
                        }
                        serve2_pts_w {
                            sum
                        }
                    }
                }
            }
        }
    `;
    return {query: call, variables: { id, year, surface }}
};

export const getPlayerActivity = (id: string, year: number) => {
    const call = gql`
        query ExampleQuery($id: String!, $year: Int!) {
            players(
                where: { id: $id }
            ) {
                scoreWinsAggregate(
                    where: {
                        match: {
                            event: {
                                year: {
                                    id: $year
                                }
                            }
                        }
                    }
                ) {
                    count
                }
                scoreLossesAggregate(
                    where: {
                        match: {
                            event: {
                                year: {
                                    id: $year
                                }
                            }
                        }
                    }
                ) {
                    count
                }
                titleAggregate(
                    where: {
                        year: {
                            id: $year
                        }
                    }
                ) {
                    count
                }
                eventsConnection(
                    where: {
                        node: {
                            year: {
                                id: $year
                            }
                        }
                    },
                    sort: [
                        {
                            node: {
                                start_date: ASC
                            }
                        }
                    ]
                ) {
                    edges {
                        properties {
                            pm
                            points
                            rank
                            seed
                            status
                        }
                        node {
                            category
                            currency
                            end_date
                            id
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
                            matches(
                                where: {
                                    scores_SOME: {
                                        player: {
                                            id: $id
                                        }
                                    }
                                },
                                options: {
                                    sort: [
                                        {
                                            match_no: ASC
                                        }
                                    ]
                                }
                            ) {
                                incomplete
                                match_no
                                round
                                pScore:scores(
                                    where: {
                                        player: {
                                            id: $id
                                        }
                                    }
                                ) {
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
                                oppScore:scores(
                                    where: {
                                        player: {
                                            NOT: {
                                                id: $id
                                            }
                                        }
                                    }
                                ) {
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
                                winner {
                                    player {
                                        id
                                    }
                                }
                            }
                            playersConnection {
                                edges {
                                    node {
                                        id
                                    }
                                    properties {
                                        pm
                                        points
                                        rank
                                        seed
                                        status
                                    }
                                }
                            }
                            venue {
                                city
                                country {
                                    id
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    `
    return {query: call, variables: { id, year }}
}