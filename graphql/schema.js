export const typeDefs = `#graphql
    type Year {
        id: Int! @unique
    }

    type Surface {
        id: String!
        environment: String!
        surface: String!
        hard_type: String
    }

    type Country {
        id: String! @unique
        name: String! @unique
    }

    type Venue {
        name: String @unique
        city: String! @unique
        country: Country! @relationship(type: "LOCATED_IN", direction: OUT)
    }

    type Supervisor {
        id: String! @unique
    }

    type Tournament {
        id: Int! @unique
        name: String! @unique
        website: String
        start_year: Year! @relationship(type: "ESTABLISHED", direction: OUT)
        end_year: Year @relationship(type: "ABOLISHED", direction: OUT)
        events: [Event!]! @relationship(type: "EDITION_OF", direction: IN)
    }

    type Event {
        id: Int! @unique
        sponsor_name: String
        category: String
        start_date: Date!
        end_date: Date!
        final_score: String
        draw_type: String
        pm: Int
        tfc: Int
        currency: String
        winner_pm: Int
        winner_pts: Int
        finalist_pm: Int
        finalist_pts: Int
        semifinalist_pm: Int
        semifinalist_pts: Int
        quarterfinalist_pm: Int
        quarterfinalist_pts: Int
        r16_pm: Int
        r16_pts: Int
        r32_pm: Int
        r32_pts: Int
        r64_pm: Int
        r64_pts: Int
        r128_pm: Int
        r128_pts: Int
        tournament: Tournament! @relationship(type: "EDITION_OF", direction: OUT)
        year: Year! @relationship(type: "TOOK_PLACE_IN", direction: OUT)
        surface: Surface! @relationship(type: "ON_SURFACE", direction: OUT)
        venue: Venue @relationship(type: "TOOK_PLACE_IN", direction: OUT)
        winner: Player @relationship(type: "WON", direction: IN)
        finalist: Player @relationship(type: "FINALIST", direction: IN)
        supervisors: [Supervisor!]! @relationship(type: "SUPERVISED", direction: IN)
        matches: [Match!]! @relationship(type: "PLAYED", direction: IN)
        players: [Player!]! @relationship(type: "PLAYED", properties: "EntryInfo", direction: IN)
    }

    type Match {
        id: String! @unique
        round: String
        match_no: Int
        court: String
        date: Date
        duration_mins: Int
        incomplete: String
        event: Event! @relationship(type: "PLAYED", direction: OUT)
        scores: [Score!]! @relationship(type: "SCORED", direction: IN)
        winner: Winner! @relationship(type: "SCORED", direction: IN)
        loser: Loser @relationship(type: "SCORED", direction: IN)
    }

    type Best3 {
        id: String! @unique
        round: String
        match_no: Int
        court: String
        date: Date
        duration_mins: Int
        incomplete: String
        event: Event! @relationship(type: "PLAYED", direction: OUT)
    }

    type Best5 {
        id: String! @unique
        round: String
        match_no: Int
        court: String
        date: Date
        duration_mins: Int
        incomplete: String
        event: Event! @relationship(type: "PLAYED", direction: OUT)
    }

    type Score {
        s1: Int
        s2: Int
        s3: Int
        s4: Int
        s5: Int
        t1: Int
        t2: Int
        t3: Int
        t4: Int
        t5: Int
        incomplete: String
        aces: Int
        dfs: Int
        serve1_pts_w: Int
        serve1_pts: Int
        serve2_pts_w: Int
        serve2_pts: Int
        bps_saved: Int
        bps_faced: Int
        ret1_w: Int
        ret1: Int
        ret2_w: Int
        ret2: Int
        bps_converted: Int
        bp_opps: Int
        net_w: Int
        net: Int
        winners: Int
        ues: Int
        max_speed_kph: Int
        avg_sv1_kph: Int
        avg_sv2_kph: Int
        match: Match! @relationship(type: "SCORED", direction: OUT)
        best3: Best3! @relationship(type: "SCORED", direction: OUT)
        best5: Best5! @relationship(type: "SCORED", direction: OUT)
        player: Player! @relationship(type: "SCORED", direction: IN)
    }

    type Winner {
        s1: Int
        s2: Int
        s3: Int
        s4: Int
        s5: Int
        t1: Int
        t2: Int
        t3: Int
        t4: Int
        t5: Int
        incomplete: String
        aces: Int
        dfs: Int
        serve1_pts_w: Int
        serve1_pts: Int
        serve2_pts_w: Int
        serve2_pts: Int
        bps_saved: Int
        bps_faced: Int
        ret1_w: Int
        ret1: Int
        ret2_w: Int
        ret2: Int
        bps_converted: Int
        bp_opps: Int
        net_w: Int
        net: Int
        winners: Int
        ues: Int
        max_speed_kph: Int
        avg_sv1_kph: Int
        avg_sv2_kph: Int
        match: Match! @relationship(type: "SCORED", direction: OUT)
        best3: Best3! @relationship(type: "SCORED", direction: OUT)
        best5: Best5! @relationship(type: "SCORED", direction: OUT)
        player: Player! @relationship(type: "SCORED", direction: IN)
    }

    type Loser {
        s1: Int
        s2: Int
        s3: Int
        s4: Int
        s5: Int
        t1: Int
        t2: Int
        t3: Int
        t4: Int
        t5: Int
        incomplete: String
        aces: Int
        dfs: Int
        serve1_pts_w: Int
        serve1_pts: Int
        serve2_pts_w: Int
        serve2_pts: Int
        bps_saved: Int
        bps_faced: Int
        ret1_w: Int
        ret1: Int
        ret2_w: Int
        ret2: Int
        bps_converted: Int
        bp_opps: Int
        net_w: Int
        net: Int
        winners: Int
        ues: Int
        max_speed_kph: Int
        avg_sv1_kph: Int
        avg_sv2_kph: Int
        match: Match! @relationship(type: "SCORED", direction: OUT)
        best3: Best3! @relationship(type: "SCORED", direction: OUT)
        best5: Best5! @relationship(type: "SCORED", direction: OUT)
        player: Player! @relationship(type: "SCORED", direction: IN)
    }

    type Represents @relationshipProperties {
        start_date: Date
        end_date: Date
    }

    type EntryInfo @relationshipProperties {
        seed: Int
        status: String
        rank: Int
        pm: Int
        points: Int
    }

    type Coach {
        id: String!
        first_name: String
        last_name: String
        full_name: String! @customResolver(requires: "first_name last_name")
    }

    type Round {
        id: String!
        round: String!
        event: Event! @relationship(type: "ROUND_OF", direction: OUT)
    }

    type TitlesFinals {
        year: Int!
        count: Int!
        events: [EventFinal!]!
    }

    type EventFinal {
        id: Int!
        sponsor_name: String
        tournament_id: Int!
        tournament_name: String!
        environment: String!
        surface: String!
        hard_type: String
    }

    type Tiebreak {
        tbWins: Int!
        tbTotal: Int!
    }

    type Opponent {
        v10Wins: Int!
        v10Total: Int!
        win1Wins: Int!
        win1Total: Int!
        lose1Wins: Int!
        lose1Total: Int!
    }

    type Player {
        id: String! @unique
        first_name: String!
        last_name: String!
        full_name: String! @customResolver(requires: "first_name last_name")
        career_high: Int
        ch_date: Date
        win: Int!
        loss: Int!
        titles: Int!
        pm_USD: Int!
        gladiator: Boolean!
        dob: Date
        height_cm: Int
        rh: Boolean
        bh1: Boolean
        country: Country! @relationship(type: "REPRESENTS", properties: "Represents", direction: OUT)
        prev_countries: [Country!]! @relationship(type: "REPRESENTED", properties: "Represents", direction: OUT)
        turned_pro: Year! @relationship(type: "TURNED_PRO", direction: OUT)
        retired: Year @relationship(type: "RETIRED", direction: OUT)
        coaches: [Coach!]! @relationship(type: "COACHES", direction: IN)
        major: [Round!]! @relationship(type: "ACHIEVED", direction: OUT)
        titlesByYear: [TitlesFinals!]! @cypher(statement: """
            MATCH (this)-[:WON]->(e:Event)-[:TOOK_PLACE_IN]->(y:Year)
            MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:EDITION_OF]->(t:Tournament)
            WITH y.id AS year, count(e) AS count, collect({
                id: e.id,
                sponsor_name: e.sponsor_name,
                tournament_name: t.name,
                tournament_id: t.id,
                environment: s.environment,
                surface: s.surface,
                hard_type: s.hard_type
            }) AS titles
            RETURN {year: year, count: count, events: titles} AS titlesByYear
            ORDER BY year
        """, columnName: "titlesByYear")
        finalsByYear: [TitlesFinals!]! @cypher(statement: """
            MATCH (this)-[:FINALIST]->(e:Event)-[:TOOK_PLACE_IN]->(y:Year)
            MATCH (s:Surface)<-[:ON_SURFACE]-(e)-[:EDITION_OF]->(t:Tournament)
            WITH y.id AS year, count(e) AS count, collect({
                id: e.id,
                sponsor_name: e.sponsor_name,
                tournament_name: t.name,
                tournament_id: t.id,
                environment: s.environment,
                surface: s.surface,
                hard_type: s.hard_type
            }) AS finals
            RETURN {year: year, count: count, events: finals} AS finalsByYear
            ORDER BY year
        """, columnName: "finalsByYear")
        title: [Event!]! @relationship(type: "WON", direction: OUT)
        finals: [Event!]! @relationship(type: "FINALIST", direction: OUT)
        scores: [Score!]! @relationship(type: "SCORED", direction: OUT)
        scoreWins: [Winner!]! @relationship(type: "SCORED", direction: OUT)
        scoreLosses: [Loser!]! @relationship(type: "SCORED", direction: OUT)
        indexTb: Tiebreak! @cypher(statement: """
            OPTIONAL MATCH (this)-[:SCORED]->(s1:Score)-[]->(m)<-[]-(s2:Score)<-[:SCORED]-(p2:Player)
            WHERE m:Best3 OR m:Best5
            WITH s1, s2,
                CASE
                    WHEN s1.t1 > s2.t1 THEN 1
                    WHEN s1.t2 > s2.t2 THEN 1
                    WHEN s1.t3 > s2.t3 THEN 1
                    WHEN s1.t4 > s2.t4 THEN 1
                    WHEN s1.t5 > s2.t5 THEN 1
                    ELSE 0
                END AS tbWins
            WITH s1, s2, tbWins,
                CASE
                    WHEN s1.t1 IS NOT NULL THEN 1
                    WHEN s1.t2 IS NOT NULL THEN 1
                    WHEN s1.t3 IS NOT NULL THEN 1
                    WHEN s1.t4 IS NOT NULL THEN 1
                    WHEN s1.t5 IS NOT NULL THEN 1
                    ELSE 0
                END AS tbTotal
            RETURN {
                tbWins: sum(tbWins),
                tbTotal: sum(tbTotal)
            } AS indexTb
        """, columnName: "indexTb")
        indexOpponents: Opponent! @cypher(statement: """
            OPTIONAL MATCH (this)-[:SCORED]->(s1:Score)-[]->(m)<-[]-(s2:Score)<-[:SCORED]-(p2:Player)
            WHERE m:Best3 OR m:Best5
            MATCH (m)-[:PLAYED]->(e:Event)<-[t:PLAYED]-(p2)
            WITH count(DISTINCT CASE WHEN t.rank <= 10 THEN m END) AS v10Total,
            count(DISTINCT CASE WHEN t.rank <= 10 AND s1:Winner THEN m END) AS v10Wins,
            count(DISTINCT CASE WHEN s1.s1 < s2.s1 THEN m END) AS lose1Total,
            count(DISTINCT CASE WHEN s1.s1 < s2.s1 AND s1:Winner THEN m END) AS lose1Wins,
            count(DISTINCT CASE WHEN s1.s1 > s2.s1 THEN m END) AS win1Total,
            count(DISTINCT CASE WHEN s1.s1 > s2.s1 AND s1:Winner THEN m END) AS win1Wins
            RETURN {
                v10Total: v10Total,
                v10Wins: v10Wins,
                win1Wins: win1Wins,
                win1Total: win1Total,
                lose1Wins: lose1Wins,
                lose1Total: lose1Total
            } AS indexOpponents
        """, columnName: "indexOpponents")
        events: [Event!]! @relationship(type: "PLAYED", properties: "EntryInfo", direction: OUT)
    }

    type Query {
        searchPlayers(full_name: String!): [Player] @cypher(statement: """
            MATCH (p:Player)
            WHERE p.first_name + ' ' + p.last_name =~ '(?i)'+ $full_name + '.*'
            RETURN p AS players
        """, columnName: "players")
    }
`