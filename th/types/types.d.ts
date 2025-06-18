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

  type CoachType = Pick<PlayerInterface, "id" | "name" | "last_name"> & Partial<Omit<PlayerInterface, "id" | "name">>

  interface CountryBigTitlesAPIResponseType
    extends Pick<PlayerInterface, "id" | "name" | "country" | "tour" | "last_name" | "max_year" | "min_year"> {
    gs: Pick<EventInterface, "id" | "year" | "category" | "tournament" | "atp_category" | "wta_category" | "tours">[]
    a1000: Pick<EventInterface, "id" | "year" | "category" | "tournament" | "atp_category" | "wta_category" | "tours">[]
    olympics: Pick<EventInterface, "id" | "year" | "category" | "tournament" | "atp_category" | "wta_category" | "tours">[]
    finals: Pick<EventInterface, "id" | "year" | "category" | "tournament" | "atp_category" | "wta_category" | "tours">[]
  }

  type CountryNumberOneAPIResponseType = {
    singles_players: Pick<
      PlayerInterface,
      "id" | "name" | "country" | "singles_ch_date" | "doubles_ch_date" | "tour" | "min_year" | "max_year" | "last_name"
    >[]
    doubles_players: Pick<
      PlayerInterface,
      "id" | "name" | "country" | "doubles_ch_date" | "doubles_ch_date" | "tour" | "min_year" | "max_year" | "last_name"
    >[]
  }

  type DetailsCardType = {
    title: string
    value?: any
    description?: string | null
    singles?: string | number
    doubles?: string | number
    singles_description?: string
    doubles_description?: string
  }

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

  type PlayerActivityType = Pick<
    EventInterface,
    | "tours"
    | "tournament"
    | "id"
    | "name"
    | "dates"
    | "atp_category"
    | "wta_category"
    | "atp_dates"
    | "wta_dates"
    | "category"
    | "venues"
    | "surface"
    | "currency"
  > & {
    player: Pick<EntryInterface, "seed" | "status" | "rank" | "points" | "pm" | "q_seed" | "q_status">
    partner: Pick<EntryInterface, "id" | "name" | "country" | "rank">
    matches: (Pick<MatchInterface, "round" | "match_no" | "incomplete" | "winner_id" | "sets" | "tbs"> & {
      opponent: Pick<EntryInterface, "id" | "name" | "country" | "incomplete" | "seed" | "status" | "rank" | "q_seed" | "q_status">
      opponents: Pick<EntryInterface, "id" | "name" | "country" | "incomplete" | "seed" | "status" | "rank" | "q_seed" | "q_status">[]
    })[]
  }

  type PlayerDetailsType = Omit<
    PlayerInterface,
    "first_name" | "last_name" | "tour" | "country" | "official_link" | "atp_link" | "wta_link" | "wiki_link"
  >

  type PlayerRecordType = {
    tournament: Omit<TournamentType, "tours">
    round: RoundType
    id: number
    year: number
  }

  type PlayerStatsType = {
    category: CategoryType
    value: number
    suffix?: boolean
  }

  type TournamentWinnerPlayerType = Pick<PlayerInterface, "id" | "name" | "country">

  type TournamentWinnerType = Pick<EventInterface, "id" | "year" | "tours"> &
    Record<
      "md" | "ld",
      | {
          winner: TournamentWinnerPlayerType[]
          loser: TournamentWinnerPlayerType[]
          sets: MatchInterface["sets"]
          tbs: MatchInterface["tbs"]
          incomplete: IncompleteType | null
        }
      | string
      | null
    > &
    Record<
      "ms" | "ls",
      | {
          winner: TournamentWinnerPlayerType
          loser: TournamentWinnerPlayerType
          sets: MatchInterface["sets"]
          tbs: MatchInterface["tbs"]
          incomplete: IncompleteType | null
        }
      | string
      | null
    > & {
      country: {
        c1: CountryInterface
        c2: CountryInterface
        score: string
      }
    }

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

  type APIPlayerActivityResponseType = {
    stats: PlayerStatsType[]
    activity: PlayerActivityType[]
  }

  type APIPlayerRecordType = {
    singles: Record<string, PlayerRecordType[]>
    doubles: Record<string, PlayerRecordType[]>
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
