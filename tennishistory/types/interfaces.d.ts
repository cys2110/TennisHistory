declare global {
  interface CountryInterface {
    id: string
    name: string
    alpha2: string | null
  }

  interface VenueInterface {
    name: string | null
    city: string
    country: CountryInterface
  }

  interface TournamentInterface {
    id: string
    name: string
    website: string | null
    years: string
    countryEvents: CountryEventType[]
  }

  interface EventInterface {
    c1: CountryInterface
    c2: CountryInterface
    category: string | null
    currency: CurrencyType | null
    dates: string
    draw_type: DrawType
    eid: string
    ename: string | null
    incomplete: IncompleteType | null
    locations: Pick<VenueInterface, "city" | "country">[]
    loser: Pick<PlayerType, "id" | "name" | "country"> | null
    matches: Pick<MatchInterface, "country" | "id" | "incomplete" | "mid" | "name" | "player_incomplete" | "rank" | "round" | "sets" | "seed" | "status" | "tbs" | "winner">[]
    name: string
    points: string | null
    pm: string | null
    rank: string | null
    rounds: Pick<RoundInterface, "round" | "pm">[]
    score: string
    seed: string | null
    sets: string[]
    start: string
    status: StatusType | null
    supervisors: string[]
    surface: string
    tbs: string[]
    tfc: string | null
    tid: string
    venue: VenueInterface
    venues: VenueInterface[]
    winner: Pick<PlayerInterface, "id" | "name" | "country"> | null
    year: string
  }

  interface MatchInterface {
    aces: number[]
    avg1_speed: number[]
    avg2_speed: number[]
    bps_converted: number[]
    bps_saved: number[]
    country: CountryInterface
    court: string | null
    date: string | null
    dates: string
    dfs: number[]
    duration: string | null
    eid: string
    id: string
    incomplete: IncompleteType | null
    loser: MatchPlayerType
    max_speed: number[]
    mid: string
    name: string
    net: number[]
    p1: MatchPlayerType
    p2: MatchPlayerType
    player_incomplete: IncompleteType | null
    rank: string | null
    ret1: number[]
    ret2: number[]
    round: RoundType
    serve1: number[]
    serve2: number[]
    sets: string[]
    seed: string | null
    status: StatusType | null
    surface: string
    tbs: string[]
    tid: string
    ues: number[]
    umpire: string | null
    winner: string | null
    winners: number[]
    year: string
  }

  interface RoundInterface {
    currency: CurrencyType | null
    pm: string | null
    points: string | null
    round: RoundType
  }

  interface EntryInterface extends Pick<PlayerInterface, "id" | "name" | "country"> {
    last: string
    seed: string | null
    rank: string | null
    rank2: string | null
    withdrew: boolean | string
    reason: string | null
    status: StatusType | null
  }

  interface PlayerInterface {
    active_years: string | null
    age: string | null
    bh: string | null
    ch: string | null
    ch_date: string | null
    coaches: {
      labels: string[]
      id: string
      name: string | null
    }[]
    countries: (CountryInterface & { dates: string })[]
    country: CountryInterface
    dob: string | null
    dod: string | null
    gladiator: boolean
    height: number | null
    hof: string | null
    id: string
    losses: string
    name: string
    pm: string
    pro: string | null
    rh: boolean | null
    titles: string
    wins: string
    wl: string
    years_total: string | null
    finals: {
      title: string
      events: Pick<EventInterface, "eid" | "tid" | "name" | "surface" | "dates" | "draw_type">[]
    }[]
  }

  interface MajorResultsInterface {
    name: string
    tid: string
    round: RoundType
    events: Pick<EventInterface, "eid" | "year">[]
  }

  interface PlayerStatsInterface {
    category: string
    value: string
  }

  interface WLIndexInterface {
    category: string
    stat: string
    wins: number
    losses: number
    titles: number | null
    value: number
  }

  interface PlayerStatsInterface {
    category: string
    value: string
    suffix?: boolean
  }
}

export {}
