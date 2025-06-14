declare global {
  type APIStatusType = "success" | "pending" | "idle" | "error"

  type BreadcrumbType = {
    label: string
    to?: { name: string }
    icon?: string
    avatar?: {
      src: string
      alt: string
    }
    slot?: string
  }

  type CategoryType =
    | "ATP 250"
    | "ATP 500"
    | "ATP Masters 1000"
    | "Grand Slam"
    | "ATP Finals"
    | "Next Gen Finals"
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
    | "ATP 125"
    | "WTA 125"

  type CurrencyType = "USD" | "EUR" | "GBP" | "AUD" | "FRF"

  type IncompleteType = "B" | "R" | "Def" | "WO"

  type MonthType = "January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December"

  type SortType = "ASC" | "DESC" | undefined

  type StatusType = "Q" | "WC" | "LL" | "AL" | "SE" | "PR"

  type EnvironmentType = "Indoor" | "Outdoor"
  type SurfaceType = "Clay" | "Grass" | "Hard" | "Carpet"

  type TourType = "ATP" | "WTA" | "ITF" | "ITF - Men's" | "ITF - Women's" | "Men" | "Women"

  // Base types

  type TournamentType = Pick<TournamentInterface, "id" | "name" | "tours">

  // Consolidated types

  type EventCardType = Pick<
    EventInterface,
    | "year"
    | "surface"
    | "id"
    | "name"
    | "category"
    | "venues"
    | "start_date"
    | "dates"
    | "tournament"
    | "tours"
    | "atp_category"
    | "wta_category"
    | "atp_dates"
    | "wta_dates"
  >

  // API Response Types

  type APIPlayersResponseType = {
    count: number
    players: Pick<PlayerInterface, "id" | "name" | "min_year" | "max_year" | "tour" | "country">[]
  }

  type APITournamentsResponseType = {
    count: number
    tournaments: Pick<TournamentInterface, "id" | "name" | "established" | "abolished" | "tours">[]
  }

  type APIUmpiresResponseType = {
    count: number
    umpires: {
      id: string
      name: string
    }[]
  }

  type APIVenuesResponseType = {
    count: number
    countries: {
      country: CountryInterface
      cities: {
        city: string
        venues: Pick<VenueInterface, "id" | "name">[]
      }[]
    }[]
  }
}

export {}
