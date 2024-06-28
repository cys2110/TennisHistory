export const typeDefs = `#graphql
    type Year {
        id: Int!
    }

    type Surface {
        id: String!
        environment: String!
        surface: String!
        hard_type: String
    }

    type Country {
        id: String! @unique
        name: String!
    }

    type Venue {
        name: String
        city: String!
        country: Country! @relationship(type: "LOCATED_IN", direction: OUT)
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

    type Titles {
        overallTitles: Int!
        gsTitles: Int!
        mastersTitles: Int!
        clayTitles: Int!
        grassTitles: Int!
        hardTitles: Int!
        carpetTitles: Int!
        indoorTitles: Int!
        outdoorTitles: Int!
    }
        
    type Tiebreak {
        tbWins: Int!
        tbTotal: Int!
    }

    type IndexMatch {
        overallWins: Int!
        overallTotal: Int!
        gsWins: Int!
        gsTotal: Int!
        mastersWins: Int!
        mastersTotal: Int!
        decidersWins: Int!
        decidersTotal: Int!
        set5Wins: Int!
        set5Total: Int!
        clayWins: Int!
        clayTotal: Int!
        grassWins: Int!
        grassTotal: Int!
        hardWins: Int!
        hardTotal: Int!
        carpetWins: Int!
        carpetTotal: Int!
        indoorWins: Int!
        indoorTotal: Int!
        outdoorWins: Int!
        outdoorTotal: Int!
    }

    type Opponent {
        v10Wins: Int!
        v10Total: Int!
        rhWins: Int!
        rhTotal: Int!
        lhWins: Int!
        lhTotal: Int!
        win1Wins: Int!
        win1Total: Int!
        lose1Wins: Int!
        lose1Total: Int!
    }

    type PlayerStats {
        aces: Int!
        dfs: Int!
        serve1_pts_w: Int!
        serve1_pts: Int!
        serve2_pts_w: Int!
        serve2_pts: Int!
        ret1_pts_w: Int!
        ret1_pts: Int!
        ret2_pts_w: Int!
        ret2_pts: Int!
        bps_faced: Int!
        bps_saved: Int!
        bp_opps: Int!
        bps_converted: Int!
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
    }

    type ActivityMatch {
        round: String!
        winner_id: String
        incomplete: String
        opp_first_name: String!
        opp_last_name: String!
        opp_id: String!
        opp_countryCode: String!
        opp_countryName: String!
        opp_rank: Int
        p_scores: Score
        opp_scores: Score
    }

    type PlayerTournament {
        id: Int!
        sponsor_name: String
        tournamentId: Int!
        tournamentName: String!
        category: String
        start_date: Date!
        end_date: Date!
        environment: String!
        surface: String!
        hard_type: String
        city: String!
        countryId: String!
        countryName: String!
        currency: String
        rank: Int
        points: Int
        pm: Int
        matches: [ActivityMatch]
    }

    type YearStats {
        win: Int!
        loss: Int!
        titles: Int!
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
        gladiator: Boolean
        country: Country! @relationship(type: "REPRESENTS", properties: "Represents", direction: OUT)
        prev_countries: [Country!]! @relationship(type: "REPRESENTED", properties: "Represents", direction: OUT)
        turned_pro: Year! @relationship(type: "TURNED_PRO", direction: OUT)
        retired: Year @relationship(type: "RETIRED", direction: OUT)
        dob: Date
        height_cm: Int
        rh: Boolean
        bh1: Boolean
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
        indexTitles: Titles! @cypher(statement: """
            OPTIONAL MATCH (this)-[:WON]->(e:Event)
            WITH collect(e) AS events, count(e) as overallTitles, count(DISTINCT CASE WHEN e.category = 'Grand Slam' THEN e END) AS gsTitles, count(DISTINCT CASE WHEN e.category = 'ATP Masters 1000' THEN e END) AS mastersTitles
            UNWIND events AS e
            OPTIONAL MATCH (e)-[:ON_SURFACE]->(s:Surface)
            WITH overallTitles, gsTitles, mastersTitles, count(CASE WHEN s.surface = 'Clay' THEN e END) AS clayTitles, count(CASE WHEN s.surface = 'Grass' THEN e END) AS grassTitles, count(CASE WHEN s.surface = 'Hard' THEN e END) AS hardTitles, count(CASE WHEN s.surface = 'Carpet' THEN e END) AS carpetTitles, count(CASE WHEN s.environment = 'Indoor' THEN e END) AS indoorTitles, count(CASE WHEN s.environment = 'Outdoor' THEN e END) AS outdoorTitles
            RETURN {
                overallTitles: overallTitles,
                gsTitles: gsTitles,
                mastersTitles: mastersTitles,
                clayTitles: clayTitles,
                grassTitles: grassTitles,
                hardTitles: hardTitles,
                carpetTitles: carpetTitles,
                indoorTitles: indoorTitles,
                outdoorTitles: outdoorTitles
            } AS indexTitles
        """, columnName: "indexTitles")
        indexOpponents: Opponent! @cypher(statement: """
            OPTIONAL MATCH (this)-[:SCORED]->(s1:Score)-[]->(m)<-[]-(s2:Score)<-[:SCORED]-(p2:Player)
            WHERE m:Best3 OR m:Best5
            MATCH (m)-[:PLAYED]->(e:Event)<-[t:PLAYED]-(p2)
            WITH count(DISTINCT CASE WHEN p2.rh = true THEN m END) AS rhTotal,
            count(DISTINCT CASE WHEN p2.rh = true AND (s1)-[:WON]->(m) THEN m END) AS rhWins,
            count(DISTINCT CASE WHEN p2.rh = false THEN m END) AS lhTotal,
            count(DISTINCT CASE WHEN p2.rh = false AND (s1)-[:WON]->(m) THEN m END) AS lhWins,
            count(DISTINCT CASE WHEN t.rank <= 10 THEN m END) AS v10Total,
            count(DISTINCT CASE WHEN t.rank <= 10 AND (s1)-[:WON]->(m) THEN m END) AS v10Wins,
            count(DISTINCT CASE WHEN s1.s1 < s2.s1 THEN m END) AS lose1Total,
            count(DISTINCT CASE WHEN s1.s1 < s2.s1 AND (s1)-[:WON]->(m) THEN m END) AS lose1Wins,
            count(DISTINCT CASE WHEN s1.s1 > s2.s1 THEN m END) AS win1Total,
            count(DISTINCT CASE WHEN s1.s1 > s2.s1 AND (s1)-[:WON]->(m) THEN m END) AS win1Wins
            RETURN {
                rhTotal: rhTotal,
                rhWins: rhWins,
                lhTotal: lhTotal,
                lhWins: lhWins,
                v10Total: v10Total,
                v10Wins: v10Wins,
                win1Wins: win1Wins,
                win1Total: win1Total,
                lose1Wins: lose1Wins,
                lose1Total: lose1Total
            } AS indexOpponents
        """, columnName: "indexOpponents")
        indexFinals: Int! @cypher(statement: """
            OPTIONAL MATCH (this)-[:FINALIST]->(e:Event)
            RETURN count(e) AS indexFinals
        """, columnName: "indexFinals")
        indexMatches: IndexMatch @cypher(statement: """
            MATCH (p:Player {id: this.id})
            OPTIONAL MATCH (p)-[:SCORED]->(s:Score)-[]->(m)
            WHERE m:Best3 OR m:Best5
            WITH p, count(DISTINCT m) AS overallTotal, count(DISTINCT CASE WHEN (s)-[:WON]->(m) THEN m END) AS overallWins, count(DISTINCT CASE WHEN s.s5 IS NOT NULL THEN m END) AS set5Total, count(DISTINCT CASE WHEN s.s5 IS NOT NULL AND (s)-[:WON]->(m) THEN m END) AS set5Wins, count(DISTINCT CASE WHEN (m:Best3 AND s.s3 IS NOT NULL) OR (m:Best5 AND s.s5 IS NOT NULL) THEN m END) AS decidersTotal, count(DISTINCT CASE WHEN (m:Best3 AND s.s3 IS NOT NULL AND (s)-[:WON]->(m)) OR (m:Best5 AND s.s5 IS NOT NULL AND (s)-[:WON]->(m)) THEN m END) AS decidersWins, collect(m) AS matches
            UNWIND matches as m
            OPTIONAL MATCH (m)-[:PLAYED]->(e:Event)
            WITH p, overallTotal, overallWins, set5Wins, set5Total, decidersWins, decidersTotal, count(DISTINCT CASE WHEN e.category = 'Grand Slam' THEN m END) AS gsTotal, count(DISTINCT CASE WHEN e.category = 'Grand Slam' AND (p)-[:SCORED]->(:Score)-[:WON]->(m) THEN m END) AS gsWins, count(DISTINCT CASE WHEN e.category = 'ATP Masters 1000' THEN m END) AS mastersTotal, count(DISTINCT CASE WHEN e.category = 'ATP Masters 1000' AND (p)-[:SCORED]->(:Score)-[:WON]->(m) THEN m END) AS mastersWins, collect(m) AS matches
            UNWIND matches as m
            OPTIONAL MATCH (m)-[:PLAYED]->(e:Event)-[:ON_SURFACE]->(s:Surface)
            WITH overallTotal, overallWins, set5Wins, set5Total, gsTotal, gsWins, mastersTotal, mastersWins, decidersWins, decidersTotal, count(DISTINCT CASE WHEN s.surface = 'Clay' THEN m END) AS clayTotal, count(DISTINCT CASE WHEN s.surface = 'Clay' AND (p)-[:SCORED]->(:Score)-[:WON]->(m) THEN m END) AS clayWins, count(DISTINCT CASE WHEN s.surface = 'Hard' THEN m END) AS hardTotal, count(DISTINCT CASE WHEN s.surface = 'Hard' AND (p)-[:SCORED]->(:Score)-[:WON]->(m) THEN m END) AS hardWins, count(DISTINCT CASE WHEN s.surface = 'Grass' THEN m END) AS grassTotal, count(DISTINCT CASE WHEN s.surface = 'Grass' AND (p)-[:SCORED]->(:Score)-[:WON]->(m) THEN m END) AS grassWins, count(DISTINCT CASE WHEN s.surface = 'Carpet' THEN m END) AS carpetTotal, count(DISTINCT CASE WHEN s.surface = 'Carpet' AND (p)-[:SCORED]->(:Score)-[:WON]->(m) THEN m END) AS carpetWins, count(DISTINCT CASE WHEN s.environment = 'Indoor' THEN m END) AS indoorTotal, count(DISTINCT CASE WHEN s.environment = 'Indoor' AND (p)-[:SCORED]->(:Score)-[:WON]->(m) THEN m END) AS indoorWins, count(DISTINCT CASE WHEN s.environment = 'Outdoor' THEN m END) AS outdoorTotal, count(DISTINCT CASE WHEN s.environment = 'Outdoor' AND (p)-[:SCORED]->(:Score)-[:WON]->(m) THEN m END) AS outdoorWins
            RETURN {
                overallWins: overallWins,
                overallTotal: overallTotal,
                gsWins: gsWins,
                gsTotal: gsTotal,
                mastersWins: mastersWins,
                mastersTotal: mastersTotal,
                decidersWins: decidersWins,
                decidersTotal: decidersTotal,
                set5Wins: set5Wins,
                set5Total: set5Total,
                clayWins: clayWins,
                clayTotal: clayTotal,
                hardWins: hardWins,
                hardTotal: hardTotal,
                grassWins: grassWins,
                grassTotal: grassTotal,
                carpetWins: carpetWins,
                carpetTotal: carpetTotal,
                indoorWins: indoorWins,
                indoorTotal: indoorTotal,
                outdoorWins: outdoorWins,
                outdoorTotal: outdoorTotal
            } AS indexMatches
        """, columnName: "indexMatches")
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
        stats (year: Int, surface: String): PlayerStats! @cypher(statement: """
            MATCH (y:Year)-[:TOOK_PLACE_IN]-(e:Event)-[:ON_SURFACE]-(t:Surface)
            MATCH (p:Player {id: 's0ag'})-[:SCORED]-(s:Score)-[]-(m)-[:PLAYED]-(e)
            WHERE (m:Best3 OR m:Best5)
            AND (coalesce($year, y.id) = y.id) AND (coalesce($surface, t.surface) = t.surface)
            WITH COLLECT(DISTINCT s) AS scores
            UNWIND scores AS s
            RETURN {
                aces: sum(s.aces),
                dfs: sum(s.dfs),
                serve1_pts_w: sum(s.serve1_pts_w),
                serve1_pts: sum(s.serve1_pts),
                serve2_pts_w: sum(s.serve2_pts_w),
                serve2_pts: sum(s.serve2_pts),
                bps_faced: sum(s.bps_faced),
                bps_saved: sum(s.bps_saved),
                ret1_pts_w: sum(s.ret1_w),
                ret1_pts: sum(s.ret1),
                ret2_pts_w: sum(s.ret2_w),
                ret2_pts: sum(s.ret2),
                bp_opps: sum(s.bp_opps),
                bps_converted: sum(s.bps_converted)
            } AS stats
        """, columnName: "stats")
        tournaments (year: Int!): [PlayerTournament!]! @cypher(statement: """
            MATCH (p:Player {id: this.id})-[a:PLAYED]-(e:Event)-[:TOOK_PLACE_IN]-(:Year {id: $year})
            MATCH (p)-[:SCORED]->(s:Score)-[b]->(m:Match)-[:PLAYED]->(e)-[:EDITION_OF]-(t:Tournament)
            MATCH (w:Surface)-[:ON_SURFACE]-(e)-[:TOOK_PLACE_IN]-(y:Venue)-[:LOCATED_IN]-(z:Country)
            MATCH (m)<-[c]-(d:Score)-[:SCORED]-(f:Player)-[:REPRESENTS]-(g:Country)
            WHERE f.id <> p.id
            MATCH (f)-[q:PLAYED]-(e)
            WITH e, m, f, g, q, s, d, a, t, w, y, z,
            CASE
                WHEN type(b) = 'WON' THEN p.id
                WHEN type(c) = 'WON' THEN f.id
            END AS winner_id
            ORDER BY e.start_date, m.match_no
            WITH e, a, t, w, y, z, COLLECT({
            id: m.id, incomplete: m.incomplete, winner_id: winner_id, round: m.round, opp_first_name: f.first_name, opp_last_name: f.last_name, opp_id: f.id, opp_countryCode: g.id, opp_countryName: g.name, opp_rank: q.rank, p_scores: {s1: s.s1, s2: s.s2, s3: s.s3, s4: s.s4, s5: s.s5, t1: s.t1, t2: s.t2, t3: s.t3, t4: s.t4, t5: s.t5, incomplete: s.incomplete}, opp_scores: {s1: d.s1, s2: d.s2, s3: d.s3, s4: d.s4, s5: d.s5, t1: d.t1, t2: d.t2, t3: d.t3, t4: d.t4, t5: d.t5, incomplete: d.incomplete}
            }) AS matches
            RETURN {id: e.id, start_date: e.start_date, end_date: e.end_date, rank: a.rank, points: a.points, pm: a.pm, currency: e.currency, matches: matches, sponsor_name: e.sponsor_name, tournamentId: t.id, tournamentName: t.name, category: e.category, environment: w.environment, surface: w.surface, hard_type: w.hard_type, city: y.city, countryId: z.id, countryName: z.name} AS tournaments
        """, columnName: "tournaments")
        yearStats(year: Int!): YearStats @cypher(statement: """
            MATCH (p:Player {id: this.id})-[:WON]-(e:Event)-[:TOOK_PLACE_IN]-(y:Year {id: $year})
            MATCH (p)-[:SCORED]-(:Score)-[:WON]-(m:Match)-[:PLAYED]-(:Event)-[:TOOK_PLACE_IN]-(y)
            WHERE m:Best3 OR m:Best5
            MATCH (p)-[:SCORED]-(:Score)-[:LOST]-(l:Match)-[:PLAYED]-(:Event)-[:TOOK_PLACE_IN]-(y)
            WHERE l:Best3 OR l:Best5
            MATCH (p)-[a:PLAYED]-(:Event)-[:TOOK_PLACE_IN]-(y)
            RETURN {titles: count(DISTINCT e), win: count(DISTINCT m), loss: count(DISTINCT l)} AS yearStats
        """, columnName: "yearStats")
    }

    type Represents @relationshipProperties {
        start_date: Date
        end_date: Date
    }

    type Tournament {
        id: Int! @unique
        name: String!
        website: String
        start_year: Year! @relationship(type: "ESTABLISHED", direction: OUT)
        end_year: Year @relationship(type:"ABOLISHED", direction: OUT)
        events: [Event!]! @relationship(type: "EDITION_OF", direction: IN)
    }

    type Supervisor {
        id: String
    }

    type LDA {
        rank: Int
        player: Player
        status: String
    }

    type EntryReason {
        player: Player
        reason: String
    }

    type Seed {
        seed: Int
        rank: Int
        player: Player
        wd: String
    }

    type Match {
        id: String!
        match_no: Int!
        date: Date
        court: String
        duration: Int
        umpire: String
        winner: Player
        loser: Player
        winner_score: Score
        loser_score: Score
        incomplete: String
    }

    type Round {
        round: String
        matches: [Match]
    }

    type DrawMatch {
        id: String!
        match_no: Int!
        incomplete: String
        p1: Player
        p2: Player
        p1_score: Score
        p2_score: Score
        winner: String
    }

    type Draw {
        round: String
        matches: [DrawMatch]
    }

    type ResultSeed {
        seeds: [String]
    }

    type Status {
        WC: [String]
        Alt: [String]
        LL: [String]
        Q: [String]
        PR: [String]
        SE: [String]
    }

    type Event {
        id: Int! @unique
        start_date: Date
        end_date: Date
        sponsor_name: String
        winner: Player @relationship(type: "WON", direction: IN)
        finalist: Player @relationship(type: "FINALIST", direction: IN)
        final_score: String
        surface: Surface @relationship(type: "ON_SURFACE", direction: OUT)
        venue: Venue @relationship(type: "TOOK_PLACE_IN", direction: OUT)
        tournament: Tournament! @relationship(type: "EDITION_OF", direction: OUT)
        year: Year! @relationship(type: "TOOK_PLACE_IN", direction: OUT)
        pm: Int
        tfc: Int
        currency: String
        category: String
        draw_type: String
        supervisors: [Supervisor!]! @relationship(type: "SUPERVISED", direction: IN)
        seeds: [Seed!]! @cypher(statement: """
            MATCH (this)-[t:PLAYED]-(p:Player)
            WHERE t.seed IS NOT NULL
            MATCH (p)-[:REPRESENTS]->(c:Country)
            RETURN {seed: t.seed, rank: t.rank, wd: t.wd, player: {id: p.id, first_name: p.first_name, last_name: p.last_name, country: {id: c.id, name: c.name}}} AS seeds
            ORDER BY t.seed 
        """, columnName: "seeds")
        resultSeeds: ResultSeed @cypher(statement: """
            MATCH (this)-[t:PLAYED]-(p:Player)
            WHERE t.seed IS NOT NULL
            WITH t, p
            ORDER BY t.seed
            RETURN {seeds: COLLECT(p.id)} AS seeds
        """, columnName: "seeds")
        statuses: Status @cypher(statement: """
            MATCH (this)-[t:PLAYED]-(p:Player)
            WHERE t.status IS NOT NULL
            WITH t.status AS status, COLLECT(p.id) AS players
            RETURN apoc.map.fromPairs(COLLECT([status, players])) AS statuses
        """, columnName: "statuses")
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
        lda: LDA @cypher(statement: """
            MATCH (this)-[t:PLAYED]-(p:Player)
            WHERE t.lda IS NOT NULL
            MATCH (p)-[:REPRESENTS]->(c:Country)
            RETURN {rank: t.lda, player: {id: p.id, first_name: p.first_name, last_name: p.last_name, country: {id: c.id, name: c.name}}, status: t.status} AS lda
        """, columnName: "lda")
        lls: [Player!]! @cypher(statement: """
            MATCH (this)-[t:PLAYED]-(p:Player)
            WHERE t.status = 'LL'
            RETURN p AS lls
        """, columnName: "lls")
        alts: [Player!]! @cypher(statement: """
            MATCH (this)-[t:PLAYED]-(p:Player)
            WHERE t.status = 'Alt'
            RETURN p AS alts
        """, columnName: "alts")
        wds: [EntryReason!]! @cypher(statement: """
            MATCH (this)-[t:PLAYED]-(p:Player)
            WHERE t.wd IS NOT NULL
            MATCH (p)-[:REPRESENTS]->(c:Country)
            RETURN {player: {id: p.id, first_name: p.first_name, last_name: p.last_name, country: {id: c.id, name: c.name}}, reason: t.wd} AS wds
        """, columnName: "wds")
        rets: [EntryReason!]! @cypher(statement: """
            MATCH (this)-[t:PLAYED]-(p:Player)
            WHERE t.ret IS NOT NULL
            MATCH (p)-[:REPRESENTS]->(c:Country)
            RETURN {player: {id: p.id, first_name: p.first_name, last_name: p.last_name, country: {id: c.id, name: c.name}}, reason: t.ret} AS rets
        """, columnName: "rets")
        wos: [EntryReason!]! @cypher(statement: """
            MATCH (this)-[t:PLAYED]-(p:Player)
            WHERE t.wo IS NOT NULL
            MATCH (p)-[:REPRESENTS]->(c:Country)
            RETURN {player: {id: p.id, first_name: p.first_name, last_name: p.last_name, country: {id: c.id, name: c.name}}, reason: t.wo} AS rets
        """, columnName: "rets")
        defs: [EntryReason!]! @cypher(statement: """
            MATCH (this)-[t:PLAYED]-(p:Player)
            WHERE t.defaulted IS NOT NULL
            MATCH (p)-[:REPRESENTS]->(c:Country)
            RETURN {player: {id: p.id, first_name: p.first_name, last_name: p.last_name, country: {id: c.id, name: c.name}}, reason: t.defaulted} AS defs
        """, columnName: "defs")
        rounds: [Round!]! @cypher(statement: """
            MATCH (this)-[:PLAYED]-(m:Match)
            MATCH (m)-[:WON]-(ws:Score)-[:SCORED]-(w:Player)-[:REPRESENTS]-(wc:Country)
            OPTIONAL MATCH (m)-[:LOST]-(ls:Score)-[:SCORED]-(l:Player)-[:REPRESENTS]-(lc:Country)
            OPTIONAL MATCH (m)-[:UMPIRED]-(u:Umpire)
            WITH m.round AS round, m, u, {id: w.id, first_name: w.first_name, last_name: w.last_name, country: {id: wc.id, name: wc.name}} AS winner, {id: l.id, first_name: l.first_name, last_name: l.last_name, country: {id: lc.id, name: lc.name}} AS loser, {s1: ws.s1, s2: ws.s2, s3: ws.s3, s4: ws.s4, s5: ws.s5, t1: ws.t1, t2: ws.t2, t3: ws.t3, t4: ws.t4, t5: ws.t5, incomplete: ws.incomplete} AS winner_score, {s1: ls.s1, s2: ls.s2, s3: ls.s3, s4: ls.s4, s5: ls.s5, t1: ls.t1, t2: ls.t2, t3: ls.t3, t4: ls.t4, t5: ls.t5, incomplete: ls.incomplete} AS loser_score
            ORDER BY m.match_no
            WITH round, COLLECT(DISTINCT{
                id: m.id,
                match_no: m.match_no,
                date: m.date,
                court: m.court,
                duration: m.duration_mins,
                umpire: u.id,
                incomplete: m.incomplete,
                winner: winner,
                loser: loser,
                winner_score: winner_score,
                loser_score: loser_score
            }) AS matches
            RETURN {round: round, matches: matches} AS rounds
        """, columnName: "rounds")
        draw: [Draw!]! @cypher(statement: """
            MATCH (this)-[:PLAYED]-(m:Match)
            MATCH (m)-[:WON]-(:Score)-[:SCORED]-(w:Player)
            OPTIONAL MATCH (m)-[]-(p1s:P1)-[:SCORED]-(p1:Player)-[:REPRESENTS]-(p1c:Country)
            OPTIONAL MATCH (m)-[]-(p2s:P2)-[:SCORED]-(p2:Player)-[:REPRESENTS]-(p2c:Country)
            WITH m.round AS round, m, w, {id: p1.id, first_name: p1.first_name, last_name: p1.last_name, country: {id: p1c.id, name: p1c.name}} AS player1, {id: p2.id, first_name: p2.first_name, last_name: p2.last_name, country: {id: p2c.id, name: p2c.name}} AS player2, {s1: p1s.s1, s2: p1s.s2, s3: p1s.s3, s4: p1s.s4, s5: p1s.s5, t1: p1s.t1, t2: p1s.t2, t3: p1s.t3, t4: p1s.t4, t5: p1s.t5, incomplete: p1s.incomplete} AS p1_score, {s1: p2s.s1, s2: p2s.s2, s3: p2s.s3, s4: p2s.s4, s5: p2s.s5, t1: p2s.t1, t2: p2s.t2, t3: p2s.t3, t4: p2s.t4, t5: p2s.t5, incomplete: p2s.incomplete} AS p2_score
            ORDER BY m.match_no
            WITH round, COLLECT(DISTINCT{
                id: m.id,
                match_no: m.match_no,
                incomplete: m.incomplete,
                winner: w.id,
                p1: player1,
                p2: player2,
                p1_score: p1_score,
                p2_score: p2_score
            }) AS matches
            RETURN {round: round, matches: matches} AS draw
        """, columnName: "draw")
    }
`