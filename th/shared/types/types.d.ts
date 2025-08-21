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

  type LevelType = "Challenger" | "Tour"

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

  // Base interfaces
  interface CountryInterface {
    id: string
    name: string
    alpha2?: string
  }

  interface EntryInterface extends PlayerInterface {
    doubles_rank?: number
    draw: DrawType
    eid: number
    players: PlayerInterface[]
    points?: number
    q_seed?: number
    q_status?: StatusType
    rank?: number
    reason?: string
    seed?: number
    singles_rank?: number
    status?: StatusType
    team_mate?: string
    type: MatchType
    withdrawn: boolean
    year: number
  }

  interface EventInterface {
    atp_category: CategoryType
    atp_currency?: CurrencyType
    atp_draw_d: RoundType
    atp_draw_s: RoundType
    atp_end_date: DateType
    atp_link?: string
    atp_pm?: number
    atp_start_date: DateType
    atp_tfc?: number
    category: CategoryType
    currency?: CurrencyType
    draw_type: RoundType
    end_date: DateType
    id: number
    men_category: CategoryType
    men_currency?: CurrencyType
    men_draw_d: RoundType
    men_draw_s: RoundType
    men_end_date: DateType
    men_link?: string
    men_pm?: number
    men_start_date: DateType
    sponsor_name?: string
    start_date: DateType
    supervisors: Pick<PlayerInterface, "id" | "first_name" | "last_name">[]
    surface: SurfaceInterface
    tfc?: number
    tournament: TournamentInterface
    tours: TourType[]
    venues: VenueInterface[]
    wiki_link?: string
    women_category: CategoryType
    women_currency?: CurrencyType
    women_draw_d: RoundType
    women_draw_s: RoundType
    women_end_date: DateType
    women_link?: string
    women_pm?: number
    women_start_date: DateType
    wta_category: CategoryType
    wta_currency?: CurrencyType
    wta_draw_d: RoundType
    wta_draw_s: RoundType
    wta_end_date: DateType
    wta_link?: string
    wta_start_date: DateType
    wta_tfc?: number
    year: number
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

  interface MatchInterface {
    chart_link?: string
    court?: string
    date?: DateType
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
    winners: {
      players: EntryInterface[]
      sets: [number, number][]
    }
  }

  interface PersonInterface extends Pick<PlayerInterface, "id" | "first_name" | "last_name"> {
    labels: string[]
    years: number[]
  }

  interface PlayerInterface {
    country: CountryInterface
    first_name: string
    id: string
    max_year?: number
    min_year?: number
    last_name: string
    tour: TourType
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

  interface SurfaceInterface {
    id: string
    surface: SurfaceType
    environment: EnvironmentType
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
    name?: string
    city: string
    country: CountryInterface
  }

  // API types

  interface ConsolidatedEntryType {
    tour: TourType
    first_name: string
    last_name: string
    country: CountryInterface
    id: string
    singles: {
      draw: DrawType[]
      seed?: number
      rank?: number
      status?: StatusType
      q_seed?: number
      q_status?: StatusType
      withdrawn: boolean
    }
    doubles: {
      draw: DrawType[]
      seed?: number
      rank?: number
      status?: StatusType
      q_seed?: number
      q_status?: StatusType
      withdrawn: boolean
    }
  }

  interface ConsolidatedEntryTeam {
    tour: TourType
    type: MatchType
    draw: DrawType[]
    seed?: number
    rank?: number
    q_seed?: number
    q_status?: StatusType
    status?: StatusType
    withdrawn: boolean
    players: EntryInterface[]
  }

  interface EntryInfoInterface {
    label: string
    tour: TourType
    type: MatchType
    status: StatusType
    team_reason?: string
    rank?: number
    draw: DrawType
    team: EntryInterface[]
  }

  interface SeedInterface {
    draw: DrawType
    rank2?: number
    seed: number
    withdrew?: boolean
    team: EntryInterface[]
    tour: TourType
    type: MatchType
  }

  type TournamentAgeType = {
    id: number
    year: number
    type: MatchType
    age: {
      months: number
      days: number
    } | null
    player: PlayerInterface
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
    player: PlayerInterface
  }

  interface TournamentLowestRankedType extends Omit<TournamentSeedType, "teams" | "year" | "id"> {
    rank: number
    players: (PlayerInterface & { year: number; eid: number })[]
  }

  interface TournamentFlattenedLowestRankedType extends Omit<TournamentSeedType, "teams"> {
    rank: number
    player: PlayerInterface
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

  interface TournamentScoreStatsType {
    type: MatchType
    tour: TourType
    year: number
    id: number
    sets_won: number
    sets_lost: number
    games_won: number
    games_lost: number
    team: PlayerInterface[]
  }

  interface TournamentSeedType {
    id: number
    year: number
    round: RoundType
    tour: TourType
    type: MatchType
    teams: {
      seed: number
      players: PlayerInterface[]
    }[]
  }

  type TournamentWinnerFlattenedType = {
    id: number
    year: number
    labels?: string[]
    tour?: TourType
    winner: PlayerInterface[] | CountryInterface
    loser: PlayerInterface[] | CountryInterface
    sets?: number[][][]
    incomplete?: IncompleteType
    stats?: boolean
    score?: string
    type: MatchType | "Country"
  }

  type TournamentWinnerResultsType = {
    labels: string[]
    tour: TourType
    winner: PlayerInterface | PlayerInterface[] | string
    loser: PlayerInterface | PlayerInterface[]
    sets: number[][][]
    incomplete: IncompleteType
    stats: boolean
  }

  type TournamentCountryWinnerType = {
    c1: CountryInterface
    c2: CountryInterface
    score: string
  }

  type TournamentWinnerEventType = {
    id: number
    tours: TourType[]
    year: number
    singles: TournamentWinnerResultsType[]
    doubles: TournamentWinnerResultsType[]
    country: TournamentCountryWinnerType
  }
}

export {}
