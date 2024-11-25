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

    type Umpire {
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
        start_date: Date
        end_date: Date
        draw_type: String
        pm: Int
        tfc: Int
        currency: String
        tournament: Tournament! @relationship(type: "EDITION_OF", direction: OUT)
        year: Year! @relationship(type: "TOOK_PLACE_IN", direction: OUT)
        surface: Surface @relationship(type: "ON_SURFACE", direction: OUT)
        venue: Venue @relationship(type: "TOOK_PLACE_IN", direction: OUT)
        rounds: [Round!]! @relationship(type: "ROUND_OF", direction: IN)
        supervisors: [Supervisor!]! @relationship(type: "SUPERVISED", direction: IN)
        seeds: [Entry!]! @relationship(type: "SEEDED", direction: IN)
        lda: Entry @relationship(type: "LDA", direction: IN, properties: "LDA")
        wd: [Entry!]! @relationship(type: "WITHDREW", direction: IN, properties: "Withdrew")
        ret: [Entry!]! @relationship(type: "RETIRED", direction: IN, properties: "Retired")
        wo: [Entry!]! @relationship(type: "WALKOVER", direction: IN, properties: "Walkover")
        defaulted: [Entry!]! @relationship(type: "DEFAULTED", direction: IN, properties: "Defaulted")
        lls: [Entry!]! @relationship(type: "LUCKY_LOSER", direction: IN)
        alt: [Entry!]! @relationship(type: "ALTERNATE", direction: IN)
    }

    type Entry {
        id: String! @unique
        seed: Int
        rank: Int
        pm: Int
        points: Int
        status: String
        player: Player! @relationship(type: "ENTERED", direction: IN)
        scores: [Score!]! @relationship(type: "SCORED", direction: OUT)
    }

    type LDA @relationshipProperties {
        rank: Int
    }

    type Retired @relationshipProperties {
        reason: String
    }

    type Walkover @relationshipProperties {
        reason: String
    }

    type Defaulted @relationshipProperties {
        reason: String
    }

    type Withdrew @relationshipProperties {
        reason: String
    }

    type Match {
        id: String! @unique
        round: Round @relationship(type: "PLAYED", direction: OUT)
        match_no: Int
        court: String
        date: Date
        duration_mins: Int
        incomplete: String
        sort_date: Date
        umpire: Umpire @relationship(type: "UMPIRED", direction: IN)
        scores: [Score!]! @relationship(type: "SCORED", direction: IN)
        winner: Winner @relationship(type: "SCORED", direction: IN)
        loser: Loser @relationship(type: "SCORED", direction: IN)
        p1: P1 @relationship(type: "SCORED", direction: IN)
        p2: P2 @relationship(type: "SCORED", direction: IN)
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
        player: Entry! @relationship(type: "SCORED", direction: IN)
    }

    type P1 {
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
        player: Entry @relationship(type: "SCORED", direction: IN)
    }

    type P2 {
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
        player: Entry @relationship(type: "SCORED", direction: IN)
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
        player: Entry! @relationship(type: "SCORED", direction: IN)
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
        player: Entry! @relationship(type: "SCORED", direction: IN)
    }

    type Represents @relationshipProperties {
        start_date: Date
        end_date: Date
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
        number: Int!
        pm: Int
        points: Int
        event: Event! @relationship(type: "ROUND_OF", direction: OUT)
        matches: [Match!]! @relationship(type: "PLAYED", direction: IN)
    }

    type TitlesFinals {
        year: Int!
        count: Int!
        events: [EventFinal!]!
    }

    type EventFinal {
        id: Int!
        tournament_id: Int!
        tournament_name: String!
        surface: String!
    }

    type Index {
        wins: Int!
        losses: Int!
        titles: Int!
        gsWins: Int!
        gsLosses: Int!
        gsTitles: Int!
        mastersWins: Int!
        mastersLosses: Int!
        mastersTitles: Int!
        tbWins: Int!
        tbLosses: Int!
        v10Wins: Int!
        v10Losses: Int!
        finalsWins: Int!
        finalsLosses: Int!
        deciderWins: Int!
        deciderLosses: Int!
        set5Wins: Int!
        set5Losses: Int!
        clayWins: Int!
        clayLosses: Int!
        clayTitles: Int!
        grassWins: Int!
        grassLosses: Int!
        grassTitles: Int!
        hardWins: Int!
        hardLosses: Int!
        hardTitles: Int!
        carpetWins: Int!
        carpetLosses: Int!
        carpetTitles: Int!
        indoorWins: Int!
        indoorLosses: Int!
        indoorTitles: Int!
        outdoorWins: Int!
        outdoorLosses: Int!
        outdoorTitles: Int!
        win1Wins: Int!
        win1Losses: Int!
        lose1Wins: Int!
        lose1Losses: Int!
        rhWins: Int!
        rhLosses: Int!
        lhWins: Int!
        lhLosses: Int!
    }

    type Years {
        earliest: Int
        latest: Int
    }

    type Stats {
        aces: Int!
        dfs: Int!
        serve1_w: Int!
        serve1: Int!
        serve2_w: Int!
        serve2: Int!
        ret1_w: Int!
        ret1: Int!
        ret2_w: Int!
        ret2: Int!
        bps_faced: Int!
        bps_saved: Int!
        bp_opps: Int!
        bps_converted: Int!
    }

    type MajorResult {
        round: String!
        year: Int!
        eid: Int!
    }

    type MajorResults {
        events: [MajorResult]
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
        coaches: [Coach!]! @relationship(type: "COACHES", direction: IN)
        country: Country! @relationship(type: "REPRESENTS", properties: "Represents", direction: OUT)
        prev_countries: [Country!]! @relationship(type: "REPRESENTED", properties: "Represents", direction: OUT)
        turned_pro: Year! @relationship(type: "TURNED_PRO", direction: OUT)
        retired: Year @relationship(type: "RETIRED", direction: OUT)
        entries: [Entry!]! @relationship (type: "ENTERED", direction: OUT)
        titlesByYear: [TitlesFinals!]! @cypher(statement: """
            MATCH (this)-[]-(:Entry)-[]-(:Winner)-[]-(:Match)-[]-(:Round {round: 'Final'})-[]-(e:Event)-[]-(y:Year)
            MATCH (s:Surface)-[]-(e)-[]-(t:Tournament)
            WITH y.id as year, count(e) as count, collect({
            id: e.id,
            tournament_name: t.name,
            tournament_id: t.id,
            surface: s.id
            }) as titles
            RETURN {year: year, count: count, events: titles} AS titlesByYear
            ORDER BY year
        """, columnName: "titlesByYear")
        finalsByYear: [TitlesFinals!]! @cypher(statement: """
            MATCH (this)-[]-(:Entry)-[]-(:Loser)-[]-(:Match)-[]-(:Round {round: 'Final'})-[]-(e:Event)-[]-(y:Year)
            MATCH (s:Surface)-[]-(e)-[]-(t:Tournament)
            WITH y.id as year, count(e) as count, collect({
            id: e.id,
            tournament_name: t.name,
            tournament_id: t.id,
            surface: s.id
            }) as finals
            RETURN {year: year, count: count, events: finals} AS finalsByYear
            ORDER BY year
        """, columnName: "finalsByYear")
        index: Index @cypher(statement: """
            MATCH (this)-[:ENTERED]-(g1:Entry)-[:SCORED]-(f:Score)-[:SCORED]-(m:Match)-[:SCORED]-(f2:Score)-[:SCORED]-(g2:Entry)-[:ENTERED]-(p2:Player)
            MATCH (m)-[:PLAYED]-(r:Round)-[:ROUND_OF]-(e:Event)-[:ON_SURFACE]-(s:Surface)
            RETURN {
            wins: sum(CASE WHEN f:Winner THEN 1 ELSE 0 END),
            losses: sum(CASE WHEN f:Loser THEN 1 ELSE 0 END),
            titles: sum(CASE WHEN f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END),
            gsWins: sum(CASE WHEN e.category = 'Grand Slam' AND f:Winner THEN 1 ELSE 0 END),
            gsLosses: sum(CASE WHEN e.category = 'Grand Slam' AND f:Loser THEN 1 ELSE 0 END),
            gsTitles: sum(CASE WHEN e.category = 'Grand Slam' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END),
            mastersWins: sum(CASE WHEN e.category = 'ATP Masters 1000' AND f:Winner THEN 1 ELSE 0 END),
            mastersLosses: sum(CASE WHEN e.category = 'ATP Masters 1000' AND f:Loser THEN 1 ELSE 0 END),
            mastersTitles: sum(CASE WHEN e.category = 'ATP Masters 1000' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END),
            tbWins: sum(CASE WHEN (f.s1 = 7 AND f2.s1 = 6) OR (f.s2 = 7 AND f2.s2 = 6) OR (f.s3 = 7 AND f2.s3 = 6) OR (f.s4 = 7 AND f2.s4 = 6) OR (f.s5 = 7 AND f2.s5 = 6) THEN 1 ELSE 0 END),
            tbLosses: sum(CASE WHEN (f.s1 = 6 AND f2.s1 = 7) OR (f.s2 = 6 AND f2.s2 = 7) OR (f.s3 = 6 AND f2.s3 = 7) OR (f.s4 = 6 AND f2.s4 = 7) OR (f.s5 = 6 AND f2.s5 = 7) THEN 1 ELSE 0 END),
            v10Wins: sum(CASE WHEN g2.rank < 11 AND f:Winner THEN 1 ELSE 0 END),
            v10Losses: sum(CASE WHEN g2.rank < 11 AND f:Loser THEN 1 ELSE 0 END),
            finalsWins: sum(CASE WHEN r.round = 'Final' AND f:Winner THEN 1 ELSE 0 END),
            finalsLosses: sum(CASE WHEN r.round = 'Final' AND f:Loser THEN 1 ELSE 0 END),
            deciderWins: sum(CASE WHEN ((m:Best3 AND f.s3 IS NOT NULL) OR (m:Best5 AND f.s5 IS NOT NULL)) AND f:Winner THEN 1 ELSE 0 END),
            deciderLosses: sum(CASE WHEN ((m:Best3 AND f.s3 IS NOT NULL) OR (m:Best5 AND f.s5 IS NOT NULL)) AND f:Loser THEN 1 ELSE 0 END),
            set5Wins: sum(CASE WHEN f.s5 IS NOT NULL AND f:Winner THEN 1 ELSE 0 END),
            set5Losses: sum(CASE WHEN f.s5 IS NOT NULL AND f:Loser THEN 1 ELSE 0 END),
            clayWins: sum(CASE WHEN s.surface = 'Clay' AND f:Winner THEN 1 ELSE 0 END),
            clayLosses: sum(CASE WHEN s.surface = 'Clay' AND f:Loser THEN 1 ELSE 0 END),
            clayTitles: sum(CASE WHEN s.surface = 'Clay' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END),
            grassWins: sum(CASE WHEN s.surface = 'Grass' AND f:Winner THEN 1 ELSE 0 END),
            grassLosses: sum(CASE WHEN s.surface = 'Grass' AND f:Loser THEN 1 ELSE 0 END),
            grassTitles: sum(CASE WHEN s.surface = 'Grass' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END),
            hardWins: sum(CASE WHEN s.surface = 'Hard' AND f:Winner THEN 1 ELSE 0 END),
            hardLosses: sum(CASE WHEN s.surface = 'Hard' AND f:Loser THEN 1 ELSE 0 END),
            hardTitles: sum(CASE WHEN s.surface = 'Hard' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END),
            carpetWins: sum(CASE WHEN s.surface = 'Carpet' AND f:Winner THEN 1 ELSE 0 END),
            carpetLosses: sum(CASE WHEN s.surface = 'Carpet' AND f:Loser THEN 1 ELSE 0 END),
            carpetTitles: sum(CASE WHEN s.surface = 'Carpet' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END),
            indoorWins: sum(CASE WHEN s.environment = 'Indoor' AND f:Winner THEN 1 ELSE 0 END),
            indoorLosses: sum(CASE WHEN s.environment = 'Indoor' AND f:Loser THEN 1 ELSE 0 END),
            indoorTitles: sum(CASE WHEN s.environment = 'Indoor' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END),
            outdoorWins: sum(CASE WHEN s.environment = 'Outdoor' AND f:Winner THEN 1 ELSE 0 END),
            outdoorLosses: sum(CASE WHEN s.environment = 'Outdoor' AND f:Loser THEN 1 ELSE 0 END),
            outdoorTitles: sum(CASE WHEN s.environment = 'Outdoor' AND f:Winner AND r.round = 'Final' THEN 1 ELSE 0 END),
            win1Wins: sum(CASE WHEN f.s1 > f2.s1 AND f:Winner THEN 1 ELSE 0 END),
            win1Losses: sum(CASE WHEN f.s1 > f2.s1 AND f:Winner THEN 1 ELSE 0 END),
            lose1Wins: sum(CASE WHEN f.s1 < f2.s1 AND f:Winner THEN 1 ELSE 0 END),
            lose1Losses: sum(CASE WHEN f.s1 < f2.s1 AND f:Winner THEN 1 ELSE 0 END),
            rhWins: sum(CASE WHEN p2.rh = true AND f:Winner THEN 1 ELSE 0 END),
            rhLosses: sum(CASE WHEN p2.rh = true AND f:Loser THEN 1 ELSE 0 END),
            lhWins: sum(CASE WHEN p2.rh = false AND f:Winner THEN 1 ELSE 0 END),
            lhLosses: sum(CASE WHEN p2.rh = false AND f:Loser THEN 1 ELSE 0 END)
            } as index
        """, columnName: "index")
        years: Years @cypher(statement: """
            MATCH (this)-[:ENTERED]-(:Entry)-[:SCORED]-(:Score)-[:SCORED]-(:Match)-[:PLAYED]-(:Round)-[:ROUND_OF]-(:Event)-[:TOOK_PLACE_IN]-(y:Year)
            RETURN {earliest: min(y.id), latest: max(y.id)} AS years
        """, columnName: "years")
        stats (year: Int, surface: String): Stats @cypher(statement: """
            MATCH (this)-[:ENTERED]-(:Entry)-[]-(s:Score)-[]-(:Match)-[]-(:Round)-[]-(e:Event)-[]-(y:Year)
            WHERE $year IS NULL OR y.id = $year
            MATCH (e)-[:ON_SURFACE]-(z:Surface) WHERE $surface IS NULL OR z.surface = $surface
            RETURN {
            aces: sum(s.aces),
            dfs: sum(s.dfs),
            serve1_w: sum(s.serve1_pts_w),
            serve1: sum(s.serve1_pts),
            serve2_w: sum(s.serve2_pts_w),
            serve2: sum(s.serve2_pts),
            ret1_w: sum(s.ret1_w),
            ret1: sum(s.ret1),
            ret2_w: sum(s.ret2_w),
            ret2: sum(s.ret2),
            bps_faced: sum(s.bps_faced),
            bps_saved: sum(s.bps_saved),
            bp_opps: sum(s.bp_opps),
            bps_converted: sum(s.bps_converted)
            } as stats
        """, columnName: "stats")
    }

    type Query {
        searchPlayers(full_name: String!): [Player] @cypher(statement: """
            MATCH (p:Player)
            WHERE p.first_name + ' ' + p.last_name =~ '(?i).*'+ $full_name + '.*'
            RETURN p AS players
        """, columnName: "players")
        searchTournaments (name: String!): [Tournament] @cypher(statement: """
            MATCH (t:Tournament)
            WHERE t.name =~ '(?i).*' + $name + '.*'
            RETURN t as tournaments
        """, columnName: "tournaments")
        majorResults (id: String!, tournament: Int!): MajorResults @cypher(statement: """
            MATCH (p:Player {id: $id})
            MATCH (t:Tournament {id: $tournament})
            OPTIONAL MATCH (p)-[:ENTERED]-(:Entry)-[:SCORED]-(:Winner)-[:SCORED]-(:Match)-[:PLAYED]-(r:Round {round: 'Final'})-[:ROUND_OF]-(e:Event)-[:EDITION_OF]-(t)
            OPTIONAL MATCH (e)-[:TOOK_PLACE_IN]-(y:Year)
            WITH collect( CASE WHEN e IS NOT NULL THEN {eid: e.id, year: y.id, round: r.round} ELSE NULL END) AS wins, p, t
            OPTIONAL MATCH (p)-[:ENTERED]-(:Entry)-[:SCORED]-(:Loser)-[:SCORED]-(:Match)-[:PLAYED]-(r:Round)-[:ROUND_OF]-(:Event)-[:EDITION_OF]-(t)
            WITH apoc.agg.minItems(r, r.number) AS minItems, wins
            UNWIND minItems.items as round
            MATCH b=(round)-[:ROUND_OF]-(e:Event)-[:TOOK_PLACE_IN]-(y:Year)
            WITH collect({round: round.round, eid: e.id, year: y.id}) as lowestRounds, wins
            RETURN CASE
            WHEN size(wins) > 0 THEN {events: wins}
            ELSE {events: lowestRounds}
            END AS results
        """, columnName: "results")
    }
`;
