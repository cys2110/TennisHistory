declare global {
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

  type SelectType = "all-years" | "month" | "tour" | "category" | "surface" | "year"

  type SortType = "ASC" | "DESC" | undefined

  type StatusType = "Q" | "WC" | "LL" | "AL" | "SE" | "PR"

  type SurfaceType = "Hard" | "Clay" | "Grass" | "Carpet"

  type TourType = "ATP" | "WTA" | "ITF (M)" | "ITF (W)" | "Men" | "Women"

  type ActivityStatsType = {
    category: string
    tour: number
    challenger: number
    itf: number
  }

  type ActivityType = {
    stats: ActivityStatsType[]
    activity: ActivityEventInterface[]
  }

  type EntryInfoType = {
    label: string
    teams: EntryInterface[]
  }

  type ConsolidatedEntryType = {
    type: string[]
    tour: TourType
    singles_seed?: number
    singles_q_seed?: number
    doubles_seed?: number
    doubles_q_seed?: number
    singles_status?: StatusType
    doubles_status?: StatusType
    singles_q_status?: StatusType
    doubles_q_status?: StatusType
    singles_withdrawn?: boolean
    doubles_withdrawn?: boolean
    seed?: number
    players: (Pick<PlayerInterface, "first_name" | "last_name" | "country" | "id"> & { singles_rank?: number; doubles_rank?: number })[]
  }

  type MatchDetailsType = {
    start_date: DateType
    end_date: DateType
    surface: SurfaceInterface
    tournament: string
    match: MatchInterface
  }

  type MatchStatsType = {
    label: string
    p1: string
    p1_pc: number
    p2: string
    p2_pc: number
    category: string
  }

  type PlayersAPIType = {
    count: number
    players: PlayerInterface[]
  }

  type PlayerStatsType = {
    category: string
    value: number
    suffix?: boolean
  }

  type RecordType = {
    tid: number
    resultsPerTid: RecordInterface[]
  }

  type RecordAPIType = {
    singles: RecordType[]
    doubles: RecordType[]
  }

  type TournamentsAPIType = {
    count: number
    tournaments: TournamentInterface[]
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
    type: "Singles" | "Doubles" | "Country"
  }

  interface UmpireAPIType extends EventInterface {
    rounds: {
      round: RoundType
      matches: MatchInterface[]
    }[]
  }

  type UmpireMatchType = Pick<EventInterface, "id" | "tournament" | "year" | "tours"> & { round: RoundType } & Pick<
      MatchInterface,
      "match_no" | "p1" | "p2" | "labels" | "stats"
    >
}

export {}
