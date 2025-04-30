declare global {
  interface CountryInterface {
    id: string
    name: string
    alpha2: string | null
  }

  interface VenueInterface {
    id: string
    name: string | null
    city: string
    country: CountryInterface
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

  interface TournamentInterface {
    id: string
    name: string
    website: string | null
  }
}

export {}
