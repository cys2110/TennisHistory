declare global {
  type APIStatusType = "idle" | "pending" | "success" | "error"

  type DrawType = "Main" | "Qualifying"

  type LevelType = "Tour" | "Challenger" | "ITF"

  type MatchType = "Singles" | "Doubles"

  interface TournamentInterface {
    abolished?: number
    established?: number
    id: number
    name: string
    tours: (keyof typeof TourEnum)[]
    updated_at: string
    website?: string
  }

  interface EditionInterface {
    category?: string
    currency?: keyof typeof CurrencyEnum
    draw_type?: string
    draw_link?: string
    end_date?: string
    id: number
    start_date?: string
    sponsor_name?: string
    surface?: SurfaceInterface
    tfc?: number
    tournament: TournamentInterface
    tours: (keyof typeof TourEnum)[]
    updated_at: string
    venues?: VenueInterface[]
    wiki_link?: string
    winners: {
      tour: keyof typeof TourEnum
      type: MatchType
      team: PersonInterface[]
    }[]
    year: number
  }

  interface EventInterface {
    category?: string
    currency?: keyof typeof CurrencyEnum
    d_draw?: string
    d_link?: string
    edition: EditionInterface
    end_date?: string
    id: string
    level: LevelType
    pm?: number
    qd_draw?: string
    qd_link?: string
    qs_draw?: string
    qs_link?: string
    s_draw?: string
    s_link?: string
    site_link: string
    sponsor_name?: string
    start_date?: string
    supervisors?: PersonInterface[]
    surface?: SurfaceInterface
    tfc?: number
    tour: keyof typeof TourEnum
    updated_at: string
    venues: VenueInterface[]
    wiki_link?: string
    winners: {
      type: MatchType
      team: PersonInterface[]
    }[]
  }

  interface RoundInterface {
    currency: keyof typeof CurrencyEnum
    id: string
    number: number
    pm?: number
    points?: number
    round: string
    type: MatchType
  }

  interface MatchInterface {
    court?: string
    date?: string
    draw: DrawType
    duration?: string
    id: string
    incomplete?: keyof typeof IncompleteEnum
    match_no: number
    round: keyof typeof RoundEnum
    tour: keyof typeof TourEnum
    type: MatchType
    umpire: PersonInterface
  }

  interface ScoreInterface {
    avg1_speed?: number
    avg2_speed?: number
    bp_opps?: number
    bps_converted?: number
    bps_faced?: number
    bps_saved?: number
    draw: DrawType
    id: string
    incomplete?: keyof typeof IncompleteEnum
    max_speed?: number
    net?: number
    net_w?: number
    outcome: "Winner" | "Loser"
    ret1?: number
    ret1_w?: number
    ret2?: number
    ret2_w?: number
    return_games?: number
    s1?: number
    s2?: number
    s3?: number
    s4?: number
    s5?: number
    serve1?: number
    serve1_w?: number
    serve2?: number
    serve2_w?: number
    serve_games?: number
    t1?: number
    t2?: number
    t3?: number
    t4?: number
    t5?: number
    team_no: 1 | 2
    tour: keyof typeof TourEnum
    type: MatchType
  }

  interface EntryInterface {
    draw: DrawType
    draws: DrawType[]
    id: string
    pm?: number
    points?: number
    q_seed?: number
    q_status?: keyof typeof StatusEnum
    rank: number
    reason?: string
    relationship: string
    seed?: number
    status?: keyof typeof StatusEnum
    team: PersonInterface[]
    teammate?: string
    type: MatchType
    withdrew: boolean
  }

  interface EntryByPlayerInterface extends PersonInterface {
    singles: EntryInterface | null
    doubles: EntryInterface | null
  }

  interface PlayerInterface extends PersonInterface {
    bh?: "One" | "Two"
    ch_doubles?: number
    ch_singles?: number
    coaches: PersonInterface[]
    current_doubles?: number
    current_singles?: number
    dob?: string
    dod?: string
    doubles_ch_date?: string
    former_coaches?: PersonInterface[]
    former_countries?: CountryInterface[]
    height?: number
    hof?: number
    official_link?: string
    pm: number
    retired?: number
    rh?: "Right" | "Left"
    singles_ch_date?: string
    site_link: string
    tour: keyof typeof TourEnum
    turned_pro?: number
    updated_at: string
    wiki_link?: string
  }

  interface PersonInterface {
    country: CountryInterface
    first_name: string
    id: string
    last_name: string
    rank: number
  }

  interface SurfaceInterface {
    environment: "Indoor" | "Outdoor"
    id: string
    surface: "Clay" | "Grass" | "Hard" | "Carpet"
  }

  interface VenueInterface {
    city: string
    country: CountryInterface
    id: string
    name?: string
  }

  interface CountryInterface {
    alpha2?: string
    id: string
    name: string
  }

  type SelectOptionsType = {
    label: string
    value: string | number
  }

  interface FiltersInterface {
    abolished: number | undefined
    established: number | undefined
    tournaments: SelectOptionsType[]
    tours: (keyof typeof TourEnum)[]
    winners: SelectOptionsType[]
    years: number[]
  }

  interface FormFieldInterface<S> {
    class?: string
    items?: any[]
    key: keyof S
    label: string
    loading?: boolean
    max?: number
    multiple?: boolean
    required?: boolean
    size?: "sm" | "md" | "xs"
    subType?: string
    type: string
  }

  interface DrawInterface {
    rounds: DrawRoundInterface[]
    matches?: DrawMatchInterface[]
    contestants?: {
      [contestantId: string]: DrawContestantInterface
    }
  }

  interface DrawRoundInterface {
    name?: string
  }

  interface DrawMatchInterface {
    roundIndex: number
    order: number
    sides?: DrawSideInterface[]
    matchStatus?: string
    isBronzeMatch?: boolean
    date?: string
    duration?: string
    court?: string
    umpire?: string
  }

  interface DrawContestantInterface {
    entryStatus?: string
    players?: DrawPlayerInterface[]
  }

  interface DrawSideInterface {
    title?: string
    contestantId?: string
    scores?: DrawScoreInterface[]
    isWinner?: boolean
  }

  interface DrawScoreInterface {
    mainScore: number
    subscore?: number
    isWinner?: boolean
  }

  interface DrawPlayerInterface {
    title: string
    nationality: string
  }
}

export {}
