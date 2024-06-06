// Tournament

export interface Tournament {
    id: number,
    name: string
}

export interface TournamentDetails extends Tournament {
    start_year: number,
    end_year: number | null,
    website: string | null,
    Editions: EditionsOfTournament[]
}

// Edition

export interface Edition {
    id: number,
    edition_no: number,
}

export interface EditionsOfTournament extends Edition {
    year: number,
    final_score: string | null,
    end_date: Date,
    winner: Player,
    finalist: Player
}

export interface UpcomingEdition extends Edition {
    sponsor_name: string | null,
    category: string | null,
    city: string,
    country: string,
    start_date: Date,
    end_date: Date,
    environment: string,
    surface: string,
    hard_type: string | null,
    Tournament: Tournament
}

export interface ArchiveEdition extends UpcomingEdition {
    year: number
}

export interface EditionDetails extends Edition {
    sponsor_name: string | null,
    category: string | null,
    city: string,
    country: string,
    start_date: Date,
    end_date: Date,
    environment: string,
    surface: string,
    hard_type: string | null,
    year: number,
    type_of_draw: string,
    currency: string | null,
    pm: number | null,
    tfc: number | null,
    supervisors: string[] | null,
    venue: string | null,
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
    Entries: Entries[],
    MatchScores: MatchScore[]
}

interface Entries {
    rank: number | null,
    seed: number | null,
    status: string | null,
    wd: string | null,
    ret: string | null,
    wo: string | null,
    lda: number | null,
    defaulted: string | null,
    Player: Player
}

// Match Scores

export interface MatchH2H {
    id: number,
    round: string,
    incomplete: string | null,
    s1p1: number | null,
    s1p2: number | null,
    t1p1: number | null,
    t1p2: number | null,
    s2p1: number | null,
    s2p2: number | null,
    t2p1: number | null,
    t2p2: number | null,
    s3p1: number | null,
    s3p2: number | null,
    t3p1: number | null,
    t3p2: number | null,
    s4p1: number | null,
    s4p2: number | null,
    t4p1: number | null,
    t4p2: number | null,
    s5p1: number | null,
    s5p2: number | null,
    t5p1: number | null,
    t5p2: number | null,
    createdAt: Date,
    updatedAt: Date,
    p1: string,
    p2: string,
    EditionId: number,
    p1_no: number,
    p2_no: number,
    TieId: number | null,
    winner_id: string,
    Edition: {
        year: number,
        environment: string,
        surface: string,
        edition_no: number,
        Tournament: Tournament
    }
}

interface BaseMatchScore {
    id: number,
    round: string,
    incomplete: string | null,
    umpire: string | null,
    duration_mins: number | null,
    date: Date | null,
    s1p1: number | null,
    s1p2: number | null,
    t1p1: number | null,
    t1p2: number | null,
    s2p1: number | null,
    s2p2: number | null,
    t2p1: number | null,
    t2p2: number | null,
    s3p1: number | null,
    s3p2: number | null,
    t3p1: number | null,
    t3p2: number | null,
    s4p1: number | null,
    s4p2: number | null,
    t4p1: number | null,
    t4p2: number | null,
    s5p1: number | null,
    s5p2: number | null,
    t5p1: number | null,
    t5p2: number | null,
    winner_id: string,
    player1: Player,
    player2: Player,
    entry1: {
        seed: number | null,
        status: string | null
    },
    entry2: {
        seed: number | null,
        status: string | null
    }
}

export interface MatchScore extends BaseMatchScore {
    match_no: number | null
}

// Match Stats

export interface MatchStat {
    id: number,
    p1_aces: number,
    p1_dfs: number,
    p1_serve1: number,
    p1_total_serve1: number,
    p1_serve1_pts_w: number,
    p1_serve1_pts: number,
    p1_serve2_pts_w: number,
    p1_serve2_pts: number,
    p1_bps_saved: number,
    p1_bps_faced: number,
    p1_sv_gms: number | null,
    p1_ret1_w: number,
    p1_ret1: number,
    p1_ret2_w: number,
    p1_ret2: number,
    p1_bp_opps: number,
    p1_bps_converted: number,
    p1_ret_gms: number | null,
    p1_net_w: number | null,
    p1_net: number | null,
    p1_winners: number | null,
    p1_ues: number | null,
    p1_sv_pts: number,
    p1_sv_pts_total: number,
    p1_ret_pts: number,
    p1_ret_pts_total: number,
    p1_pts: number,
    total_pts: number,
    p1_max_speed_kph: number | null,
    p1_max_speed_mph: number | null,
    p1_avg_sv1_kph: number | null,
    p1_avg_sv1_mph: number | null,
    p1_avg_sv2_kph: number | null,
    p1_avg_sv2_mph: number | null,
    p2_aces: number,
    p2_dfs: number,
    p2_serve1: number,
    p2_total_serve1: number,
    p2_serve1_pts_w: number,
    p2_serve1_pts: number,
    p2_serve2_pts_w: number,
    p2_serve2_pts: number,
    p2_bps_saved: number,
    p2_bps_faced: number,
    p2_sv_gms: number | null,
    p2_ret1_w: number,
    p2_ret1: number,
    p2_ret2_w: number,
    p2_ret2: number,
    p2_bp_opps: number,
    p2_bps_converted: number,
    p2_ret_gms: number | null,
    p2_net_w: number | null,
    p2_net: number | null,
    p2_winners: number | null,
    p2_ues: number | null,
    p2_sv_pts: number,
    p2_sv_pts_total: number,
    p2_ret_pts: number,
    p2_ret_pts_total: number,
    p2_pts: number,
    p2_max_speed_kph: number | null,
    p2_max_speed_mph: number | null,
    p2_avg_sv1_kph: number | null,
    p2_avg_sv1_mph: number | null,
    p2_avg_sv2_kph: number | null,
    p2_avg_sv2_mph: number | null,
    MatchScore: MatchStatScore
}

interface MatchStatScore extends BaseMatchScore {
    Edition: {
        year: number,
        environment: string,
        surface: string,
        hard_type: string,
        sponsor_name: string,
        start_date: Date,
        end_date: Date
    },
}

// Player

export interface Player {
    id: string,
    first_name: string,
    last_name: string,
    full_name: string,
    country: string
}

export interface PlayerDetails extends Player {
    country_yr: number | null,
    prev_country: string | null,
    prev_country_yr: number | null,
    first_country: string | null,
    status: boolean,
    turned_pro: number,
    retired: number | null,
    dob: Date | null,
    rh: boolean | null,
    bh1: boolean | null,
    height_cm: number | null,
    height_ft: string | null,
    coaches: string[] | null,
    career_high: number | null,
    ch_date: Date | null,
    pm_USD: number,
    titles: number,
    win: number,
    loss: number,
    gladiator: boolean,
    ao_round: string | null,
    ao_years: number[] | null,
    rg_round: string | null,
    rg_years: number[] | null,
    wimbledon_round: string | null,
    wimbledon_years: number[] | null,
    uso_round: string | null,
    uso_years: number[] | null,
    finals_round: string | null,
    finals_years: number[] | null,
    davis_round: string | null,
    davis_years: number[] | null,
    olympics_round: string | null,
    olympics_years: number[] | null,
    hopman_round: string | null,
    hopman_years: number[] | null,
    gs_cup_round: string | null,
    gs_cup_years: number[] | null,
    wct_round: string | null,
    wct_years: number[] | null,
    createdAt: Date,
    updatedAt: Date
}

export interface WLIndex {
    overallWins: number,
    overallTotal: number,
    overallTitles: number,
    finalsTotal: number,
    set5Wins: number,
    set5Total: number,
    win1Wins: number,
    win1Total: number,
    lose1Wins: number,
    lose1Total: number,
    decidersWins: number,
    decidersTotal: number,
    p1tb1Wins: number,
    p2tb1Wins: number,
    total1Tbs: number,
    p1tb2Wins: number,
    p2tb2Wins: number,
    total2Tbs: number,
    p1tb3Wins: number,
    p2tb3Wins: number,
    total3Tbs: number,
    p1tb4Wins: number,
    p2tb4Wins: number,
    total4Tbs: number,
    p1tb5Wins: number,
    p2tb5Wins: number,
    total5Tbs: number,
    clayWins: number,
    clayTotal: number,
    clayTitles: number,
    grassWins: number,
    grassTotal: number,
    grassTitles: number,
    carpetWins: number,
    carpetTotal: number,
    carpetTitles: number,
    hardWins: number,
    hardTotal: number,
    hardTitles: number,
    indoorWins: number,
    indoorTotal: number,
    indoorTitles: number,
    outdoorWins: number,
    outdoorTotal: number,
    outdoorTitles: number,
    gsWins: number,
    gsTotal: number,
    gsTitles: number,
    mastersWins: number,
    mastersTotal: number,
    mastersTitles: number,
    v10Wins1: number,
    v10Total1: number,
    v10Wins2: number,
    v10Total2: number,
    rhWins1: number,
    rhTotal1: number,
    rhWins2: number,
    rhTotal2: number,
    lhWins1: number,
    lhTotal1: number,
    lhWins2: number,
    lhTotal2: number
}