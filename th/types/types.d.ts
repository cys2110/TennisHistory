declare global {
  type CurrencyType = "USD" | "EUR" | "GBP" | "AUD" | "FRF"

  type DrawType =
    | "Round of 128"
    | "Round of 64"
    | "Round of 32"
    | "Round of 16"
    | "Round robin"
    | "Laver Cup"
    | "Country draw"

  type IncompleteType = "B" | "R" | "Def" | "WO"

  type RoundType =
    | "Round of 128"
    | "Round of 64"
    | "Round of 32"
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

  type StatusType = "Q" | "WC" | "LL" | "AL" | "SE" | "PR"

  // Consolidated types

  type APIStatusType = "success" | "pending" | "idle" | "error"

  type BreadcrumbType = {
    label: string
    to?: { name: string }
    icon?: string
  }

  type CoachesAPIResponseType = {
    count: number
    coaches: (Pick<CoachType, "id" | "name" | "country"> & { labels: string[] })[]
  }

  type CoachType = Pick<PlayerInterface, "id" | "name"> &
    Partial<Omit<PlayerInterface, "id" | "name">>

  type CountryEntryType = Pick<EntryInterface, "id" | "name" | "last" | "country" | "rank">

  type CountryEventType = Pick<EventInterface, "id" | "year" | "c1" | "c2" | "score">

  type DrawMatchType = Pick<
    MatchInterface,
    "round" | "match_no" | "incomplete" | "winner_id" | "p1" | "p2"
  >

  type EntryInfoType = {
    label: string
    content: Pick<EntryInterface, "id" | "name" | "country" | "status" | "reason" | "rank">[]
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
    | "draw_type"
    | "tournament"
  >

  type H2HPlayerInterface = Pick<
    PlayerInterface,
    "wins" | "losses" | "pm" | "rh" | "bh" | "turned_pro" | "titles" | "dob" | "height" | "ch"
  >

  type MajorResultsType = {
    tournament: Pick<TournamentInterface, "id" | "name">
    round: RoundType
    events: Pick<EventInterface, "id" | "year">[]
  }

  type MatchDetailsType = Pick<EventInterface, "surface" | "dates"> & {
    match: Pick<
      MatchInterface,
      | "date"
      | "court"
      | "umpire"
      | "duration"
      | "winner_id"
      | "round"
      | "p1"
      | "p2"
      | "aces"
      | "dfs"
      | "serve1"
      | "serve2"
      | "bps_saved"
      | "ret1"
      | "ret2"
      | "max_speed"
      | "avg1_speed"
      | "avg2_speed"
      | "bps_converted"
      | "winners"
      | "ues"
      | "net"
    >
  }

  type PlayerActivityType = Pick<
    EventInterface,
    | "tournament"
    | "id"
    | "name"
    | "dates"
    | "category"
    | "venues"
    | "surface"
    | "currency"
    | "draw_type"
  > & {
    player: Pick<EntryInterface, "seed" | "status" | "rank" | "points" | "pm">
    matches: (Pick<
      MatchInterface,
      "round" | "match_no" | "incomplete" | "winner_id" | "sets" | "tbs"
    > & {
      opponent: Pick<
        EntryInterface,
        "id" | "name" | "country" | "incomplete" | "seed" | "status" | "rank"
      >
    })[]
  }

  type PlayerDetailsType = Pick<
    PlayerInterface,
    | "ch"
    | "ch_date"
    | "wins"
    | "losses"
    | "titles"
    | "pm"
    | "rh"
    | "bh"
    | "height"
    | "dob"
    | "hof"
    | "dod"
    | "turned_pro"
    | "retired"
    | "coaches"
    | "countries"
    | "age"
  >

  type PlayerStatsType = {
    category: CategoryEnum
    value: number
    suffix?: boolean
  }

  type SeedType = Pick<
    EntryInterface,
    "id" | "name" | "country" | "last" | "seed" | "rank" | "rank2" | "withdrew"
  >

  type SupervisorsAPIResponseType = {
    count: number
    supervisors: {
      id: string
      last_name: string
    }[]
  }

  type SurfacesAPIResponseType = {
    count: number
    surfaces: SurfaceInterface[]
  }

  type UmpireDetailsType = Pick<EventInterface, "id" | "tournament" | "draw_type" | "year"> & {
    rounds: {
      round: RoundType
      matches: {
        match_no: string
        p1: Pick<PlayerInterface, "id" | "name" | "country">
        p2: Pick<PlayerInterface, "id" | "name" | "country">
      }[]
    }[]
  }
}

export {}
