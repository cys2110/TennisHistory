interface Surface {
    environment: string,
    surface: string,
    hard_type: string | null
}

interface Country {
    id: string,
    name: string
}

interface Venue {
    name: string,
    city: string,
    country: Country
}

interface idString {
    id: string
}

interface idNumber {
    id: number
}

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

export interface Tournament {
    id: number,
    name: string
}

export interface TournamentDetails extends Tournament {
    website: string | null,
    start_year: idNumber,
    end_year: idNumber,
    events: TournamentEvent[]
}

export interface TournamentEvent {
    id: number,
    year: idNumber,
    winner: PlayerCountry,
    finalist: PlayerCountry,
    final_score: string
    end_date: Date
}

export interface Edition {
    id: number,
    category: string | null,
    sponsor_name: string | null,
    tournament: Tournament,
    venue: Venue,
    start_date: Date,
    end_date: Date,
    surface: Surface,
    year: idNumber,
    draw_type?: string
}

export interface PlayerCountry extends Player {
    country: {
        id: string,
        name: string
    }
}

export interface Entry {
    reason: string,
    player: PlayerCountry
}

export interface EditionDetails extends Edition {
    currency: string,
    pm: number | null,
    tfc: number | null,
    supervisors: idString[],
    winner_pm: number | null,
    winner_pts: number | null,
    finalist_pm: number | null,
    finalist_pts: number | null,
    semifinalist_pm: number | null,
    semifinalist_pts: number | null,
    quarterfinalist_pm: number | null,
    quarterfinalist_pts: number | null,
    r16_pm: number | null,
    r16_pts: number | null,
    r32_pm: number | null,
    r32_pts: number | null,
    r64_pm: number | null,
    r64_pts: number | null,
    r128_pm: number | null,
    r128_pts: number | null,
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

// // Match Stats

// export interface MatchStat {
//     id: number,
//     p1_aces: number,
//     p1_dfs: number,
//     p1_serve1: number,
//     p1_total_serve1: number,
//     p1_serve1_pts_w: number,
//     p1_serve1_pts: number,
//     p1_serve2_pts_w: number,
//     p1_serve2_pts: number,
//     p1_bps_saved: number,
//     p1_bps_faced: number,
//     p1_sv_gms: number | null,
//     p1_ret1_w: number,
//     p1_ret1: number,
//     p1_ret2_w: number,
//     p1_ret2: number,
//     p1_bp_opps: number,
//     p1_bps_converted: number,
//     p1_ret_gms: number | null,
//     p1_net_w: number | null,
//     p1_net: number | null,
//     p1_winners: number | null,
//     p1_ues: number | null,
//     p1_sv_pts: number,
//     p1_sv_pts_total: number,
//     p1_ret_pts: number,
//     p1_ret_pts_total: number,
//     p1_pts: number,
//     total_pts: number,
//     p1_max_speed_kph: number | null,
//     p1_max_speed_mph: number | null,
//     p1_avg_sv1_kph: number | null,
//     p1_avg_sv1_mph: number | null,
//     p1_avg_sv2_kph: number | null,
//     p1_avg_sv2_mph: number | null,
//     p2_aces: number,
//     p2_dfs: number,
//     p2_serve1: number,
//     p2_total_serve1: number,
//     p2_serve1_pts_w: number,
//     p2_serve1_pts: number,
//     p2_serve2_pts_w: number,
//     p2_serve2_pts: number,
//     p2_bps_saved: number,
//     p2_bps_faced: number,
//     p2_sv_gms: number | null,
//     p2_ret1_w: number,
//     p2_ret1: number,
//     p2_ret2_w: number,
//     p2_ret2: number,
//     p2_bp_opps: number,
//     p2_bps_converted: number,
//     p2_ret_gms: number | null,
//     p2_net_w: number | null,
//     p2_net: number | null,
//     p2_winners: number | null,
//     p2_ues: number | null,
//     p2_sv_pts: number,
//     p2_sv_pts_total: number,
//     p2_ret_pts: number,
//     p2_ret_pts_total: number,
//     p2_pts: number,
//     p2_max_speed_kph: number | null,
//     p2_max_speed_mph: number | null,
//     p2_avg_sv1_kph: number | null,
//     p2_avg_sv1_mph: number | null,
//     p2_avg_sv2_kph: number | null,
//     p2_avg_sv2_mph: number | null,
//     MatchScore: MatchStatScore
// }

// Player

export interface Player {
    id: string,
    first_name: string,
    last_name: string,
    full_name: string,
}

export interface PlayerDetails extends Player {
    countryConnection: {
        edges: {
            node: Country,
            properties: {
                start_date: Date | null,
                end_date: Date | null
            }
        }[]
    }
    prev_countriesConnection: {
        edges: {
            node: Country,
            properties: {
                start_date: Date,
                end_date: Date
            }
        }[] | []
    },
    turned_pro: idNumber,
    retired: idNumber | null,
    dob: Date | null,
    rh: boolean | null,
    bh1: boolean | null,
    height_cm: number | null,
    career_high: number | null,
    ch_date: Date | null,
    pm_USD: number,
    titles: number,
    win: number,
    loss: number,
    gladiator: boolean
}

// export interface PlayerDetails extends Player {
//     coaches: {first_name: string, last_name: string}[],
// }

interface TitlesFinals {
    id: number,
    sponsor_name: string | null,
    tournament_id: number,
    tournament_name: string,
    environment: string,
    surface: string,
    hard_type: string | null
}

export interface TitlesAndFinals {
    titlesByYear: [] | {
        year: number,
        count: number,
        events: TitlesFinals[]
    }[],
    finalsByYear: [] | {
        year: number,
        count: number,
        events: TitlesFinals[]
    }[]
}

export interface WLIndex {
    category: string,
    stats: {
        metric: string,
        win: number,
        total: number,
        titles?: number
    }[]
}

export interface PlayerStat {
    category: string,
    stats: {
        metric: string,
        win?: number,
        total: number,
    }[]
}

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