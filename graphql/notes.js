export const typeDefs = `#graphql
    type Tournament {
        website: String
        established: Year! @relationship(type: "ESTABLISHED", direction: OUT)
        abolished: Year @relationship(type: "ABOLISHED", direction: OUT)
        editions: [Event!]! @relationship(type: "EDITION_OF", direction: IN)
    }

    type Coach {
        first_name: String!
        last_name: String!
    }

    type Round {
        id: String!,
        round: String!
    }

    type Match {
        id: String!
        duration_mins: Int
        date: Date
        round: String!
        match_no: Int!
        incomplete: String
        umpire: Umpire @relationship(type: "UMPIRED", direction: IN)
        event: Event! @relationship(type: "PLAYED", direction: OUT)
        winner: Score! @relationship(type: "WON", direction: IN)
        loser: Score @relationship(type: "LOST", direction: IN)
    }

    type Event {
        currency: String
        finalist_pm: Int
        finalist_pts: Int
        semifinalist_pm: Int
        semifinalist_pts: Int
        quarterfinalist_pm: Int
        quarterfinalist_pts: Int
        winner_pm: Int
        winner_pts: Int
        r16_pm: Int
        r16_pts: Int
        r128_pm: Int
        r128_pts: Int
        r64_pm: Int
        r64_pts: Int
        r32_pm: Int
        r32_pts: Int
        supervisors: [String!]! @relationship(type: "SUPERVISED", direction: IN)
        draw_type: String! @relationship(type: "DRAW_OF", direction: IN)
    }

    type Player {
        coaches: [Coach!]! @relationship(type: "COACHES", direction: IN)
        events_played: [Event!]! @relationship(type: "PLAYED_IN", properties: "EntryInfo", direction: OUT)
        stats: [PlayerScore!]! @relationship(type: "SCORED", direction: OUT)
    }

    type PlayerScore {
        aces: Int
        avg_sv1_kph: Int
        avg_sv2_kph: Int
        bp_opps: Int
        bps_converted: Int
        bps_faced: Int
        bps_saved: Int
        dfs: Int
        id: String!
        max_speed_kph: Int
        net: Int
        net_w: Int
        pts: Int
        ret1: Int
        ret1_w: Int
        ret2: Int
        ret2_w: Int
        ret_gms: Int
        s1: Int
        s2: Int
        s3: Int
        s4: Int
        s5: Int
        serve1_pts: Int
        serve1_pts_w: Int
        serve2_pts: Int
        serve2_pts_w: Int
        sv_gms: Int
        t1: Int
        t2: Int
        t3: Int
        t4: Int
        t5: Int
        ues: Int
        winners: Int
        player: Player! @relationship(type: "SCORED", direction: IN)
        won: Match! @relationship(type: "WON", direction: OUT)
        lost: Match @relationship(type: "LOST", direction: OUT)
    }

    type EntryInfo @relationshipProperties {
        rank: Int
        seed: Int
        status: String
        ret: String
        wd: String
        wo: String
        defaulted: String
        pm: Int
        points: Int
    }
`