declare global {
  interface CountryInterface {
    id: string
    name: string
    alpha2: string | null
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
  }

  interface PlayerInterface {
    bh: string | null
    ch: string | null
    ch_date: string | null
    coaches: CoachType[]
    country: CountryInterface
    dob: string | null
    dod: string | null
    gladiator: boolean
    height: number | null
    hof: string | null
    id: string
    min_year: number | null
    max_year: number | null
    name: string
    pm: string
    retired: string | null
    rh: boolean | null
    turned_pro: string | null
  }

  interface TournamentInterface {
    id: string
    name: string
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
