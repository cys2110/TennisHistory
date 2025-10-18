declare global {
  type APIStatusType = "idle" | "pending" | "success" | "error"

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

  type EnvironmentType = "Indoor" | "Outdoor"

  type LevelType = "Challenger" | "Tour" | "ITF"

  type SurfaceType = "Clay" | "Grass" | "Hard" | "Carpet"

  type EventFiltersType = {
    tournaments: SelectOptionsType[]
    levels: LevelType[]
    categories: CategoryType[]
    surfaces: SurfaceType[]
    environment: EnvironmentType | undefined
    venues: SelectOptionsType[]
    supervisors: SelectOptionsType[]
    umpires: SelectOptionsType[]
    countries: SelectOptionsType[]
    dateRange: { start: CalendarDate | undefined; end: CalendarDate | undefined }
    tours: TourEnum[]
    year: number | undefined
  }

  type PlayerFiltersType = {
    players: SelectOptionsType[]
    tour: TourEnum | undefined
    countries: SelectOptionsType[]
    minYear: number | undefined
    maxYear: number | undefined
    status: string | undefined
    coaches: SelectOptionsType[]
  }

  type TournamentFiltersType = {
    tours: TourEnum[]
    tournaments: SelectOptionsType[]
    established: number | undefined
    abolished: number | undefined
  }

  type SelectOptionsType = { id: string; label: string }

  type SortType = "ASC" | "DESC" | undefined

  interface CountryInterface {
    id: string
    name: string
    alpha2?: string
  }

  interface EventInterface {
    categories: CategoryType[]
    countries: CountryInterface[]
    currencies: CurrencyType[]
    dates: string[][]
    draws: string[][]
    id: number
    levels: LevelType[]
    links: string[]
    pm: number[]
    sponsor_names: string[]
    supervisors: PersonInterface[]
    surface: SurfaceInterface
    tfc: number[]
    tournament: TournamentInterface
    tours: (keyof typeof TourEnum)[]
    umpires: PersonInterface[]
    venues: VenueInterface[]
    year: number
  }

  interface FormFieldInterface<S> {
    label: string
    key: keyof S
    type: string
    subType?: string
    items?: any[]
    required?: boolean
    colSpan?: number
    size?: "sm" | "md" | "xs"
  }

  interface PersonInterface {
    end_date: string
    first_name: string
    id: string
    labels: string[]
    last_name: string
    start_date: string
  }

  interface PlayerInterface extends PersonInterface {
    coaches: PersonInterface[]
    country: CountryInterface
    min_year: number
    max_year: number
    tour: TourEnum
  }

  interface SurfaceInterface {
    environment: EnvironmentType
    id: string
    surface: SurfaceType
  }

  interface TournamentInterface {
    abolished: number
    established: number
    id: number
    name: string
    tours: (keyof typeof TourEnum)[]
    update: boolean
    website: string
  }

  interface VenueInterface {
    city: string
    country: CountryInterface
    id: string
    name?: string
  }
}

export {}
