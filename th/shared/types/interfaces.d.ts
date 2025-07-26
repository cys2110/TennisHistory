declare global {
  interface ActivityEventInterface extends EventInterface {
    player: AllEntriesInterface
    matches: MatchInterface[]
    partner?: PlayerInterface
  }

  interface CountryInterface {
    id: string
    name: string
    alpha2?: string
    start_date?: DateType
    end_date?: DateType
  }

  interface AllEntriesInterface extends PlayerInterface {
    draw: DrawType
    type: MatchType
    team_mate?: string
    withdrawn: boolean
    points?: number
    rank?: number
    seed?: number
    status?: StatusType
    q_seed?: number
    q_status?: StatusType
  }

  interface EntryInterface {
    type: MatchType
    tour: TourType
    draw: DrawType
    status?: StatusType
    team_reason?: string
    rank?: number
    players: (PlayerInterface & { reason?: string })[]
  }

  interface EventInterface {
    atp_category?: CategoryType
    atp_currency?: CurrencyType
    atp_draw_d?: RoundType
    atp_draw_s?: RoundType
    atp_end_date?: DateType
    atp_link?: string
    atp_pm?: number
    atp_start_date?: DateType
    atp_tfc?: string
    category?: CategoryType
    currency?: CurrencyType
    draw_type?: DrawType
    end_date?: DateType
    id: number
    level: "Tour" | "Challenger" | "ITF"
    men_category?: CategoryType
    men_currency?: CurrencyType
    men_draw_d?: RoundType
    men_draw_s?: RoundType
    men_end_date?: DateType
    men_link?: string
    men_pm?: number
    men_start_date?: DateType
    men_tfc?: string
    pm?: number
    sponsor_name?: string
    start_date?: DateType
    supervisors?: string[]
    surface?: SurfaceInterface
    tfc?: number
    tournament: TournamentInterface
    tours: TourType[]
    venues: VenueInterface[]
    wiki_link?: string
    women_category?: CategoryType
    women_currency?: CurrencyType
    women_draw_d?: RoundType
    women_draw_s?: RoundType
    women_end_date?: DateType
    women_link?: string
    women_pm?: number
    women_start_date?: DateType
    women_tfc?: string
    wta_category?: CategoryType
    wta_currency?: CurrencyType
    wta_draw_d?: RoundType
    wta_draw_s?: RoundType
    wta_end_date?: DateType
    wta_link?: string
    wta_pm?: number
    wta_start_date?: DateType
    wta_tfc?: string
    year: number
  }

  interface MatchInterface {
    aces: number[]
    avg1_speed: number[]
    avg2_speed: number[]
    bps_converted: number[]
    bps_saved: number[]
    chart_link?: string
    court?: string
    date?: DateType
    dfs: number[]
    duration: DurationType
    first_serve: number[]
    labels: string[]
    id: string
    incomplete?: IncompleteType | null
    match_no: number
    max_speed: number[]
    net: number[]
    opponent: PlayerInterface
    opponents: PlayerInterface[]
    p1: PlayerInterface[]
    p1_winner: boolean
    p2: PlayerInterface[]
    player_incomplete: IncompleteType[]
    ret1: number[]
    ret2: number[]
    ret_w: number[]
    return_games: number[]
    round: RoundType
    serve1: number[]
    serve2: number[]
    sets: number[][][]
    serve_games: number[]
    serve_w: number[]
    stats?: boolean
    total_points: number[]
    ues: number[]
    umpire?: string
    winner_id: string
    winners: number[]
  }

  interface PersonInterface {
    id: string
    first_name: string
    last_name: string
    start_date?: DateType
    end_date?: DateType
    years: string[]
    labels: string[]
  }

  interface PlayerInterface {
    age?: number
    atp_link?: string
    bh?: "One" | "Two"
    ch_singles?: number
    ch_doubles?: number
    coach: boolean
    coaches?: PersonInterface[]
    countries: CountryInterface[]
    country: CountryInterface
    current_doubles?: number
    current_singles?: number
    dob?: DateType
    dod?: DateType
    doubles_ch_date?: DateType
    first_name: string
    former_coaches?: PersonInterface[]
    height?: number
    hof?: number
    id: string
    last_name: string
    max_year?: number
    min_year?: number
    official_link?: string
    pm?: number
    q_seed?: number
    q_status?: StatusType
    rank?: number
    retired?: number
    rh?: boolean
    seed?: number
    singles_ch_date?: DateType
    status?: StatusType
    tour: TourType
    turned_pro?: number
    wiki_link?: string
    wta_link?: string
    years: number[]

    // WL
    wl?: {
      total: number
      label: string
    }[]

    // h2h
    h2h?: {
      opponent: PlayerInterface
      matches: number
      wins: number
    }[]

    // titles
    first_singles?: Pick<EventInterface, "year" | "id" | "tournament">
    last_singles?: Pick<EventInterface, "year" | "id" | "tournament">
    first_doubles?: Pick<EventInterface, "year" | "id" | "tournament">
    last_doubles?: Pick<EventInterface, "year" | "id" | "tournament">
  }

  interface RecordInterface {
    id: number
    tournament: TournamentInterface
    year: number
    round: RoundType
    number: number
  }

  interface RoundInterface {
    currency?: CurrencyType
    labels: (TourType | DrawType | MatchType)[]
    pm?: number
    points?: number
    round: RoundType
    number: number
  }

  interface SeedInterface {
    team: PlayerInterface[]
    seed: number
    rank2?: number
    draw: DrawType
    withdrew: boolean
    tour: TourType
    type: MatchType
  }

  interface SurfaceInterface {
    id: string
    environment: EnvironmentType
    surface: SurfaceType
  }

  interface TitlesAndFinalsInterface extends Omit<EventInterface, "surface"> {
    partner?: PlayerInterface
    type: MatchType
    titles: "Titles" | "Finals"
    level: "Tour" | "Challenger" | "ITF"
    surface: string
  }

  interface TournamentInterface {
    abolished?: number
    established?: number
    id: number
    name: string
    tours: TourType[]
    website?: string
  }

  interface VenueInterface {
    id: string
    name: string
    city: string
    country: CountryInterface
  }

  interface WLIndexInterface {
    category: string
    stat: string
    draw: DrawType
    level: "Tour" | "Challenger" | "ITF"
    wins: number
    losses: number
    titles?: number
    value: number
    ytd_wins: number
    ytd_losses: number
    ytd_titles?: number
    ytd_value: number
  }
}

export {}
