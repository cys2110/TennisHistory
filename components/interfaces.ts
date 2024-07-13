interface Score {
    s1: number | null,
    s2: number | null,
    s3: number | null,
    s4: number | null,
    s5: number | null,
    t1: number | null,
    t2: number | null,
    t3: number | null,
    t4: number | null,
    t5: number | null,
    incomplete: string | null
}

export interface Edition {
    draw_type?: string
}

export interface Entry {
    reason: string,
    player: PlayerCountry
}

export interface EditionDetails extends Edition {
    seeds: {
        seed: number,
        rank: number,
        wd: string | null,
        player: PlayerCountry
    }[],
    lda: {
        rank: number,
        status: string | null,
        player: PlayerCountry
    },
    lls: PlayerCountry[],
    alts: PlayerCountry[],
    wds: Entry[],
    rets: Entry[],
    wos: Entry[],
    defs: Entry[]
}

export interface Result {
    round: string,
    matches: MatchResult[]
}

export interface Draw {
    round: string,
    matches: DrawResult[]
}

export interface Status {
    WC: String[],
    Alt: String[],
    LL: String[],
    Q: String[],
    PR: String[],
    SE: String[]
}

export interface MatchResult {
    id: string,
    match_no: number,
    date: Date | null,
    duration: number | null,
    umpire: string | null,
    court: string | null,
    incomplete: string | null,
    winner: PlayerCountry,
    loser: PlayerCountry | null,
    winner_score: Score | null,
    loser_score: Score | null
}

export interface DrawResult {
    id: string,
    match_no: number,
    incomplete: string | null,
    winner: string,
    p1: PlayerCountry,
    p2: PlayerCountry | null,
    p1_score: Score | null,
    p2_score: Score | null
}

// Match Stats

interface Stats {
    aces: number | null,
    dfs: number | null,
    serve1_pts_w: number | null,
    serve1_pts: number | null,
    serve2_pts_w: number | null,
    serve2_pts: number | null,
    bps_saved: number | null,
    bps_faced: number | null,
    ret1_w: number | null,
    ret1: number | null,
    ret2_w: number | null,
    ret2: number | null,
    bp_opps: number | null,
    bps_converted: number | null,
    net_w: number | null,
    net: number | null,
    winners: number | null,
    ues: number | null,
    max_speed_kph: number | null,
    avg_sv1_kph: number | null,
    avg_sv2_kph: number | null,
    s1: number | null,
    s2: number | null,
    s3: number | null,
    s4: number | null,
    s5: number | null,
    t1: number | null,
    t2: number | null,
    t3: number | null,
    t4: number | null,
    t5: number | null,
    incomplete: string,
    player: PlayerCountry
}

export interface MatchStat {
    court: string | null,
    date: Date | null,
    duration: number | null,
    umpire: string | null,
    winner: string,
    p1: Stats,
    p2: Stats
}

// Player

export interface ActivityMatch {
    round: string,
    winner_id: string | null,
    incomplete: string | null,
    opp_first_name: string | null,
    opp_last_name: string | null,
    opp_id: string | null,
    opp_countryCode: string | null,
    opp_countryName: string | null,
    opp_rank: number | null,
    p_scores: Score,
    opp_scores: Score
}

export interface PlayerActivity {
    id: number,
    sponsor_name: string | null,
    tournamentId: number,
    tournamentName: string,
    category: string | null,
    start_date: Date,
    end_date: Date,
    environment: string,
    surface: string,
    hard_type: string | null,
    city: string,
    countryId: string,
    countryName: string,
    currency: string,
    rank: number | null,
    points: number | null,
    pm: number | null,
    matches: ActivityMatch[]
}