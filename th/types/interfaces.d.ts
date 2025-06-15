declare global {
  interface CountryInterface {
    id: string
    name: string
    alpha2: string
  }

  interface EntryInterface extends PlayerType {
    incomplete: IncompleteType | null
    last: string
    pm: string | null
    points: number | null
    q_seed: number | null
    q_status: string | null
    rank: number | null
    rank2: number | null
    reason: string | null
    seed: number | null
    sets: string[]
    status: StatusType | null
    tbs: (string | null)[]
    withdrew: boolean | string
  }

  interface EventInterface {
    atp_category: CategoryType | null
    atp_dates: string | null
    atp_link: string | null
    category: CategoryType | null
    dates: string | null
    id: number
    name: string | null
    start_date: string
    surface: SurfaceInterface
    tournament: Pick<TournamentInterface, "id" | "name">
    tours: TourType[]
    venues: VenueInterface[]
    wiki_link: string | null
    wta_category: CategoryType | null
    wta_dates: string | null
    wta_link: string | null
    year: number
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
    loser: Pick<EntryInterface, "id" | "name" | "country" | "seed" | "status" | "sets" | "tbs" | "incomplete">
    match_no: number
    max_speed: number[]
    net: number[]
    p1: Pick<EntryInterface, "id" | "name" | "country" | "seed" | "status" | "rank" | "sets" | "tbs" | "incomplete">
    p2: Pick<EntryInterface, "id" | "name" | "country" | "seed" | "status" | "rank" | "sets" | "tbs" | "incomplete">
    ret1: number[]
    ret2: number[]
    round: RoundType
    serve1: number[]
    serve2: number[]
    sets: string[]
    tbs: (string | null)[]
    type: ("Singles" | "Doubles" | "ATP" | "WTA" | "Main" | "Qualifying")[]
    ues: number[]
    umpire: string | null
    winner: Pick<EntryInterface, "id" | "name" | "country" | "seed" | "status" | "sets" | "tbs">
    winners: number[]
    winner_id: string
  }

  interface PlayerInterface {
    atp_link: string | null
    country: CountryInterface
    id: string
    last_name: string
    max_year: number | null
    min_year: number | null
    name: string
    official_link: string | null
    tour: TourType
    wiki_link: string | null
    wta_link: string | null
  }

  interface SurfaceInterface {
    id: string
    surface: SurfaceType
    environment: EnvironmentType
  }

  interface TournamentInterface {
    abolished: number | null
    established: number | null
    id: number
    name: string
    tours: TourType[]
    website: string | null
  }

  interface VenueInterface {
    id: string
    name: string | null
    city: string
    country: CountryInterface
  }
}

export {}
