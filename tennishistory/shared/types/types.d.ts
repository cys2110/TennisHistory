declare global {
  // Base Types
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

  type LevelType = "Tour" | "Challenger" | "ITF"

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

  // Interfaces
  interface CountryInterface {
    id: string
    name: string
    alpha2?: string
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
    level: LevelType
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

  interface TournamentInterface {
    id: number
    name: string
    website?: string
  }
}

export {}
