declare global {
  interface CountryInterface {
    id: string
    name: string
    alpha2: string | null
  }

  interface EntryInterface extends Pick<PlayerInterface, "id" | "name" | "country"> {
    incomplete: IncompleteType | null
    last: string
    pm: string | null
    points: string | null
    rank: string | null
    rank2: string | null
    reason: string | null
    seed: string | null
    sets: string[]
    tbs: (string | null)[]
    status: StatusType | null
    withdrew: boolean | string
  }

  interface EventInterface {
    c1: CountryInterface
    c2: CountryInterface
    category: CategoryEnum | null
    currency: CurrencyType | null
    dates: string
    draw_link: string | null
    draw_type: DrawType
    id: string
    loser: Pick<PlayerInterface, "id" | "name" | "country"> | null
    name: string | null
    pm: string | null
    start_date: string
    score: string
    supervisors: string[]
    surface: string
    tfc: string | null
    tournament: Omit<TournamentInterface, "website">
    venues: VenueInterface[]
    winner: Pick<PlayerInterface, "id" | "name" | "country"> | null
    year: string
  }

  interface GamesSetsLostInterface {
    year: number
    player: Pick<PlayerInterface, "id" | "name" | "country">
    sets_won: number
    sets_lost: number
    games_won: number
    games_lost: number
    sets_pc: number
    games_pc: number
  }

  interface HistoricalPMInterface {
    year: number
    pm: number
    R128?: number
    R64?: number
    R32: number
    R16: number
    QF: number
    SF: number
    F: number
    currency: CurrencyType
    yoy: string
  }

  interface MatchInterface {
    aces: number[]
    avg1_speed: number[]
    avg2_speed: number[]
    bps_converted: number[]
    bps_saved: number[]
    court: string | null
    date: string | null
    dfs: number[]
    duration: string | null
    group: string | null
    id: string
    incomplete: IncompleteType | null
    loser: Pick<
      EntryInterface,
      "id" | "name" | "country" | "seed" | "status" | "sets" | "tbs" | "incomplete"
    >
    match_no: string
    max_speed: number[]
    net: number[]
    p1: Pick<
      EntryInterface,
      "id" | "name" | "country" | "seed" | "status" | "rank" | "sets" | "tbs" | "incomplete"
    >
    p2: Pick<
      EntryInterface,
      "id" | "name" | "country" | "seed" | "status" | "rank" | "sets" | "tbs" | "incomplete"
    >
    ret1: number[]
    ret2: number[]
    round: RoundType
    serve1: number[]
    serve2: number[]
    sets: string[]
    tbs: (string | null)[]
    ues: number[]
    umpire: string | null
    winner: Pick<EntryInterface, "id" | "name" | "country" | "seed" | "status" | "sets" | "tbs">
    winners: number[]
    winner_id: string
  }

  interface PlayerInterface {
    age: string | null
    bh: string | null
    ch: number | null
    ch_date: string | null
    coaches: CoachType[]
    country: CountryInterface
    countries: (CountryInterface & { dates: string })[]
    dob: string | null
    dod: string | null
    gladiator: boolean
    height: number | null
    hof: string | null
    id: string
    losses: number
    min_year: number | null
    max_year: number | null
    name: string
    pm: string
    retired: number | null
    rh: boolean | null
    titles: number
    turned_pro: number | null
    wins: number
  }

  interface RoundInterface {
    round: RoundType
    currency: CurrencyType | null
    pm: string | null
    points: string | null
  }

  interface TournamentFinalistsInterface {
    finals: number
    losses: number
    player: Pick<PlayerInterface, "id" | "name" | "country">
    wins: number
  }

  interface TournamentInterface {
    id: string
    name: string
    website: string | null
    years: string
  }

  interface VenueInterface {
    id: string
    name: string | null
    city: string
    country: CountryInterface
  }

  interface WinnersByAgeInterface {
    age: string
    player: PlayerInterface
    year: string
  }

  interface WLIndexInterface {
    category: CategoryEnum
    stat: string
    wins: number
    losses: number
    titles: number | null
    value: number
  }
}

export {}
