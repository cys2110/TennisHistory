declare global {
  type CurrencyType = "AUD" | "EUR" | "GBP" | "USD"

  type DrawType = "Round of 128" | "Round of 64" | "Round of 32" | "Round robin" | "Country draw" | "Laver Cup" | null

  type IncompleteType = "B" | "R" | "Def" | "WO"

  type StatusType = "Q" | "WC" | "SE" | "PR" | "LL" | "AL"

  type RoundType = "Win" | "Final" | "Semifinals" | "Quarterfinals" | "Round of 16" | "Round of 32" | "Round of 64" | "Round of 128"

  type ArchiveEventType = Pick<EventInterface, "category" | "dates" | "draw_type" | "eid" | "ename" | "locations" | "name" | "start" | "surface" | "tid" | "year">

  type TournamentEventType = Pick<EventInterface, "eid" | "year" | "winner" | "loser" | "sets" | "tbs" | "incomplete" | "draw_type">

  type TournamentNumbers = Pick<EventInterface, "year", "ename" | "surface" | "currency" | "venue" | "category" | "rounds">

  type CountryEventType = Pick<EventInterface, "eid" | "year" | "c1" | "c2" | "score">

  type EventDetailsType = Pick<EventInterface, "name" | "ename" | "category" | "surface" | "venues" | "dates" | "tfc" | "pm" | "currency" | "supervisors">

  type SeedType = Pick<EntryInterface, "id" | "name" | "country" | "last" | "seed" | "rank" | "rank2" | "withdrew">

  type EntryInfoType = {
    label: string
    content: Pick<EntryInterface, "id" | "name" | "country" | "status" | "reason" | "rank">[]
  }

  type EntryTableType = Pick<EntryInterface, "id" | "name" | "country" | "last" | "rank" | "seed" | "status" | "withdrew">

  type PlayerDetailsType = Pick<PlayerInterface, "ch" | "ch_date" | "wl" | "titles" | "pm" | "coaches" | "rh" | "bh" | "height" | "countries" | "age" | "dob" | "hof" | "dod" | "country" | "gladiator" | "active_years" | "years_total" | "name">

  type TitlesAndFinalsType = Pick<PlayerInterface, "finals"> & { titles: { title: string; events: Pick<EventInterface, "eid" | "tid" | "name" | "surface" | "dates" | "draw_type">[] }[] }

  type PlayerActivityType = Pick<EventInterface, "currency" | "dates" | "draw_type" | "eid" | "ename" | "incomplete" | "name" | "points" | "pm" | "rank" | "seed" | "status" | "winner" | "sets" | "tbs" | "player_incomplete" | "matches" | "surface" | "locations" | "tid">

  type PlayerActivityAPIType = {
    stats: PlayerStatsInterface[]
    activity: PlayerActivityType[]
  }

  type H2HPlayerType = Pick<PlayerInterface, "name" | "wins" | "losses" | "pm" | "rh" | "bh" | "country" | "pro" | "titles" | "dob" | "height" | "ch">

  type H2HMatchType = Pick<MatchInterface, "name" | "tid" | "eid" | "mid" | "winner" | "round" | "surface" | "year" | "sets" | "tbs" | "incomplete">

  type MatchPlayerType = Pick<PlayerInterface, "id" | "name" | "country"> & Pick<EventInterface, "seed" | "status" | "rank" | "sets" | "tbs" | "incomplete">

  type MatchDetailsType = Pick<MatchInterface, "name" | "surface" | "dates" | "date" | "court" | "umpire" | "duration" | "winner" | "round" | "p1" | "p2" | "aces" | "dfs" | "serve1" | "serve2" | "bps_saved" | "ret1" | "ret2" | "bps_converted" | "winners" | "ues" | "net" | "max_speed" | "avg1_speed" | "avg2_speed">

  type ResultsMatchType = Pick<MatchInterface, "mid" | "date" | "court" | "duration" | "incomplete" | "umpire" | "loser"> & { winner: MatchPlayerType }

  type DrawMatchType = Pick<MatchInterface, "round" | "mid" | "incomplete" | "winner" | "p1" | "p2">
}

export {}
