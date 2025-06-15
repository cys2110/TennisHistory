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
    age: number | null
    atp_link: string | null
    bh: "One" | "Two" | null
    ch_doubles: number | null
    ch_singles: number | null
    challenger_doubles_loss: number
    challenger_doubles_titles: number
    challenger_doubles_wins: number
    challenger_q_doubles_loss: number
    challenger_q_doubles_wins: number
    challenger_q_singles_loss: number
    challenger_q_singles_wins: number
    challenger_singles_loss: number
    challenger_singles_titles: number
    challenger_singles_wins: number
    coaches: CoachType[]
    country: CountryInterface
    countries: (CountryInterface & { dates: string })[]
    current_doubles: number | null
    current_singles: number | null
    dob: string | null
    dod: string | null
    doubles_ch_date: string | null
    height: number | null
    hof: number | null
    id: string
    itf_doubles_loss: number
    itf_doubles_titles: number
    itf_doubles_wins: number
    itf_q_doubles_loss: number
    itf_q_doubles_wins: number
    itf_q_singles_loss: number
    itf_q_singles_wins: number
    itf_singles_loss: number
    itf_singles_titles: number
    itf_singles_wins: number
    first_name: string
    last_name: string
    max_year: number | null
    min_year: number | null
    name: string
    official_link: string | null
    pm: number | null
    retired: number | null
    rh: boolean | null
    singles_ch_date: string | null
    tour: TourType
    tour_doubles_loss: number
    tour_doubles_titles: number
    tour_doubles_wins: number
    tour_q_doubles_loss: number
    tour_q_doubles_wins: number
    tour_q_singles_loss: number
    tour_q_singles_wins: number
    tour_singles_loss: number
    tour_singles_titles: number
    tour_singles_wins: number
    turned_pro: number | null
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
