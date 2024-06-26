export const typeDefs = `#graphql
    type Category {
        id: String!
    }

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
            WITH e, count(e) as overallTitles
            OPTIONAL MATCH (e)-[:CATEGORY_OF]->(c:Category)
            WITH collect(e) AS events, overallTitles, count(CASE WHEN c.id = 'Grand Slam' THEN e END) AS gsTitles, count(CASE WHEN c.id = 'ATP Masters 1000' THEN e END) AS mastersTitles
            UNWIND events as e
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
            OPTIONAL MATCH (m)-[:PLAYED]->(e:Event)-[:CATEGORY_OF]->(c:Category)
            WITH p, overallTotal, overallWins, set5Wins, set5Total, decidersWins, decidersTotal, count(DISTINCT CASE WHEN c.id = 'Grand Slam' THEN m END) AS gsTotal, count(DISTINCT CASE WHEN c.id = 'Grand Slam' AND (p)-[:SCORED]->(:Score)-[:WON]->(m) THEN m END) AS gsWins, count(DISTINCT CASE WHEN c.id = 'ATP Masters 1000' THEN m END) AS mastersTotal, count(DISTINCT CASE WHEN c.id = 'ATP Masters 1000' AND (p)-[:SCORED]->(:Score)-[:WON]->(m) THEN m END) AS mastersWins, collect(m) AS matches
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
            OPTIONAL MATCH (v:Category)-[:CATEGORY_OF]-(e)
            MATCH (m)<-[c]-(d:Score)-[:SCORED]-(f:Player)-[:REPRESENTS]-(g:Country)
            WHERE f.id <> p.id
            MATCH (f)-[q:PLAYED]-(e)
            WITH e, m, f, g, q, s, d, a, t, v, w, y, z,
            CASE
                WHEN type(b) = 'WON' THEN p.id
                WHEN type(c) = 'WON' THEN f.id
            END AS winner_id
            ORDER BY e.start_date, m.match_no
            WITH e, a, t, v, w, y, z, COLLECT({
            id: m.id, incomplete: m.incomplete, winner_id: winner_id, round: m.round, opp_first_name: f.first_name, opp_last_name: f.last_name, opp_id: f.id, opp_countryCode: g.id, opp_countryName: g.name, opp_rank: q.rank, p_scores: {s1: s.s1, s2: s.s2, s3: s.s3, s4: s.s4, s5: s.s5, t1: s.t1, t2: s.t2, t3: s.t3, t4: s.t4, t5: s.t5, incomplete: s.incomplete}, opp_scores: {s1: d.s1, s2: d.s2, s3: d.s3, s4: d.s4, s5: d.s5, t1: d.t1, t2: d.t2, t3: d.t3, t4: d.t4, t5: d.t5, incomplete: d.incomplete}
            }) AS matches
            RETURN {id: e.id, start_date: e.start_date, end_date: e.end_date, rank: a.rank, points: a.points, pm: a.pm, currency: e.currency, matches: matches, sponsor_name: e.sponsor_name, tournamentId: t.id, tournamentName: t.name, category: v.id, environment: w.environment, surface: w.surface, hard_type: w.hard_type, city: y.city, countryId: z.id, countryName: z.name} AS tournaments
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
        category: Category @relationship(type: "CATEGORY_OF", direction: OUT)
        tournament: Tournament! @relationship(type: "EDITION_OF", direction: OUT)
        year: Year! @relationship(type: "TOOK_PLACE_IN", direction: OUT)
    }
`