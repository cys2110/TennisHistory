export const typeDefs = `#graphql

    type Active {
        bh1: Boolean
        career_high: Int
        ch_date: Date
        coaches: [Coach!]! @relationship(type: "COACHES", direction: IN)
        country: Country! @relationship(type: "REPRESENTS", direction: OUT, properties: "RepresentsProperties")
        dob: Date
        dod: Date
        entries: [Entry!]! @relationship (type: "ENTERED", direction: OUT)
        first_name: String
        full_name: String! @customResolver(requires: "first_name last_name")
        gladiator: Boolean
        height_cm: Int
        hof: Int
        id: String! @unique
        last_name: String
        loss: Int
        pm_USD: Int
        prev_countries: [Country!]! @relationship(type: "REPRESENTED", direction: OUT, properties: "RepresentsProperties")
        retired: Year @relationship(type: "RETIRED", direction: OUT)
        rh: Boolean
        titles: Int
        turned_pro: Year @relationship(type: "TURNED_PRO", direction: OUT)
        win: Int
    }

    type Best3 {
        court: String
        date: Date
        duration_mins: Int
        group: String
        id: String! @unique
        incomplete: String
        loser: Loser @relationship(type: "SCORED", direction: IN)
        match_no: Int
        p1: P1 @relationship(type: "SCORED", direction: IN)
        p2: P2 @relationship(type: "SCORED", direction: IN)
        round: Round @relationship(type: "PLAYED", direction: OUT)
        scores: [Score!]! @relationship(type: "SCORED", direction: IN)
        sort_date: Date
        umpire: Umpire @relationship(type: "UMPIRED", direction: IN)
        winner: Winner @relationship(type: "SCORED", direction: IN)
    }

    type Best5 {
        court: String
        date: Date
        duration_mins: Int
        group: String
        id: String! @unique
        incomplete: String
        loser: Loser @relationship(type: "SCORED", direction: IN)
        match_no: Int
        p1: P1 @relationship(type: "SCORED", direction: IN)
        p2: P2 @relationship(type: "SCORED", direction: IN)
        round: Round @relationship(type: "PLAYED", direction: OUT)
        scores: [Score!]! @relationship(type: "SCORED", direction: IN)
        sort_date: Date
        umpire: Umpire @relationship(type: "UMPIRED", direction: IN)
        winner: Winner @relationship(type: "SCORED", direction: IN)
    }

    type Coach {
        id: String! @unique
        first_name: String
        last_name: String
        full_name: String @customResolver(requires: "first_name last_name")
        players: [Player!]! @relationship(type: "COACHES", direction: OUT)
    }

    type Country {
        country1Ties: [Tie!]! @relationship(type: "COUNTRY1", direction: OUT)
        country2Ties: [Tie!]! @relationship(type: "COUNTRY2", direction: OUT)
        formerPlayers: [Player!]! @relationship(type: "REPRESENTED", direction: IN, properties: "RepresentsProperties")
        id: String! @unique
        name: String! @unique
        players: [Player!]! @relationship(type: "REPRESENTS", direction: IN, properties: "RepresentsProperties")
        venues: [Venue!]! @relationship(type: "LOCATED_IN", direction: IN)
    }

    type DefaultedProperties @relationshipProperties {
        reason: String
    }

    type Entry {
        scores: [Score!]! @relationship(type: "SCORED", direction: OUT)
        wins: [Winner!]! @relationship(type: "SCORED", direction: OUT)
        id: String! @unique
        losses: [Loser!]! @relationship(type: "SCORED", direction: OUT)
        player: Player @relationship(type: "ENTERED", direction: IN)
        pm: Int
        points: Int
        rank: Int
        seed: Int
        status: String
        team: String
    }

    type Event {
        alt: [Entry!]! @relationship(type: "ALTERNATE", direction: IN)
        category: String
        currency: String
        defaulted: [Entry!]! @relationship(type: "DEFAULTED", direction: IN, properties: "DefaultedProperties")
        draw_type: String!
        end_date: Date!
        id: Int! @unique
        lda: [Entry!]! @relationship(type: "LDA", direction: IN, properties: "LdaProperties")
        lls: [Entry!]! @relationship(type: "LUCKY_LOSER", direction: IN)
        pm: Int
        qualifiers: [Entry!]! @relationship(type: "QUALIFIED", direction: IN)
        ret: [Entry!]! @relationship(type: "RETIRED", direction: IN, properties: "RetiredProperties")
        rounds: [Round!]! @relationship(type: "ROUND_OF", direction: IN)
        seeds: [Entry!]! @relationship(type: "SEEDED", direction: IN)
        sponsor_name: String
        start_date: Date!
        supervisors: [Supervisor!]! @relationship(type: "SUPERVISED", direction: IN)
        surface: Surface @relationship(type: "ON_SURFACE", direction: OUT)
        tfc: Int
        tournament: Tournament! @relationship(type: "EDITION_OF", direction: OUT)
        venue: Venue @relationship(type: "TOOK_PLACE_IN", direction: OUT)
        wc: [Entry!]! @relationship(type: "WILD_CARD", direction: IN)
        wd: [Entry!]! @relationship(type: "WITHDREW", direction: IN, properties: "WithdrewProperties")
        wo: [Entry!]! @relationship(type: "WALKOVER", direction: IN, properties: "WalkoverProperties")
        year: Year! @relationship(type: "TOOK_PLACE_IN", direction: OUT)
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

    type LdaProperties @relationshipProperties {
        rank: Int
    }

    type Loser {
        aces: Int
        avg_sv1_kph: Int
        avg_sv2_kph: Int
        best3: Best3! @relationship(type: "SCORED", direction: OUT)
        best5: Best5! @relationship(type: "SCORED", direction: OUT)
        bp_opps: Int
        bps_converted: Int
        bps_faced: Int
        bps_saved: Int
        dfs: Int
        id: String!
        incomplete: String
        match: Match! @relationship(type: "SCORED", direction: OUT)
        max_speed_kph: Int
        net: Int
        net_w: Int
        player: Entry! @relationship(type: "SCORED", direction: IN)
        ret1: Int
        ret1_w: Int
        ret2: Int
        ret2_w: Int
        s1: Int
        s2: Int
        s3: Int
        s4: Int
        s5: Int
        serve1_pts: Int
        serve1_pts_w: Int
        serve2_pts: Int
        serve2_pts_w: Int
        t1: Int
        t2: Int
        t3: Int
        t4: Int
        t5: Int
        ues: Int
        winners: Int
    }

    type Match {
        court: String
        date: Date
        duration_mins: Int
        group: String
        id: String! @unique
        incomplete: String
        loser: Loser @relationship(type: "SCORED", direction: IN)
        match_no: Int
        p1: P1 @relationship(type: "SCORED", direction: IN)
        p2: P2 @relationship(type: "SCORED", direction: IN)
        round: Round @relationship(type: "PLAYED", direction: OUT)
        scores: [Score!]! @relationship(type: "SCORED", direction: IN)
        sort_date: Date
        umpire: Umpire @relationship(type: "UMPIRED", direction: IN)
        winner: Winner @relationship(type: "SCORED", direction: IN)
    }

    type P1 {
        aces: Int
        avg_sv1_kph: Int
        avg_sv2_kph: Int
        best3: Best3! @relationship(type: "SCORED", direction: OUT)
        best5: Best5! @relationship(type: "SCORED", direction: OUT)
        bp_opps: Int
        bps_converted: Int
        bps_faced: Int
        bps_saved: Int
        dfs: Int
        id: String!
        incomplete: String
        match: Match! @relationship(type: "SCORED", direction: OUT)
        max_speed_kph: Int
        net: Int
        net_w: Int
        player: Entry! @relationship(type: "SCORED", direction: IN)
        ret1: Int
        ret1_w: Int
        ret2: Int
        ret2_w: Int
        s1: Int
        s2: Int
        s3: Int
        s4: Int
        s5: Int
        serve1_pts: Int
        serve1_pts_w: Int
        serve2_pts: Int
        serve2_pts_w: Int
        t1: Int
        t2: Int
        t3: Int
        t4: Int
        t5: Int
        ues: Int
        winners: Int
    }

    type P2 {
        aces: Int
        avg_sv1_kph: Int
        avg_sv2_kph: Int
        best3: Best3! @relationship(type: "SCORED", direction: OUT)
        best5: Best5! @relationship(type: "SCORED", direction: OUT)
        bp_opps: Int
        bps_converted: Int
        bps_faced: Int
        bps_saved: Int
        dfs: Int
        id: String!
        incomplete: String
        match: Match! @relationship(type: "SCORED", direction: OUT)
        max_speed_kph: Int
        net: Int
        net_w: Int
        player: Entry! @relationship(type: "SCORED", direction: IN)
        ret1: Int
        ret1_w: Int
        ret2: Int
        ret2_w: Int
        s1: Int
        s2: Int
        s3: Int
        s4: Int
        s5: Int
        serve1_pts: Int
        serve1_pts_w: Int
        serve2_pts: Int
        serve2_pts_w: Int
        t1: Int
        t2: Int
        t3: Int
        t4: Int
        t5: Int
        ues: Int
        winners: Int
    }

    type Player {
        backhand: String @customResolver(requires: "bh1")
        bh1: Boolean
        career_high: Int
        ch_date: Date
        coaches: [Coach!]! @relationship(type: "COACHES", direction: IN)
        country: Country @relationship(type: "REPRESENTS", direction: OUT, properties: "RepresentsProperties")
        dob: Date
        dod: Date
        entries: [Entry!]! @relationship (type: "ENTERED", direction: OUT)
        first_name: String
        full_name: String! @customResolver(requires: "first_name last_name")
        gladiator: Boolean
        height_cm: Int
        height_ft: String @customResolver(requires: "height_cm")
        hof: Int
        id: String! @unique
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
            win1Losses: sum(CASE WHEN f.s1 < f2.s1 AND f:Loser THEN 1 ELSE 0 END),
            lose1Wins: sum(CASE WHEN f.s1 < f2.s1 AND f:Winner THEN 1 ELSE 0 END),
            lose1Losses: sum(CASE WHEN f.s1 > f2.s1 AND f:Loser THEN 1 ELSE 0 END),
            rhWins: sum(CASE WHEN p2.rh = true AND f:Winner THEN 1 ELSE 0 END),
            rhLosses: sum(CASE WHEN p2.rh = true AND f:Loser THEN 1 ELSE 0 END),
            lhWins: sum(CASE WHEN p2.rh = false AND f:Winner THEN 1 ELSE 0 END),
            lhLosses: sum(CASE WHEN p2.rh = false AND f:Loser THEN 1 ELSE 0 END)
            } as index
        """, columnName: "index")
        last_name: String
        loss: Int
        plays: String @customResolver(requires: "rh")
        pm_USD: Int
        prev_countries: [Country!]! @relationship(type: "REPRESENTED", direction: OUT, properties: "RepresentsProperties")
        retired: Year @relationship(type: "RETIRED", direction: OUT, properties: "RetiredProperties")
        rh: Boolean
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
        titles: Int
        turned_pro: Year @relationship(type: "TURNED_PRO", direction: OUT)
        win: Int
        years: Years @cypher(statement: """
            MATCH (this)-[:ENTERED]-(:Entry)-[:SCORED]-(:Score)-[:SCORED]-(:Match)-[:PLAYED]-(:Round)-[:ROUND_OF]-(:Event)-[:TOOK_PLACE_IN]-(y:Year)
            RETURN {earliest: min(y.id), latest: max(y.id)} AS years
        """, columnName: "years")
    }

    type RepresentsProperties @relationshipProperties {
        end_date: Date
        start_date: Date
    }

    type RetiredProperties @relationshipProperties {
        reason: String
    }

    type Round {
        end_date: Date
        fourth_place: Int
        id: String! @unique
        matches: [Match!]! @relationship(type: "PLAYED", direction: IN)
        number: Int
        participation: Int
        pm: Int
        points: Int
        round: String!
        event: Event! @relationship(type: "ROUND_OF", direction: OUT)
        stage: String
        start_date: Date
        third_place: Int
        tiesTieOf: [Tie!]! @relationship(type: "TIE_OF", direction: IN)
        undefeated_bonus: Int
        win_1: Int
        win_2: Int
        win_3: Int
    }

    type Score {
        aces: Int
        avg_sv1_kph: Int
        avg_sv2_kph: Int
        best3: Best3! @relationship(type: "SCORED", direction: OUT)
        best5: Best5! @relationship(type: "SCORED", direction: OUT)
        bp_opps: Int
        bps_converted: Int
        bps_faced: Int
        bps_saved: Int
        dfs: Int
        id: String!
        incomplete: String
        match: Match! @relationship(type: "SCORED", direction: OUT)
        max_speed_kph: Int
        net: Int
        net_w: Int
        player: Entry! @relationship(type: "SCORED", direction: IN)
        ret1: Int
        ret1_w: Int
        ret2: Int
        ret2_w: Int
        s1: Int
        s2: Int
        s3: Int
        s4: Int
        s5: Int
        serve1_pts: Int
        serve1_pts_w: Int
        serve2_pts: Int
        serve2_pts_w: Int
        t1: Int
        t2: Int
        t3: Int
        t4: Int
        t5: Int
        ues: Int
        winners: Int
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

    type Supervisor {
        id: String! @unique
        events: [Event!]! @relationship(type: "SUPERVISED", direction: OUT)
    }

    type Surface {
        environment: String!
        events: [Event!]! @relationship(type: "ON_SURFACE", direction: IN)
        hard_type: String
        id: String! @unique
        surface: String!
    }

    type Tie @node {
        countriesCountry1: [Country!]! @relationship(type: "COUNTRY1", direction: IN)
        countriesCountry2: [Country!]! @relationship(type: "COUNTRY2", direction: IN)
        id: String!
        number: Int!
        tieOfRounds: [Round!]! @relationship(type: "TIE_OF", direction: OUT)
    }

    type TitlesFinals {
        id: Int
        tid: Int
        tname: String
        surface: String
        year: Int
}

    type Tournament {
        start_year: Year! @relationship(type: "ESTABLISHED", direction: OUT)
        end_year: Year @relationship(type: "ABOLISHED", direction: OUT)
        events: [Event!]! @relationship(type: "EDITION_OF", direction: IN)
        id: Int! @unique
        name: String! @unique
        website: String
    }

    type Umpire {
        id: String! @unique
        matches: [Match!]! @relationship(type: "UMPIRED", direction: OUT)
    }

    type Venue {
        city: String!
        events: [Event!]! @relationship(type: "TOOK_PLACE_IN", direction: IN)
        country: Country! @relationship(type: "LOCATED_IN", direction: OUT)
        name: String @unique
    }

    type WalkoverProperties @relationshipProperties {
        reason: String
    }

    type Winner {
        aces: Int
        avg_sv1_kph: Int
        avg_sv2_kph: Int
        best3: Best3! @relationship(type: "SCORED", direction: OUT)
        best5: Best5! @relationship(type: "SCORED", direction: OUT)
        bp_opps: Int
        bps_converted: Int
        bps_faced: Int
        bps_saved: Int
        dfs: Int
        id: String!
        incomplete: String
        match: Match! @relationship(type: "SCORED", direction: OUT)
        max_speed_kph: Int
        net: Int
        net_w: Int
        player: Entry! @relationship(type: "SCORED", direction: IN)
        ret1: Int
        ret1_w: Int
        ret2: Int
        ret2_w: Int
        s1: Int
        s2: Int
        s3: Int
        s4: Int
        s5: Int
        serve1_pts: Int
        serve1_pts_w: Int
        serve2_pts: Int
        serve2_pts_w: Int
        t1: Int
        t2: Int
        t3: Int
        t4: Int
        t5: Int
        ues: Int
        winners: Int
    }

    type WithdrewProperties @relationshipProperties {
        reason: String
    }

    type Year {
        events: [Event!]! @relationship(type: "TOOK_PLACE_IN", direction: IN)
        id: Int! @unique
    }

    type Years {
        earliest: Int
        latest: Int
    }

    type YearStats {
        wins: Int!
        losses: Int!
        titles: Int!
    }

    type MajorResult {
        round: String!
        year: Int!
        eid: Int!
    }

    type MajorResults {
        events: [MajorResult]
    }

    type Query {
        archiveEvents (year: Int, month: Int, surface: String, category: String): [Event!]! @cypher(statement: """
            MATCH (y:Year)-[:TOOK_PLACE_IN]-(e:Event)-[:ON_SURFACE]-(s:Surface)
            WHERE ($year IS NULL OR y.id = $year) AND ($surface IS NULL OR s.surface = $surface) AND ($category IS NULL OR e.category = $category) AND ($month IS NULL OR e.start_date.month = $month)
            RETURN distinct(e) as events
            ORDER BY e.start_date
        """, columnName: "events")
        searchPlayers(full_name: String!): [Player!]! @cypher(statement: """
            MATCH (p:Player)
            WHERE p.first_name + ' ' + p.last_name =~ '(?i).*'+ $full_name + '.*'
            RETURN p AS players
        """, columnName: "players")
        searchTournaments (name: String!): [Tournament!]! @cypher(statement: """
            MATCH (t:Tournament)
            WHERE t.name =~ '(?i).*' + $name + '.*'
            RETURN t as tournaments
        """, columnName: "tournaments")
        searchUmpires (name: String!): [Umpire!]! @cypher(statement: """
            MATCH (u:Umpire)
            WHERE u.id =~ '(?i).*' + $name + '.*'
            RETURN u as umpires
        """, columnName: "umpires")
        searchSupervisors (name: String!): [Supervisor] @cypher(statement: """
            MATCH (s:Supervisor)
            WHERE s.id =~ '(?i).*' + $name + '.*'
            RETURN s as supervisors
        """, columnName: "supervisors")
        searchCoaches (name: String!): [Coach] @cypher(statement: """
            MATCH (c:Coach)
            WHERE c.id =~ '(?i).*' + $name + '.*' OR c.first_name + ' ' + c.last_name =~ '(?i).*'+ $name + '.*'
            RETURN c as coaches
        """, columnName: "coaches")
        searchCountries (name: String!): [Country] @cypher(statement: """
            MATCH (c:Country)
            WHERE c.name =~ '(?i).*' + $name + '.*'
            RETURN c as countries
        """, columnName: "countries")
        searchVenue (name: String!): [Venue] @cypher(statement: """
            MATCH (v:Venue)
            WHERE v.name =~ '(?i).*' + $name + '.*'
            RETURN v as venues
        """, columnName: "venues")
        searchSurface (name: String!): [Surface] @cypher(statement: """
            MATCH (s:Surface)
            WHERE s.id =~ '(?i).*' + $name + '.*'
            RETURN s as surfaces
        """, columnName: "surfaces")
        playertitles (id: String!): [TitlesFinals!]! @cypher(statement: """
            MATCH (t:Tournament)-[]-(e:Event)-[]-(:Round {round: 'Final'})-[]-(:Match)-[]-(:Winner)-[]-(:Entry)-[]-(:Player {id: $id})
            MATCH (y:Year)-[]-(e)-[]-(s:Surface)
            RETURN {tid: t.id, id: e.id, tname: t.name, year: y.id, surface: s.id} as result
            ORDER BY e.start_date
        """, columnName: "result")
        playerfinals (id: String!): [TitlesFinals!]! @cypher(statement: """
            MATCH (t:Tournament)-[]-(e:Event)-[]-(:Round {round: 'Final'})-[]-(:Match)-[]-(:Loser)-[]-(:Entry)-[]-(:Player {id: $id})
            MATCH (y:Year)-[]-(e)-[]-(s:Surface)
            RETURN {tid: t.id, id: e.id, tname: t.name, year: y.id, surface: s.id} as result
            ORDER BY e.start_date
        """, columnName: "result")
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
        upcomingEvents (surface: String, month: Int, category: String): [Event!]! @cypher(statement: """
            MATCH (e:Event)-[:ON_SURFACE]-(s:Surface)
            WHERE e.start_date > date() AND ($surface IS NULL OR s.surface = $surface) AND ($month IS NULL OR e.start_date.month = $month) AND ($category IS NULL OR e.category = $category)
            RETURN distinct(e) as events
            ORDER BY e.start_date
        """, columnName: "events")
        yearStats (id: String!, year: Int!): YearStats @cypher(statement: """
            OPTIONAL MATCH (p:Player {id: $id})-[:ENTERED]-(:Entry)-[:SCORED]-(w:Winner)-[:SCORED]-(:Match)-[:PLAYED]-(:Round)-[:ROUND_OF]-(:Event)-[:TOOK_PLACE_IN]-(y:Year {id: $year})
            WITH p, y, count(w) as wins
            OPTIONAL MATCH (p)-[:ENTERED]-(:Entry)-[:SCORED]-(l:Loser)-[:SCORED]-(:Match)-[:PLAYED]-(:Round)-[:ROUND_OF]-(:Event)-[:TOOK_PLACE_IN]-(y)
            WITH wins, count(l) as losses, p, y
            OPTIONAL MATCH (p)-[:ENTERED]-(:Entry)-[:SCORED]-(t:Winner)-[:SCORED]-(:Match)-[:PLAYED]-(:Round {round: 'Final'})-[:ROUND_OF]-(:Event)-[:TOOK_PLACE_IN]-(y)
            WITH wins, losses, count(t) as titles
            RETURN {wins: wins, losses: losses, titles: titles} as yearStats
        """, columnName: "yearStats")
    }
`;

// type Player
// worldCapEvent2S: [Event2!]! @relationship(type: "WORLD_CAP", direction: OUT)
// worldVcapEvent2S: [Event2!]! @relationship(type: "WORLD_VCAP", direction: OUT)
// europeCapEvent2S: [Event2!]! @relationship(type: "EUROPE_CAP", direction: OUT)
// europeVcapEvent2S: [Event2!]! @relationship(type: "EUROPE_VCAP", direction: OUT)

// type Entry
// alternateEvent2S: [Event2!]! @relationship(type: "ALTERNATE", direction: OUT)
// ldaEvent2S: [Event2!]! @relationship(type: "LDA", direction: OUT, properties: "LdaProperties")
// luckyLoserEvent2S: [Event2!]! @relationship(type: "LUCKY_LOSER", direction: OUT)
// qualifiedEvent2S: [Event2!]! @relationship(type: "QUALIFIED", direction: OUT)
// seededEvent2S: [Event2!]! @relationship(type: "SEEDED", direction: OUT)
// walkoverEvent2S: [Event2!]! @relationship(type: "WALKOVER", direction: OUT, properties: "WalkoverProperties")
// wildCardEvent2S: [Event2!]! @relationship(type: "WILD_CARD", direction: OUT)
// withdrewEvent2S: [Event2!]! @relationship(type: "WITHDREW", direction: OUT, properties: "WithdrewProperties")

// type Event
// player2SEuropeCap: [Player2!]! @relationship(type: "EUROPE_CAP", direction: IN)
//         player2SEuropeVcap: [Player2!]! @relationship(type: "EUROPE_VCAP", direction: IN)
//         playersWorldCap: [Player!]! @relationship(type: "WORLD_CAP", direction: IN)
//         playersWorldVcap: [Player!]! @relationship(type: "WORLD_VCAP", direction: IN)
