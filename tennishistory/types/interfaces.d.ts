declare global {
  interface CountryInterface {
    id: string
    name: string
    alpha2: string | null
  }

  interface EntryInterface extends Pick<PlayerInterface, "id" | "name" | "country"> {
    incomplete: IncompleteType | null
    pm: string | null
    points: string | null
    rank: string | null
    seed: string | null
    status: string | null
  }

  interface EventInterface {
    category: CategoryEnum | null
    currency: CurrencyType | null
    dates: string
    draw_link: string | null
    draw_type: DrawType
    id: string
    pm: string | null
    name: string | null
    start_date: string
    surface: SurfaceEnum
    tfc: string | null
    tournament: Omit<TournamentInterface, "website">
    venues: VenueInterface[]
    year: string
  }

  interface MatchInterface {
    court: string | null
    date: string | null
    duration: string | null
    group: string | null
    id: string
    incomplete: IncompleteType | null
    match_no: string
    round: RoundType
    sets: string[]
    tbs: (string | null)[]
    winner: Pick<PlayerInterface, "id" | "name" | "country">
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
