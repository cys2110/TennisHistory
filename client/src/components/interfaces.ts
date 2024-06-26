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

export interface Edition {
    id: number,
    category: idString | null,
    sponsor_name: string | null,
    tournament: Tournament,
    venue: Venue,
    start_date: Date,
    end_date: Date,
    surface: Surface,
    year: idNumber
}

// // Tournament

// export interface TournamentDetails extends Tournament {
//     start_year: number,
//     end_year: number | null,
//     website: string | null,
//     Editions: EditionsOfTournament[]
// }

// Edition

// export interface EditionByPlayer extends Edition {
//     environment: string,
//     surface: string,
//     hard_type: string | null,
//     sponsor_name: string,
//     year: number,
//     winner_id: string,
//     finalist_id: string,
//     Tournament: Tournament
// }

// export interface EditionsOfTournament extends Edition {
//     year: number,
//     final_score: string | null,
//     end_date: Date,
//     winner: Player,
//     finalist: Player
// }

// export interface EditionDetails extends Edition {
//     sponsor_name: string | null,
//     category: string | null,
//     city: string,
//     country: string,
//     start_date: Date,
//     end_date: Date,
//     environment: string,
//     surface: string,
//     hard_type: string | null,
//     year: number,
//     type_of_draw: string,
//     currency: string,
//     pm: number | null,
//     tfc: number | null,
//     supervisors: string[] | null,
//     venue: string | null,
//     winner_pm: number | null,
//     winner_pts: number | null,
//     finalist_pm: number | null,
//     finalist_pts: number | null,
//     semifinalist_pm: number | null,
//     semifinalist_pts: number | null,
//     quarterfinalist_pm: number | null,
//     quarterfinalist_pts: number | null,
//     r16_pm: number | null,
//     r16_pts: number | null,
//     r32_pm: number | null,
//     r32_pts: number | null,
//     r64_pm: number | null,
//     r64_pts: number | null,
//     r128_pm: number | null,
//     r128_pts: number | null,
//     Entries: Entries[],
//     MatchScores: MatchScore[]
// }

// // Entries

// export interface Entry {
//     seed: number | null,
//     status: string | null,
//     Player: Player
// }

// export interface Entries extends Entry {
//     rank: number | null,
//     wd: string | null,
//     ret: string | null,
//     wo: string | null,
//     lda: number | null,
//     defaulted: string | null,
// }

// interface EntriesEdition {
//     sponsor_name: string | null,
//     category: string | null,
//     city: string,
//     country: string,
//     start_date: Date,
//     end_date: Date,
//     environment: string,
//     surface: string,
//     hard_type: string | null,
//     Tournament: Tournament,
//     currency: string,
//     year: number
// }

// export interface EntriesMatch {
//     id: number,
//     round: string,
//     incomplete: string | null,
//     s1p1: number | null,
//     s1p2: number | null,
//     t1p1: number | null,
//     t1p2: number | null,
//     s2p1: number | null,
//     s2p2: number | null,
//     t2p1: number | null,
//     t2p2: number | null,
//     s3p1: number | null,
//     s3p2: number | null,
//     t3p1: number | null,
//     t3p2: number | null,
//     s4p1: number | null,
//     s4p2: number | null,
//     t4p1: number | null,
//     t4p2: number | null,
//     s5p1: number | null,
//     s5p2: number | null,
//     t5p1: number | null,
//     t5p2: number | null,
//     winner_id: string,
//     entry1: {
//         rank: number | null,
//         Player: Player
//     },
//     entry2: {
//         rank: number | null,
//         Player: Player
//     }
// }

// // Match Scores
// export interface BaseMatchScore {
//     id: number,
//     round: string,
//     incomplete: string | null,
//     s1p1: number | null,
//     s1p2: number | null,
//     t1p1: number | null,
//     t1p2: number | null,
//     s2p1: number | null,
//     s2p2: number | null,
//     t2p1: number | null,
//     t2p2: number | null,
//     s3p1: number | null,
//     s3p2: number | null,
//     t3p1: number | null,
//     t3p2: number | null,
//     s4p1: number | null,
//     s4p2: number | null,
//     t4p1: number | null,
//     t4p2: number | null,
//     s5p1: number | null,
//     s5p2: number | null,
//     t5p1: number | null,
//     t5p2: number | null,
//     winner_id: string | null
// }

// export interface MatchH2H extends BaseMatchScore {
//     winner_id: string,
//     Edition: {
//         year: number,
//         environment: string,
//         surface: string,
//         edition_no: number,
//         Tournament: Tournament
//     }
// }

// export interface MatchScore extends BaseMatchScore {
//     match_no: number | null,
//     umpire: string | null,
//     duration_mins: number | null,
//     date: Date | null,
//     entry1: Entry,
//     entry2: Entry
// }

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

// interface MatchStatScore extends BaseMatchScore {
//     date: Date | null,
//     duration_mins: number | null,
//     umpire: string | null,
//     entry1: {
//         seed: number | null,
//         status: string | null,
//         Player: Player
//     },
//     entry2: {
//         seed: number | null,
//         status: string | null,
//         Player: Player
//     },
//     Edition: {
//         year: number,
//         environment: string,
//         surface: string,
//         hard_type: string,
//         sponsor_name: string,
//         start_date: Date,
//         end_date: Date
//     }
// }

// Player

export interface Player {
    id: string,
    first_name: string,
    last_name: string,
    full_name: string,
    countryConnection: {
        edges: {
            node: Country,
            properties: {
                start_date: Date | null,
                end_date: Date | null
            }
        }[]
    }
}

export interface PlayerDetails extends Player {
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