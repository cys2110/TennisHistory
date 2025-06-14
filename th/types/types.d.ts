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

  type EnvironmentType = "Indoor" | "Outdoor"
  type SurfaceType = "Clay" | "Grass" | "Hard" | "Carpet"

  type TourType = "ATP" | "WTA" | "ITF" | "ITF - Men's" | "ITF - Women's" | "Men" | "Women"

  // Base types

  type PlayerType = Pick<PlayerInterface, "id" | "name" | "country" | "tour">

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

  type APICoachesResponseType = {
    count: number
    coaches: {
      id: string
      name: string
    }[]
  }

  type APICountriesResponseType = {
    count: number
    countries: CountryInterface[]
  }

  type APIPlayersResponseType = {
    count: number
    players: Pick<PlayerInterface, "id" | "name" | "min_year" | "max_year" | "tour" | "country">[]
  }

  type APISupervisorResponseType = {
    labels: string[]
    events: EventCardType[]
  }

  type APISupervisorsResponseType = {
    count: number
    supervisors: {
      id: string
      name: string
    }[]
  }

  type APITournamentsResponseType = {
    count: number
    tournaments: Pick<TournamentInterface, "id" | "name" | "established" | "abolished" | "tours">[]
  }

  type APIUmpireEventType = Pick<
    EventInterface,
    "id" | "tournament" | "year" | "surface" | "category" | "venues" | "dates" | "tours" | "atp_dates" | "wta_dates" | "atp_category" | "wta_category"
  > & {
    rounds: {
      round: RoundType
      matches: Pick<MatchInterface, "match_no" | "p1" | "p2" | "date" | "type">[]
    }[]
  }

  type APIUmpireResponseType = {
    labels: string[]
    events: EventType[]
  }

  type APIUmpiresResponseType = {
    count: number
    umpires: {
      id: string
      name: string
    }[]
  }

  type APIVenueResponseType = {
    name: string | null
    city: string
    events: EventCardType[]
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
