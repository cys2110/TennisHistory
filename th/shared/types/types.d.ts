declare global {
  // Base types
  type APIStatusType = "success" | "pending" | "idle" | "error"

  type CategoryType =
    | "ATP 250"
    | "ATP 500"
    | "ATP Masters 1000"
    | "Grand Slam"
    | "ATP Finals"
    | "Next Gen ATP Finals"
    | "World Team Cup"
    | "Grand Slam Cup"
    | "Laver Cup"
    | "United Cup"
    | "Davis Cup"
    | "Billie Jean King Cup"
    | "Olympics"
    | "ATP Cup"
    | "ATP International Series"
    | "ATP International Series Gold"
    | "ATP Masters Series"
    | "ATP World Series"
    | "ATP Championship Series"
    | "ATP Championship Series, Single Week"
    | "ATP Super 9"
    | "ITF"
    | "ILTF"
    | "NTL"
    | "Grand Prix"
    | "WTA 1000"
    | "WTA 500"
    | "WTA 250"
    | "WTA Finals"
    | "WTA Elite Trophy"
    | "WTA Premier Mandatory"
    | "WTA Premier Five"
    | "WTA Premier"
    | "WTA International Tournaments"
    | "ITF M25"
    | "ITF W75"
    | "ATP Challenger 175"
    | "ATP Challenger 125"
    | "WTA 125"
    | "ATP Challenger 75"
    | "ATP Challenger 100"
    | "ATP Challenger 50"
    | "ITF W100"
    | "ITF W15"

  type CurrencyType = "USD" | "EUR" | "GBP" | "AUD" | "FRF"

  type DateType = {
    year: number
    month: number
    day: number
  }

  type DrawType = "Main" | "Qualifying"

  type DurationType = {
    hours: number
    minutes: number
    seconds: number
  }

  type EnvironmentType = "Indoor" | "Outdoor"

  type IncompleteType = "B" | "R" | "Def" | "WO"

  type LevelType = "Challenger" | "Tour" | "ITF"

  type MatchType = "Singles" | "Doubles"

  type MonthType = "January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December"

  type RoundType =
    | "Round of 128"
    | "Round of 64"
    | "Round of 32"
    | "Round of 24"
    | "Round of 16"
    | "Quarterfinals"
    | "Semifinals"
    | "Final"
    | "Win"
    | "Round robin"
    | "Group stages"
    | "Day 1"
    | "Day 2"
    | "Day 3"
    | "Qualifier"
    | "Qualifying round 1"
    | "Qualifying round 2"
    | "Qualifying round 3"

  type SortType = "ASC" | "DESC" | undefined

  type StatusType = "Q" | "WC" | "LL" | "AL" | "SE" | "PR"

  type SurfaceType = "Clay" | "Grass" | "Hard" | "Carpet"

  type TourType = "ATP" | "WTA" | "Women" | "Men" | "ITF (M)" | "ITF (W)"

  // Schemas
  interface CountryInterface {
    alpha2?: string
    id: string
    name: string
    start_date?: DateType
    end_date?: DateType
  }

  interface DrawInterface {
    rounds: DrawRoundInterface[]
    matches?: DrawMatchInterface[]
    contestants?: {
      [contestantId: string]: DrawContestantInterface
    }
  }

  interface DrawRoundInterface {
    name?: string
  }

  interface DrawMatchInterface {
    roundIndex: number
    order: number
    sides?: DrawSideInterface[]
    matchStatus?: string
    isBronzeMatch?: boolean
  }

  interface DrawContestantInterface {
    entryStatus?: string
    players?: DrawPlayerInterface[]
  }

  interface DrawSideInterface {
    title?: string
    contestantId?: string
    scores?: DrawScoreInterface[]
    isWinner?: boolean
  }

  interface DrawScoreInterface {
    mainScore: number
    subscore?: number
    isWinner?: boolean
  }

  interface DrawPlayerInterface {
    title: string
    nationality: string
  }

  interface EntryInterface extends PersonInterface {
    draw: DrawType
    status: StatusType
    year: number
    eid: number
    type: MatchType
    tour: TourType
    players: (PersonInterface & { rank: number })[]
    pm: number
    seed?: number
    q_seed?: number
    q_status?: StatusType
    status?: StatusType
    rank?: number
  }

  interface EntryInfoInterface {
    label: string
    tour: TourType
    type: MatchType
    status?: StatusType
    team_reason?: string
    rank?: number
    draw: DrawType
    team: (PlayerInterface & { reason?: string })[]
  }

  interface EventInterface {
    atp_category: CategoryType
    atp_link?: string
    atp_sponsor_name?: string
    category: CategoryType
    categories: (CategoryType | undefined)[]
    currency: CurrencyType
    currencies: (CurrencyType | undefined)[]
    dates: (DateType | undefined)[][]
    draws: (string | null)[][]
    end_date: DateType
    id: number
    level: LevelType
    levels: LevelType[]
    men_link?: string
    pm: (number | undefined)[]
    sponsor_name?: string
    start_date: DateType
    supervisors: PersonInterface[]
    surface: SurfaceInterface
    tfc: (number | undefined)[]
    tournament: TournamentInterface
    tours: TourType[]
    venues: VenueInterface[]
    wiki_link?: string
    women_link?: string
    wta_category: CategoryType
    wta_link?: string
    wta_sponsor_name?: string
    year: number
  }

  interface MatchInterface {
    chart_link?: string
    court?: string
    date?: DateType
    draw: DrawType
    duration?: DurationType
    end_date: DateType
    id: string
    incomplete?: IncompleteType
    losers: {
      players: EntryInterface[]
      sets: [number, number][]
      incomplete?: IncompleteType
    }
    match_no: number
    match_stats: MatchStatsInterface[]
    opponents: EntryInterface[]
    p1: EntryInterface[]
    p1_incomplete?: IncompleteType
    p1_winner: boolean
    p2: EntryInterface[]
    p2_incomplete?: IncompleteType
    round: RoundType
    sets: [number, number][][]
    start_date: DateType
    stats: boolean
    surface: SurfaceInterface
    tour: TourType
    type: MatchType
    umpire?: string
    winner: PlayerInterface
    winner_id: string
    winners: {
      players: EntryInterface[]
      sets: [number, number][]
    }
  }

  interface MatchStatsInterface {
    label: string
    category: string
    low?: boolean
    percent?: boolean
    p1: string | number
    p2: string | number
    p1_pc: number
    p2_pc: number
  }

  interface PersonInterface {
    country: CountryInterface
    first_name: string
    id: string
    labels: string[]
    last_name: string
    tour: TourType
    years?: number[]
  }

  interface PlayerInterface extends PersonInterface {
    age?: number
    atp_link?: string
    bh?: "One" | "Two"
    ch_singles?: number
    ch_doubles?: number
    coach: boolean
    coaches?: CoachInterface[]
    countries: CountryInterface[]
    current_doubles?: number
    current_singles?: number
    dob?: DateType
    dod?: DateType
    doubles_ch_date?: DateType
    height?: number
    hof?: number
    losses: number
    min_year?: number
    max_year?: number
    official_link?: string
    pm: number
    retired?: number
    rh?: boolean
    singles_ch_date?: DateType
    turned_pro?: number
    wiki_link?: string
    wins: number
    wta_link?: string

    // WL
    wl?: WinLossType[]
    titles: {
      level: LevelType
      singles: number
      doubles: number
    }[]

    // h2h
    h2h?: {
      opponent: PlayerInterface
      matches: number
      wins: number
    }[]
  }

  interface RoundInterface {
    currency: CurrencyType
    id: string
    number: number
    pm: number
    points: number
    round: RoundType
    tour: TourType
    type: MatchType
  }

  interface SeedInterface {
    draw: DrawType
    rank: number
    seed: number
    withdrew?: boolean
    team: (PersonInterface & { rank: number })[]
    tour: TourType
    type: MatchType
  }

  interface SurfaceInterface {
    environment: EnvironmentType
    id: string
    surface: SurfaceType
  }

  interface TournamentInterface {
    abolished?: number
    established?: number
    id: number
    name: string
    tours?: TourType[]
    website?: string
  }

  interface VenueInterface {
    city: string
    country: CountryInterface
    id: string
    name?: string
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

  interface ActivityStatsInterface {
    category: string
    value: number
    type: MatchType
  }

  interface ActivityInterface extends EventInterface {
    partner: EntryInterface | null
    match: MatchInterface
    player: EntryInterface
    type: MatchType
  }

  type ActivityType = {
    activity: ActivityInterface[]
    stats: ActivityStatsInterface[]
  }

  interface RecordInterface extends EventInterface {
    singles: {
      round: RoundType
      number: number
    } | null
    doubles: {
      round: RoundType
      number: number
    } | null
  }

  type TournamentAgeType = {
    id: number
    year: number
    type: MatchType
    age: {
      months: number
      days: number
    } | null
    player: PersonInterface
  }

  type TournamentCountryType = {
    country: CountryInterface
    atp_singles_wins: number
    atp_doubles_wins: number
    wta_singles_wins: number
    wta_doubles_wins: number
    total_atp_singles_wins: number
    total_atp_doubles_wins: number
    total_wta_singles_wins: number
    total_wta_doubles_wins: number
  }

  type TournamentFinalistType = {
    finals: number
    singles_wins: number
    singles_losses: number
    doubles_wins: number
    doubles_losses: number
    player: PersonInterface
  }

  interface TournamentLowestRankedType {
    id: number
    year: number
    round: RoundType
    tour: TourType
    type: MatchType
    worstRank: number
    player: PersonInterface
  }

  type TournamentPmType = {
    id: number
    pm: number
    number: number
    round: RoundType
    year: number
    points: number
    type: MatchType
    tour: TourType
    currency: CurrencyType
  }

  interface TournamentSeedType {
    id: number
    year: number
    round: RoundType
    tour: TourType
    type: MatchType
    teams: {
      seed: number
      players: PersonInterface[]
    }[]
  }

  interface TournamentScoreStatsType {
    type: MatchType
    tour: TourType
    year: number
    id: number
    sets_won: number
    sets_lost: number
    games_won: number
    games_lost: number
    team: PersonInterface[]
  }

  type TournamentWinnerEventType = {
    id: number
    incomplete?: IncompleteType
    loser?: PersonInterface[] | CountryInterface
    score: string
    sets: number[][][]
    stats: boolean
    tour: TourType
    type: MatchType
    winner: PersonInterface[] | string | CountryInterface
    year: number
  }

  interface UmpireAPIType extends EventInterface {
    rounds: {
      round: RoundType
      matches: MatchInterface[]
    }[]
  }
}

export {}
