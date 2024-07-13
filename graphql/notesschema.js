export const typeDefs = `#graphql
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
        p1: Score @cypher (statement: """
            MATCH (this)-[]-(s:P1)
            RETURN s AS p1
        """, columnName: "p1")
        p2: Score @cypher (statement: """
            MATCH (this)-[]-(s:P2)
            RETURN s AS p2
        """, columnName: "p2")
        winner: String @cypher(statement: """
            MATCH (this)-[:WON]-(:Score)-[:SCORED]-(p:Player)
            RETURN p.id AS winner
        """, columnName: "winner")
        incomplete: String
        event: Event! @relationship(type: "PLAYED", direction: OUT)
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