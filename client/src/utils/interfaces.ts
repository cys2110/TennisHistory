interface stringId {
    id: string
}

interface numberId {
    id: number
}

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
    name?: string | null,
    city: string,
    country: Country
}

export interface Tournament {
    id: number,
    name: string
}

export interface TournamentEvent {
    id: number,
    year: numberId,
    winner: Player,
    finalist: Player,
    final_score: string,
    end_date: Date
}

export interface TournamentDetails extends Tournament {
    website: string | null,
    start_year: numberId,
    end_year: numberId | null,
    events: TournamentEvent[]
}

interface EntryInfo {
    seed: number | null,
    status: string | null,
    points: number | null,
    rank: number | null,
    pm: number | null
}

export interface Event {
    id: number,
    sponsor_name: string | null,
    category: string | null,
    start_date: Date,
    end_date: Date,
    surface: Surface,
    tournament: Tournament,
    venue: Venue,
    year: numberId
    draw_type?: string
}

export interface EventDetails extends Event {
    currency: string,
    pm: number | null,
    tfc: number | null,
    supervisors: stringId[],
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
    r128_pts: number | null
}

interface Score {
    aces: number | null,
    avg_sv1_kph: number | null,
    avg_sv2_kph: number | null,
    bp_opps: number | null,
    bps_converted: number | null,
    bps_faced: number | null,
    bps_saved: number | null,
    dfs: number | null,
    incomplete: string | null,
    max_speed_kph: number | null,
    net: number | null,
    net_w: number | null,
    ret1: number | null,
    ret1_w: number | null,
    ret2: number | null,
    ret2_w: number | null,
    s1: number | null,
    s2: number | null,
    s3: number | null,
    s4: number | null,
    s5: number | null,
    serve1_pts: number | null,
    serve1_pts_w: number | null,
    serve2_pts: number | null,
    serve2_pts_w: number | null,
    t1: number | null,
    t2: number | null,
    t3: number | null,
    t4: number | null,
    t5: number | null,
    ues: number | null,
    winners: number | null,
    player: Player
}

interface MatchStatEvent extends Event {
    playersConnection: {
        edges: ActivityEntry[]
      }
}

export interface MatchStats {
    court: string | null,
    date: Date | null,
    duration_mins: number | null,
    incomplete: string | null,
    round: string,
    umpire: stringId | null,
    event: MatchStatEvent,
    winner: {
        player: stringId
    },
    p1: Score,
    p2: Score
}

export interface Player {
    id: string,
    first_name: string,
    last_name: string,
    full_name: string,
    country?: Country
}

export interface PlayerLayout extends Player {
    career_high: number | null,
    ch_date: Date | null,
    pm_USD: number,
    titles: number,
    win: number,
    loss: number,
    gladiator: boolean,
    countryConnection: {
        edges: {
            node: Country,
            properties: {
                start_date: Date | null,
                end_date: Date | null
            }
        }[]
    },
    prev_countriesConnection: {
        edges: {
            node: Country,
            properties: {
                start_date: Date,
                end_date: Date
            }
        }[]
    }
}

interface Major {
    event: {
        id: number,
        year: numberId
    }
}

interface MajorAgg {
    node: {
        round: {
            longest: string | null
        }
    },
    count: number
}

export interface PlayerDetails {
    country: Country,
    turned_pro: numberId,
    retired: numberId | null,
    dob: Date | null,
    rh: boolean | null,
    bh1: boolean | null,
    height_cm: number | null
    coaches: {
        id: string,
        first_name: string | null,
        last_name: string | null,
        full_name: string
    }[],
    ao: Major[],
    aoAgg: MajorAgg,
    rg: Major[],
    rgAgg: MajorAgg,
    wimbledon: Major[],
    wimbledonAgg: MajorAgg,
    uso: Major[],
    usoAgg: MajorAgg,
    finals: Major[],
    finalsAgg: MajorAgg,
    davis: Major[],
    davisAgg: MajorAgg,
    olympics: Major[],
    olympicsAgg: MajorAgg,
    hopman: Major[],
    hopmanAgg: MajorAgg
}

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
    incomplete: string | null,
    match_no: number,
    round: string,
    pScore: {
        s1: number,
        s2: number,
        s3: number,
        s4: number,
        s5: number,
        t1: number,
        t2: number,
        t3: number,
        t4: number,
        t5: number,
        incomplete: string | null
    }[],
    oppScore: {
        s1: number,
        s2: number,
        s3: number,
        s4: number,
        s5: number,
        t1: number,
        t2: number,
        t3: number,
        t4: number,
        t5: number,
        incomplete: string | null,
        player: Player
    }[],
    winner: {
        player: stringId
    }
}

export interface ActivityEntry {
    node: stringId,
    properties: EntryInfo
}

export interface Activity {
    properties: EntryInfo,
    node: {
        category: string | null,
        currency: string,
        end_date: Date,
        id: number,
        sponsor_name: string | null,
        start_date: Date,
        surface: Surface,
        tournament: Tournament,
        matches: ActivityMatch[],
        venue: Venue,
        playersConnection: {
            edges: ActivityEntry[]
        }
    }
}